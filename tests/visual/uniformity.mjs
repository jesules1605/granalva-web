// Uniformidad de cabeceras: node tests/visual/uniformity.mjs [baseUrl]
// Mide logotipo, migas, etiqueta, H1, CTA y altura del ServiceHero en todas las páginas
// de servicio. Falla si algo cambia de posición o tamaño entre rutas (tolerancia 1 px).
import { createRequire } from "node:module";

/** Lee el índice de sitemaps y devuelve el XML concatenado de los sitemaps hijos. */
async function readSitemaps(base) {
  const index = await (await fetch(`${base}/sitemap.xml`)).text();
  const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  let xml = "";
  for (const path of children) xml += await (await fetch(`${base}${path}`)).text();
  return xml;
}

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright")); }
const base = process.argv[2] ?? "http://localhost:3000";
const sitemap = await readSitemaps(base);
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).filter((p) => p.startsWith("/servicios/"));
const widths = [1920, 1440, 1280, 1024, 768, 390, 360, 320];
const TOL = 2;
const browser = await chromium.launch();
let failures = 0;
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const rows = [];
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    rows.push({ route, ...(await page.evaluate(() => {
      const r = (sel) => { const e = document.querySelector(sel); if (!e) return null; const b = e.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y + scrollY), Math.round(b.width), Math.round(b.height)]; };
      return { logo: r(".site-header .brand img"), brand: r(".site-header .brand"), header: r(".fixed-navigation"), hero: r(".s-hero"), crumbs: r(".s-hero .breadcrumbs"), crumbsList: r(".s-hero .breadcrumbs ol"), eyebrow: r(".s-hero__eyebrow"), h1: r(".s-hero h1"), cta: r(".s-hero__actions"), crumbsText: document.querySelector(".s-hero .breadcrumbs")?.textContent ?? "" };
    })) });
  }
  const ref = rows[0];
  for (const key of ["logo", "brand", "hero", "crumbs", "eyebrow"]) {
    // Logotipo, marca y cabecera: idénticos en todo. Migas y etiqueta: misma posición y
    // altura (su anchura depende de la longitud del texto).
    const dims = ["logo", "brand", "hero"].includes(key) ? [0, 1, 2, 3] : [0, 1, 3];
    for (const row of rows) {
      const a = ref[key], b = row[key];
      if (!a || !b || dims.some((i) => Math.abs(a[i] - b[i]) > TOL)) { failures++; console.log(`${width}px ${key} difiere en ${row.route}: ${JSON.stringify(b)} vs ${JSON.stringify(a)}`); }
    }
  }
  // El H1 empieza siempre en el mismo punto; su altura depende del número de líneas.
  for (const row of rows) if (Math.abs(row.h1[1] - ref.h1[1]) > TOL || Math.abs(row.h1[0] - ref.h1[0]) > TOL) { failures++; console.log(`${width}px h1 origen difiere en ${row.route}`); }
  for (const row of rows) {
    // Migas, etiqueta, H1 y botones en la misma línea vertical de la rejilla.
    const lefts = [row.crumbs[0], row.eyebrow[0], row.h1[0], ...(row.cta ? [row.cta[0]] : [])];
    if (Math.max(...lefts) - Math.min(...lefts) > TOL) { failures++; console.log(`${width}px alineación izquierda distinta en ${row.route}: ${lefts}`); }
    // Una sola línea (20 px), sin solaparse con la cabecera fija ni con la etiqueta.
    if (Math.abs(row.crumbsList[3] - 20) > TOL) { failures++; console.log(`${width}px migas en varias líneas en ${row.route} (${row.crumbsList[3]} px)`); }
    if (row.crumbs[1] < row.header[1] + row.header[3]) { failures++; console.log(`${width}px migas bajo la cabecera fija en ${row.route}`); }
    if (row.crumbs[1] + row.crumbs[3] > row.eyebrow[1]) { failures++; console.log(`${width}px migas solapan la etiqueta en ${row.route}`); }
    if (!row.crumbsText.includes("Inicio") || row.crumbsText.length < 12) { failures++; console.log(`${width}px texto de migas incompleto en ${row.route}`); }
  }
  // El contenido no puede salirse de la cabecera.
  for (const row of rows) if (row.cta && row.cta[1] + row.cta[3] > row.hero[1] + row.hero[3]) { failures++; console.log(`${width}px CTA desborda la cabecera en ${row.route}`); }
  console.log(`${width}px: ${rows.length} rutas, cabecera ${JSON.stringify(ref.hero)}`);
  await page.close();
}
// Navegación interna (clic en enlaces, sin recarga): las migas no deben moverse al pasar de una página a otra.
for (const width of [1440, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(base + routes[0], { waitUntil: "load" });
  const measure = () => page.evaluate(() => { const b = document.querySelector(".s-hero .breadcrumbs").getBoundingClientRect(); const h = document.querySelector(".s-hero h1").getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y + scrollY), Math.round(b.height), Math.round(h.y + scrollY)]; });
  const first = await measure();
  for (const route of routes.slice(1)) {
    await page.evaluate((href) => { const a = document.querySelector(`footer a[href="${href}"]`); if (a) { window.scrollTo(0, 0); a.click(); } }, route);
    await page.waitForURL((url) => url.pathname === route, { timeout: 15000 });
    await page.waitForFunction((r) => document.querySelector(".s-hero .breadcrumbs [aria-current]") && location.pathname === r, route);
    await page.evaluate(() => window.scrollTo(0, 0));
    const now = await measure();
    if (now.some((v, i) => Math.abs(v - first[i]) > TOL)) { failures++; console.log(`navegación ${width}px → ${route}: ${now} vs ${first}`); }
  }
  console.log(`${width}px navegación interna por ${routes.length} servicios: migas estables`);
  await page.close();
}
await browser.close();
console.log(failures ? `${failures} diferencias` : "cabeceras idénticas en todas las rutas y tamaños");
process.exitCode = failures ? 1 : 0;
