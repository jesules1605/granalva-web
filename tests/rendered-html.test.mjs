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
  ["/servicios/lavanderia-sierra-nevada", "Lavandería en Sierra Nevada para hoteles y apartamentos | Granalva", "Lavandería profesional en Sierra Nevada para hoteles y apartamentos"],
  ["/servicios/limpieza-apartamentos-turisticos-granada", "Limpieza de apartamentos turísticos en Granada | Granalva", "Limpieza de apartamentos turísticos en Granada"],
  ["/servicios/limpieza-oficinas-locales-granada", "Limpieza de oficinas y locales comerciales en Granada | Granalva", "Limpieza de oficinas y locales comerciales en Granada"],
  ["/servicios/limpieza-fin-de-obra-granada", "Limpieza fin de obra y reformas en Granada | Granalva", "Limpieza fin de obra y después de reformas en Granada"],
  ["/servicios/renting-textil-granada", "Renting textil en Granada para alojamientos | Granalva", "Renting textil para alojamientos y empresas en Granada"],
  ["/servicios/lavanderia-domicilio-granada", "Lavandería a domicilio en Granada con recogida | Granalva", "Lavandería a domicilio con recogida y entrega en Granada"],
  ["/contacto", "Contacto y presupuestos de limpieza y lavandería | Granalva", "Contacto y presupuestos de limpieza y lavandería"],
  ["/sobre-nosotros", "Sobre nosotros: equipo de limpieza y lavandería en Granada | Granalva", "Sobre Granalva: limpieza y lavandería con equipo propio en Granada"],
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
  // CTA por prioridad comercial: empresa primero, particular como acceso secundario.
  for (const cta of ["Solicitar presupuesto empresarial", "Contratar lavandería profesional", "Reservar ruta de temporada", "Hacer un pedido particular"]) {
    assert.ok(body.includes(cta), `CTA ausente: ${cta}`);
  }
  assert.ok(body.indexOf("Solicitar presupuesto empresarial") < body.indexOf("Hacer un pedido particular"), "el CTA de empresa debe ir antes");
  // Bloque estacional de Sierra Nevada.
  assert.match(body, /TEMPORADA 2026\/27 · SIERRA NEVADA/);
  assert.match(body, /¿Estás preparando la temporada en Sierra Nevada\?/);
  // Selector de servicios para empresas: sus paneles están en el HTML inicial (no dependen de JavaScript).
  for (const panel of ["limpieza", "lavanderia", "renting"]) {
    assert.match(home, new RegExp(`id="servicio-panel-${panel}"`), `panel ${panel}`);
  }
  assert.equal((home.match(/id="servicio-tab-[a-z]+"/g) ?? []).length, 3, "3 pestañas en el selector de empresas");
  // La portada enlaza todos los servicios desde el contenido.
  for (const path of servicePaths) assert.match(home, new RegExp(`href="${escape(path)}"`), `portada → ${path}`);
});

