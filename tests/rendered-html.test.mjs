// Pruebas de SEO sobre el HTML renderizado: arrancan la build de producción
// (`next start`) y comprueban por HTTP cada ruta indexable.
// El mapa de títulos y H1 es el acordado con el propietario (docs/seo-strategy.md):
// si cambia el contenido, actualiza ambos a la vez.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { request as httpRequest } from "node:http";
import { after, before, test } from "node:test";

const PORT = Number(process.env.TEST_PORT ?? 4310);
const BASE = `http://127.0.0.1:${PORT}`;
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://limpiezasgranalva.com").replace(/\/+$/, "");

const pages = [
  ["/", "Empresa de limpieza y lavandería en Granada | Granalva", "Empresa de limpieza y lavandería profesional en Granada"],
  ["/servicios", "Servicios de limpieza y lavandería en Granada | Granalva", "Servicios de limpieza y lavandería en Granada. Cada servicio, bien definido."],
  ["/servicios/empresa-limpieza-granada", "Empresa de limpieza profesional en Granada | Granalva", "Empresa de limpieza profesional en Granada"],
  ["/servicios/lavanderia-profesional-granada", "Lavandería profesional en Granada para empresas | Granalva", "Lavandería profesional para empresas en Granada"],
  ["/servicios/lavanderia-hoteles-granada", "Lavandería para hoteles en Granada | Granalva", "Lavandería para hoteles y alojamientos en Granada"],
  ["/servicios/lavanderia-apartamentos-turisticos-granada", "Lavandería para apartamentos turísticos en Granada | Granalva", "Lavandería para apartamentos turísticos en Granada"],
  ["/servicios/limpieza-apartamentos-turisticos-granada", "Limpieza de apartamentos turísticos en Granada | Granalva", "Limpieza de apartamentos turísticos en Granada"],
  ["/servicios/limpieza-oficinas-locales-granada", "Limpieza de oficinas y locales comerciales en Granada | Granalva", "Limpieza de oficinas y locales comerciales en Granada"],
  ["/servicios/limpieza-fin-de-obra-granada", "Limpieza fin de obra y reformas en Granada | Granalva", "Limpieza fin de obra y después de reformas en Granada"],
  ["/servicios/renting-textil-granada", "Renting textil en Granada para alojamientos | Granalva", "Renting textil para alojamientos y empresas en Granada"],
  ["/servicios/lavanderia-domicilio-granada", "Lavandería a domicilio en Granada con recogida | Granalva", "Lavandería a domicilio con recogida y entrega en Granada"],
];
const servicePaths = pages.map(([path]) => path).filter((path) => path.startsWith("/servicios/"));

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const decode = (value) =>
  value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const text = (html) => decode(html.replace(/<!--.*?-->/gs, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim();
const attr = (html, re) => decode(html.match(re)?.[1] ?? "");
const all = (html, re) => [...html.matchAll(re)].map((match) => match[1]);
const jsonLd = (html) => all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map((raw) => JSON.parse(raw));
const nodesOf = (blocks) => blocks.flatMap((block) => block["@graph"] ?? [block]);
const hasType = (node, type) => [].concat(node["@type"]).includes(type);

let server;
const html = new Map();

before(async () => {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT), "-H", "127.0.0.1"], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
    env: { ...process.env, NODE_ENV: "production" },
  });
  let log = "";
  server.stdout.on("data", (chunk) => (log += chunk));
  server.stderr.on("data", (chunk) => (log += chunk));
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(`${BASE}/robots.txt`)).ok) break;
    } catch {
      // El servidor todavía no acepta conexiones.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  if (Date.now() >= deadline) {
    stopServer();
    throw new Error(`next start no respondió en 60 s:\n${log}`);
  }
  for (const [path] of pages) {
    const response = await fetch(`${BASE}${path}`, { headers: { accept: "text/html" } });
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, path);
    html.set(path, await response.text());
  }
});

// Detiene next start y sus procesos hijos (grupo de procesos completo).
function stopServer() {
  if (!server?.pid) return;
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    // El proceso ya había terminado.
  }
}

after(stopServer);

