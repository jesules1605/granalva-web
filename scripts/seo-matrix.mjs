

/** Lee el índice de sitemaps y devuelve el XML concatenado de los sitemaps hijos. */
async function readSitemaps(base) {
  const index = await (await fetch(`${base}/sitemap.xml`)).text();
  const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  let xml = "";
  for (const path of children) xml += await (await fetch(`${base}${path}`)).text();
  return xml;
}
// Genera la matriz SEO de todas las páginas recorriendo la web en marcha.
// Uso: node scripts/seo-matrix.mjs http://localhost:3000 > docs/SEO-MATRIX.md
// Las páginas publicadas se leen del HTML real; las planificadas se declaran abajo.
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/+$/, "");
const { servicePages, SITE_URL } = await import("../app/lib/services.ts");

const AUDIENCE = {
  "empresa-limpieza-granada": "Empresas, oficinas, comercios, centros",
  "lavanderia-profesional-granada": "Empresas y alojamientos",
  "lavanderia-hoteles-granada": "Hoteles, hostales, apartahoteles",
  "lavanderia-apartamentos-turisticos-granada": "Gestores y propietarios de apartamentos turísticos",
  "lavanderia-sierra-nevada": "Hoteles, apartamentos y gestores de Sierra Nevada",
  "limpieza-apartamentos-turisticos-granada": "Gestores y propietarios de apartamentos turísticos",
  "limpieza-oficinas-locales-granada": "Oficinas, despachos, comercios y locales",
  "limpieza-fin-de-obra-granada": "Promotoras, empresas de reformas, propietarios",
  "renting-textil-granada": "Hoteles, apartamentos y alojamientos",
  "lavanderia-domicilio-granada": "Particulares",
};

const published = [
  { path: "/", intent: "Empresa de limpieza y lavandería en Granada (visión global y marca)", audience: "Empresas (≈75 %) y particulares (≈25 %)", primary: "empresa de limpieza y lavandería Granada", secondary: "Limpiezas Granalva (marca); limpieza y lavandería profesional Granada" },
  { path: "/servicios", intent: "Explorar todos los servicios (índice que reparte autoridad)", audience: "Todos", primary: "servicios de limpieza y lavandería Granada", secondary: "(navegacional)" },
  ...servicePages.map((service) => ({ path: `/servicios/${service.slug}`, intent: service.intent, audience: AUDIENCE[service.slug] ?? "", primary: service.primaryKeyword, secondary: service.secondaryKeywords.join("; ") })),
  { path: "/contacto", intent: "Contactar o pedir presupuesto (navegacional y de conversión)", audience: "Todos", primary: "contacto Limpiezas Granalva", secondary: "presupuesto limpieza Granada; presupuesto lavandería Granada" },
  { path: "/sobre-nosotros", intent: "Conocer la empresa y el equipo (confianza y marca)", audience: "Empresas que evalúan proveedor", primary: "Granalva empresa de limpieza Granada (marca)", secondary: "equipo de limpieza y lavandería en Granada" },
];

const planned = [
  { path: "/casos-de-exito", status: "Planificada (fase 8). Se publicará solo con casos reales autorizados", index: "index al publicar", intent: "Prueba de resultados por servicio", audience: "Empresas que evalúan proveedor", primary: "casos de éxito limpieza y lavandería Granada", cta: "Solicitar presupuesto empresarial" },
  { path: "/blog", status: "Planificada (fase 5): índice del blog desde Payload", index: "index", intent: "Resolver dudas informativas que llevan a servicios", audience: "Gestores, hoteles, empresas y particulares", primary: "(por artículo, ver CALENDARIO-EDITORIAL.md)", cta: "Enlace a la página comercial de cada artículo" },
  { path: "/aviso-legal", status: "Planificada (fase 7). Hoy existe en WordPress con el mismo slug", index: "index (noindex opcional)", intent: "Legal (LSSI-CE)", audience: "Todos", primary: "—", cta: "—" },
  { path: "/politica-de-privacidad", status: "Planificada (fase 7). Mismo slug que en WordPress", index: "index (noindex opcional)", intent: "Legal (RGPD/LOPDGDD)", audience: "Todos", primary: "—", cta: "—" },
  { path: "/politica-de-cookies", status: "Planificada (fase 7). Mismo slug que en WordPress", index: "index (noindex opcional)", intent: "Legal (cookies)", audience: "Todos", primary: "—", cta: "—" },
  { path: "/declaracion-de-accesibilidad", status: "Planificada (fase 7). Mismo slug que en WordPress", index: "index (noindex opcional)", intent: "Accesibilidad", audience: "Todos", primary: "—", cta: "—" },
];