test("las páginas de servicio muestran breadcrumbs, cobertura, CTA y 2-4 servicios relacionados", () => {
  for (const path of ["/servicios", "/contacto", "/sobre-nosotros", ...servicePaths]) {
    const page = html.get(path);
    assert.match(page, /<nav class="breadcrumbs[^"]*" aria-label="Ruta de navegación">/, `${path}: breadcrumbs`);
  }
  for (const path of servicePaths) {
    const page = html.get(path);
    assert.match(page, /href="(\/contacto\?servicio=[a-z-]+#formulario|#reservar-ruta)"/, `${path}: enlace al formulario`);
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

test("Sierra Nevada: landing completa, formulario propio y área de servicio específica", () => {
  const page = html.get("/servicios/lavanderia-sierra-nevada");
  const body = text(page);
  assert.match(page, /id="reservar-ruta"/, "formulario de reserva");
  assert.ok(body.includes("Preparar mi temporada"), "CTA principal");
  assert.ok(body.includes("La temporada se prepara antes de que empiece."), "frase editorial");
  // Detalle en acordeones accesibles: botones reales, aria-expanded/aria-controls y texto en el HTML.
  const buttons = all(page, /(<button[^>]*class="accordion__button"[^>]*>)/g);
  assert.ok(buttons.length >= 8, `acordeones: ${buttons.length}`);
  for (const button of buttons) {
    assert.match(button, /aria-expanded="(true|false)"/);
    assert.match(button, /aria-controls="[^"]+"/);
  }
  for (const heading of ["Lavandería para hoteles en Sierra Nevada", "Lavandería para apartamentos turísticos en Sierra Nevada", "Rutas de recogida y entrega programadas", "Sábanas, toallas y textiles de alojamiento", "Preparados para los momentos de mayor ocupación"]) {
    assert.ok(body.includes(heading), `apartado: ${heading}`);
  }
  assert.doesNotMatch(page, /hidden=""[^>]*class="accordion__panel"|class="accordion__panel"[^>]*hidden=""/, "los paneles no usan hidden simple (texto oculto)");
  assert.match(page, /<input type="hidden" name="formulario" value="sierra-nevada"/, "formulario B2B de Sierra Nevada");
  assert.ok(body.includes("Zona de servicio."), "cobertura");
  assert.doesNotMatch(body, /limpieza de alojamientos en Sierra Nevada/i, "la limpieza en Sierra Nevada no está confirmada");
  const service = nodesOf(jsonLd(page)).find((node) => hasType(node, "Service"));
  assert.deepEqual(service.areaServed, [{ "@type": "Place", name: "Sierra Nevada (Granada)" }]);
});

test("cada URL del sitemap cumple los requisitos de indexación", async () => {
  const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const known = new Set(pages.map(([path]) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`)));
  for (const loc of all(sitemap, /<loc>([^<]+)<\/loc>/g)) {
    assert.ok(known.has(loc), `URL del sitemap sin cubrir en las pruebas: ${loc}`);
    const path = loc.slice(SITE_URL.length) || "/";
    const response = await fetch(`${BASE}${path}`, { redirect: "manual" });
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get("x-robots-tag"), null, `${path}: X-Robots-Tag`);
    const page = await response.text();
    assert.match(page, /<title>[^<]{10,}<\/title>/, `${path}: title`);
    assert.match(page, /<meta name="description" content="[^"]{70,}"/, `${path}: description`);
    assert.match(page, /<link rel="canonical" href="https:\/\//, `${path}: canonical`);
    assert.equal((page.match(/<h1[\s>]/g) ?? []).length, 1, `${path}: un único H1`);
    assert.doesNotMatch(page, /<meta name="robots" content="[^"]*noindex/, `${path}: noindex accidental`);
    assert.ok(jsonLd(page).length >= 2, `${path}: JSON-LD de la empresa y de la página`);
    assert.match(page, /href="(\/contacto[^"]*|#contacto|#reservar-ruta|tel:\+34744488964)"/, `${path}: CTA`);
  }
});

test("no hay contenido duplicado significativo entre páginas indexables", () => {
  // Texto propio: contenido de <main> sin los componentes de interfaz comunes
  // (cabecera, pie, cinta y formulario de solicitud, idénticos en varias páginas).
  const mainText = (page) => text((page.match(/<main[\s\S]*?<\/main>/)?.[0] ?? page).replace(/<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>|<div class="top-ribbon"[\s\S]*?<\/div><\/div>|<form[\s\S]*?<\/form>/g, " "));
  const shingles = (value) => {
    const words = value.toLowerCase().split(/\s+/).filter(Boolean);
    const set = new Set();
    for (let index = 0; index + 5 <= words.length; index += 1) set.add(words.slice(index, index + 5).join(" "));
    return set;
  };
  const sets = pages.map(([path]) => [path, shingles(mainText(html.get(path)))]);
  const report = [];
  for (let a = 0; a < sets.length; a += 1) {
    for (let b = a + 1; b < sets.length; b += 1) {
      const [pathA, setA] = sets[a];
      const [pathB, setB] = sets[b];
      let shared = 0;
      for (const item of setA) if (setB.has(item)) shared += 1;
      const similarity = shared / Math.min(setA.size, setB.size);
      report.push([similarity, pathA, pathB]);
      assert.ok(similarity < 0.5, `${pathA} y ${pathB} comparten el ${Math.round(similarity * 100)} % del texto`);
    }
  }
  const [max, pathA, pathB] = report.sort((x, y) => y[0] - x[0])[0];
  console.log(`# máxima similitud entre páginas: ${Math.round(max * 100)} % (${pathA} ↔ ${pathB})`);
});

test("el panel y la API de Payload no son indexables ni públicos", async () => {
  const admin = await fetch(`${BASE}/admin`, { redirect: "manual" });
  assert.equal(admin.headers.get("x-robots-tag"), "noindex, nofollow");
  const api = await fetch(`${BASE}/api/contact-submissions`);
  assert.equal(api.headers.get("x-robots-tag"), "noindex, nofollow");
  assert.ok([401, 403].includes(api.status), `las solicitudes no deben ser públicas (HTTP ${api.status})`);
  const create = await fetch(`${BASE}/api/contact-submissions`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  assert.ok([401, 403].includes(create.status), `no se pueden crear solicitudes desde la API pública (HTTP ${create.status})`);
});

test("los formularios están en el HTML inicial (funcionan sin JavaScript)", () => {
  for (const path of ["/", "/contacto", "/servicios/lavanderia-sierra-nevada"]) {
    const page = html.get(path);
    const main = page.match(/<main[\s\S]*<\/main>/)?.[0] ?? "";
    assert.match(main, /<form[^>]*class="contact-form"/, `${path}: formulario dentro de <main>`);
    assert.doesNotMatch(page, /<div hidden id="S:/, `${path}: contenido diferido que requiere JavaScript`);
    assert.match(main, /name="consentimiento"/, `${path}: consentimiento`);
    assert.match(main, /name="website"/, `${path}: campo trampa antispam`);
  }
});

test("la marquesina es un bucle de dos grupos idénticos y la sección de sectores es compacta", () => {
  const home = html.get("/");
  const groups = all(home, /(<ul class="ribbon-group"[^>]*>[\s\S]*?<\/ul>)/g);
  assert.equal(groups.length, 2, "dos grupos");
  assert.equal(text(groups[0]), text(groups[1]), "grupos idénticos");
  assert.match(groups[1], /aria-hidden="true"/, "el segundo grupo no se lee dos veces");
  assert.doesNotMatch(text(home), /Trabajamos con negocios que dependen de una operación impecable/, "párrafo eliminado");
  assert.equal((home.match(/class="sector-card"/g) ?? []).length, 6, "seis sectores, sin duplicados de marquesina");
});

test("la portada sigue el orden acordado, enlaza sectores y muestra reseñas reales con plataforma", () => {
  const home = html.get("/");
  const order = ['id="inicio"', 'id="empresas"', 'id="servicios"', 'id="lavanderia"', 'id="clientes"', 'id="como-funciona"', 'class="authority-strip"', 'id="reviews-title"', 'id="equipo-title"', 'id="cta-final-title"', 'id="contacto"', '<footer class="footer"'];
  let last = -1;
  for (const marker of order) {
    const at = home.indexOf(marker);
    assert.ok(at > last, `orden de portada: ${marker}`);
    last = at;
  }
  // Recorridos principales.
  for (const label of ["Solicitar presupuesto", "Hacer un pedido de lavandería", "Servicios para empresas", "Servicios para particulares"]) assert.ok(text(home).includes(label), `recorrido ${label}`);
  // Seis sectores, cada uno enlazado a una página real.
  const sectorLinks = [...home.matchAll(/class="sector-card__link" href="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(sectorLinks.length, 6, "6 sectores enlazados");
  for (const href of sectorLinks) assert.ok(html.has(href), `sector → ${href} existe`);
  // Reseñas: plataforma visible y sin valoraciones en JSON-LD.
  assert.ok((text(home).match(/Reseña en Google/g) ?? []).length >= 8, "reseñas con plataforma");
  assert.doesNotMatch(home, /"(aggregateRating|review)"/);
  // Sin logotipos autorizados no se muestra la sección de empresas colaboradoras.
  assert.doesNotMatch(home, /client-logos/);
  // Sin minipárrafos decorativos junto a los títulos de proceso y servicios.
  assert.doesNotMatch(text(home), /Una operativa clara para empresas y particulares/);
});

test("todas las páginas de servicio usan la portada común ServiceHero con fotografía", () => {
  for (const path of servicePaths) {
    const page = html.get(path);
    assert.match(page, /<section class="s-hero">/, `${path}: ServiceHero`);
    assert.match(page, /class="s-hero__media"><img alt="[^"]{10,}"/, `${path}: imagen con alt`);
    assert.match(page, /class="s-hero__scrim" aria-hidden="true"/, `${path}: capa azul`);
  }
  const sierra = html.get("/servicios/lavanderia-sierra-nevada");
  for (const literal of ["SERVICIO DE TEMPORADA · SIERRA NEVADA", "Lavandería profesional en Sierra Nevada para hoteles y apartamentos", "La temporada se prepara antes de que empiece.", "Preparar mi temporada"]) {
    assert.ok(text(sierra).includes(literal), `Sierra: ${literal}`);
  }
});