test("cada página tiene title, H1, description y canonical propios", () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [path, title, h1] of pages) {
    const page = html.get(path);
    assert.equal(attr(page, /<title>([^<]*)<\/title>/), title, `${path}: title`);
    const h1s = all(page, /<h1[^>]*>([\s\S]*?)<\/h1>/g);
    assert.equal(h1s.length, 1, `${path}: debe haber exactamente un H1`);
    assert.equal(text(h1s[0]), h1, `${path}: H1`);

    const description = attr(page, /<meta name="description" content="([^"]*)"/);
    assert.ok(description.length >= 70 && description.length <= 165, `${path}: description de ${description.length} caracteres`);
    assert.ok(!titles.has(title), `title duplicado: ${title}`);
    assert.ok(!descriptions.has(description), `description duplicada en ${path}`);
    titles.add(title);
    descriptions.add(description);

    // Canonical autorreferente y absoluto (la raíz admite barra final: es la misma URL).
    const canonical = attr(page, /<link rel="canonical" href="([^"]*)"/);
    const expected = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
    assert.ok(canonical === expected || canonical === `${expected}/`, `${path}: canonical ${canonical}`);
    assert.doesNotMatch(page, /noindex/i, path);

    for (const property of ["og:title", "og:description", "og:image", "og:url"]) {
      assert.match(page, new RegExp(`<meta property="${property}" content="[^"]+"`), `${path}: ${property}`);
    }
    assert.match(page, /<meta name="twitter:card" content="summary_large_image"/, `${path}: twitter:card`);
  }
});

test("la portada contiene en el HTML inicial la propuesta acordada", () => {
  const home = html.get("/");
  const body = text(home);
  assert.match(body, /Servicios de limpieza para empresas, hoteles y apartamentos turísticos, lavandería profesional con recogida y entrega, renting textil y soluciones para particulares en Granada\./);
  assert.match(body, /Tu empresa no puede parar\. Tu hogar tampoco debería esperar\./);
  assert.match(home, />Solicitar presupuesto <span>→<\/span><\/a>/);
  assert.match(home, />Hacer un pedido <span>→<\/span><\/a>/);
  // La portada enlaza todos los servicios desde el contenido.
  for (const path of servicePaths) assert.match(home, new RegExp(`href="${escape(path)}"`), `portada → ${path}`);
});

test("las páginas de servicio muestran breadcrumbs, cobertura, CTA y 2-4 servicios relacionados", () => {
  for (const path of ["/servicios", ...servicePaths]) {
    const page = html.get(path);
    assert.match(page, /<nav class="breadcrumbs[^"]*" aria-label="Ruta de navegación">/, `${path}: breadcrumbs`);
  }
  for (const path of servicePaths) {
    const page = html.get(path);
    assert.match(page, /href="\/#contacto"/, `${path}: enlace al formulario`);
    assert.match(page, /href="tel:\+34744488964"/, `${path}: teléfono`);
    assert.match(text(page), /Zona de servicio\./, `${path}: cobertura`);
    assert.match(page, /<time dateTime="\d{4}-\d{2}-\d{2}">/, `${path}: fecha de revisión`);
    const relatedBlock = page.match(/class="related-services__grid">([\s\S]*?)<\/section>/)?.[1] ?? "";
    const related = new Set(all(relatedBlock, /href="(\/servicios\/[^"]+)"/g));
    assert.ok(related.size >= 2 && related.size <= 4, `${path}: ${related.size} servicios relacionados`);
    assert.ok(!related.has(path), `${path}: no debe enlazarse a sí misma como relacionada`);
    assert.doesNotMatch(relatedBlock, />\s*(Ver más|Ver servicio)\s*</i, `${path}: anclas genéricas`);
  }
});

test("los datos estructurados son válidos, veraces y coinciden con lo visible", () => {
  for (const [path, , h1] of pages) {
    const page = html.get(path);
    const nodes = nodesOf(jsonLd(page));
    assert.ok(nodes.some((node) => hasType(node, "Organization") && hasType(node, "ProfessionalService")), `${path}: Organization`);
    assert.ok(nodes.some((node) => hasType(node, "WebSite")), `${path}: WebSite`);
    // Sin valoraciones agregadas ni reseñas de la propia empresa.
    assert.doesNotMatch(page, /"(AggregateRating|Review|aggregateRating|review)"/, `${path}: reseñas en JSON-LD`);
    const organization = nodes.find((node) => hasType(node, "Organization"));
    assert.equal(organization.telephone, "+34744488964");
    assert.equal(organization.url, SITE_URL);
    assert.equal(organization.legalName, undefined, "legalName solo con la razón social real");

    for (const faq of nodes.filter((node) => hasType(node, "FAQPage"))) {
      for (const question of faq.mainEntity) {
        assert.ok(text(page).includes(question.name), `${path}: pregunta FAQ no visible: ${question.name}`);
        assert.ok(text(page).includes(question.acceptedAnswer.text), `${path}: respuesta FAQ no visible`);
      }
    }

    if (path.startsWith("/servicios/")) {
      const service = nodes.find((node) => hasType(node, "Service"));
      assert.equal(service?.name, h1, `${path}: Service.name`);
      assert.equal(service?.url, `${SITE_URL}${path}`);
      const breadcrumb = nodes.find((node) => hasType(node, "BreadcrumbList"));
      assert.deepEqual(breadcrumb.itemListElement.map((item) => item.item), [SITE_URL, `${SITE_URL}/servicios`, `${SITE_URL}${path}`]);
      assert.ok(nodes.some((node) => hasType(node, "FAQPage")), `${path}: FAQPage`);
      assert.match(nodes.find((node) => hasType(node, "WebPage"))?.dateModified ?? "", /^\d{4}-\d{2}-\d{2}$/);
    }
  }
});