const decode = (value) => value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const text = (html) => decode(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ")).trim();
const pick = (html, re) => decode(html.match(re)?.[1] ?? "");
const cell = (value) => String(value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");

const pages = new Map();
for (const page of published) {
  const response = await fetch(base + page.path);
  const html = await response.text();
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    const data = JSON.parse(m[1]);
    return (data["@graph"] ?? [data]).flatMap((node) => [].concat(node["@type"]));
  });
  const main = html.match(/<main[\s\S]*<\/main>/)?.[0] ?? html;
  const body = main.replace(/<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>/g, "");
  const links = new Set([...body.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)].map((m) => m[1]).filter((href) => href !== page.path));
  pages.set(page.path, {
    ...page,
    status: response.status,
    robots: pick(html, /<meta name="robots" content="([^"]*)"/) || "index, follow",
    title: pick(html, /<title>([^<]*)<\/title>/),
    description: pick(html, /<meta name="description" content="([^"]*)"/),
    h1: text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? ""),
    h2: [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => text(m[1])),
    canonical: pick(html, /<link rel="canonical" href="([^"]*)"/),
    jsonld: [...new Set(ld)].filter((type) => !["ListItem", "Question", "Answer", "Offer", "OfferCatalog", "ContactPoint", "City", "AdministrativeArea", "Place", "Audience"].includes(type)),
    outgoing: [...links],
    cta: text(main.match(/class="button button--yellow"[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? main.match(/class="button button--dark form-submit"[^>]*>([\s\S]*?)<\/button>/)?.[1] ?? "").replace(/\s*→$/, ""),
    og: pick(html, /<meta property="og:image" content="([^"]*)"/).replace(SITE_URL, ""),
    lastmod: "",
  });
}
const sitemap = await readSitemaps(base);
for (const m of sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
  const path = m[1].slice(SITE_URL.length) || "/";
  if (pages.has(path)) pages.get(path).lastmod = m[2].slice(0, 10);
}
for (const page of pages.values()) {
  page.incoming = [...pages.values()].filter((other) => other.outgoing.includes(page.path)).map((other) => other.path);
}

console.log(`# Matriz SEO — Granalva

Generada con \`node scripts/seo-matrix.mjs\` a partir del HTML publicado (${new Date().toISOString().slice(0, 10)}). Las páginas planificadas se declaran en el script. Enlaces entrantes y salientes: solo los del contenido, sin cabecera ni pie (que enlazan todos los servicios desde todas las páginas).

## Páginas publicadas

| URL | Estado | Index | Intención | Público | Palabra principal | Secundarias | Title | Meta description | H1 | H2 | Canonical | Datos estructurados | Enlaces entrantes (contenido) | Enlaces salientes (contenido) | CTA principal | Imagen social | Última actualización |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|`);
for (const p of pages.values()) {
  console.log(`| \`${p.path}\` | ${p.status} | ${cell(p.robots.split(",")[0])} | ${cell(p.intent)} | ${cell(p.audience)} | ${cell(p.primary)} | ${cell(p.secondary)} | ${cell(p.title)} (${p.title.length}) | ${cell(p.description)} (${p.description.length}) | ${cell(p.h1)} | ${cell(p.h2.join(" · "))} | ${cell(p.canonical.replace(SITE_URL, "") || "/")} | ${cell(p.jsonld.join(", "))} | ${p.incoming.length}: ${cell(p.incoming.map((x) => `\`${x}\``).join(", "))} | ${p.outgoing.length} | ${cell(p.cta)} | ${cell(p.og)} | ${p.lastmod} |`);
}
console.log(`
## Páginas planificadas (aún no publicadas)

| URL | Estado | Index | Intención | Público | Palabra principal | CTA |
|---|---|---|---|---|---|---|`);
for (const p of planned) console.log(`| \`${p.path}\` | ${cell(p.status)} | ${cell(p.index)} | ${cell(p.intent)} | ${cell(p.audience)} | ${cell(p.primary)} | ${cell(p.cta)} |`);
console.log(`
## Exclusiones de indexación

| Ruta | Mecanismo |
|---|---|
| \`/admin\` y \`/admin/*\` | \`Disallow\` en robots.txt y cabecera \`X-Robots-Tag: noindex, nofollow\` |
| \`/api/*\` | \`Disallow\` en robots.txt, \`X-Robots-Tag: noindex, nofollow\` y acceso restringido por roles |
| \`/preview\` (borradores) | \`Disallow\` en robots.txt; las previsualizaciones de Payload requerirán sesión |
| \`/contacto?servicio=…\` y \`?utm_…\` | Canonical a la URL limpia |
| Agradecimientos | El formulario confirma en la misma página, sin URL de «gracias» indexable |
| 404 | \`noindex, follow\` |
| Preproducción | \`NEXT_PUBLIC_NOINDEX=true\` → \`noindex, nofollow\` y \`Disallow: /\` |
`);