test("todas las imágenes tienen atributo alt", () => {
  for (const [path] of pages) {
    for (const img of all(html.get(path), /(<img\b[^>]*>)/g)) {
      assert.match(img, /\balt="/, `${path}: imagen sin alt: ${img.slice(0, 120)}`);
    }
  }
});

test("los enlaces internos responden 200 y no hay páginas huérfanas", async () => {
  const linkedFrom = new Map(pages.map(([path]) => [path, new Set()]));
  const targets = new Set();
  for (const [path] of pages) {
    for (const href of all(html.get(path), /<a [^>]*href="(\/[^"#?]*)/g)) {
      targets.add(href);
      if (linkedFrom.has(href) && href !== path) linkedFrom.get(href).add(path);
    }
  }
  for (const target of targets) {
    const response = await fetch(`${BASE}${target}`, { redirect: "manual" });
    assert.equal(response.status, 200, `enlace interno roto: ${target}`);
  }
  for (const [path, sources] of linkedFrom) {
    if (path !== "/") assert.ok(sources.size > 0, `página huérfana: ${path}`);
  }
});

test("sitemap y robots solo exponen las URLs indexables", async () => {
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const locs = all(sitemap, /<loc>([^<]+)<\/loc>/g).sort();
  assert.deepEqual(locs, pages.map(([path]) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`)).sort());
  assert.equal(all(sitemap, /<lastmod>([^<]+)<\/lastmod>/g).length, pages.length, "lastmod en cada URL");

  const robots = await (await fetch(`${BASE}/robots.txt`)).text();
  assert.match(robots, /Allow: \/\n/);
  for (const path of ["/admin", "/api/", "/preview"]) assert.match(robots, new RegExp(`Disallow: ${escape(path)}\\n`));
  assert.match(robots, new RegExp(`Sitemap: ${escape(SITE_URL)}/sitemap\\.xml`));
  assert.doesNotMatch(robots, /^Host:/m);
});

test("las direcciones inexistentes devuelven una 404 diseñada y no indexable", async () => {
  for (const path of ["/pagina-que-no-existe", "/servicios/no-existe"]) {
    const response = await fetch(`${BASE}${path}`);
    assert.equal(response.status, 404, path);
    const page = await response.text();
    assert.match(page, /<meta name="robots" content="noindex/, `${path}: noindex`);
    assert.match(page, /<h1/, `${path}: H1`);
    for (const service of servicePaths) assert.match(page, new RegExp(`href="${escape(service)}"`), `${path}: enlace a ${service}`);
  }
});

test("las URLs antiguas y con barra final redirigen con un único 301", async () => {
  const cases = [
    ["/servicios-de-limpieza-granada", "/servicios"],
    ["/servicios-de-limpieza-granada/", "/servicios"],
    ["/servicios/renting-textil-granada/", "/servicios/renting-textil-granada"],
  ];
  for (const [from, to] of cases) {
    const response = await fetch(`${BASE}${from}`, { redirect: "manual" });
    assert.equal(response.status, 301, from);
    const location = new URL(response.headers.get("location"), BASE);
    assert.equal(location.pathname, to, from);
    const final = await fetch(location, { redirect: "manual" });
    assert.equal(final.status, 200, `${from}: el destino debe responder 200 sin otra redirección`);
  }
});

test("el host con www redirige con 301 al dominio canónico sin www", async () => {
  const canonical = new URL(SITE_URL);
  const response = await new Promise((resolve, reject) => {
    const req = httpRequest({ host: "127.0.0.1", port: PORT, path: "/servicios", headers: { host: `www.${canonical.host}` } }, resolve);
    req.on("error", reject);
    req.end();
  });
  response.resume();
  assert.equal(response.statusCode, 301);
  assert.equal(response.headers.location, `${canonical.origin}/servicios`);
});
