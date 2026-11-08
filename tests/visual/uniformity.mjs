// Uniformidad de cabeceras: node tests/visual/uniformity.mjs [baseUrl]
// Mide logotipo, migas, etiqueta, H1, CTA y altura del ServiceHero en todas las páginas
// de servicio. Falla si algo cambia de posición o tamaño entre rutas (tolerancia 1 px).
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright")); }
const base = process.argv[2] ?? "http://localhost:3000";
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname).filter((p) => p.startsWith("/servicios/"));
const widths = [1920, 1440, 1280, 1024, 768, 390, 360];
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
      return { logo: r(".site-header .brand img"), brand: r(".site-header .brand"), hero: r(".s-hero"), crumbs: r(".s-hero .breadcrumbs"), eyebrow: r(".s-hero__eyebrow"), h1: r(".s-hero h1"), cta: r(".s-hero__actions") };
    })) });
  }
  const ref = rows[0];
  for (const key of ["logo", "brand", "hero", "crumbs", "eyebrow"]) {
    // Logotipo, marca y cabecera: idénticos en todo. Migas y etiqueta: misma posición y
    // altura (su anchura depende de la longitud del texto).
    const dims = ["logo", "brand", "hero"].includes(key) ? [0, 1, 2, 3] : [0, 1, 3];
    for (const row of rows) {
      const a = ref[key], b = row[key];
      if (!a || !b || dims.some((i) => Math.abs(a[i] - b[i]) > 1)) { failures++; console.log(`${width}px ${key} difiere en ${row.route}: ${JSON.stringify(b)} vs ${JSON.stringify(a)}`); }
    }
  }
  // El H1 empieza siempre en el mismo punto; su altura depende del número de líneas.
  for (const row of rows) if (Math.abs(row.h1[1] - ref.h1[1]) > 1 || Math.abs(row.h1[0] - ref.h1[0]) > 1) { failures++; console.log(`${width}px h1 origen difiere en ${row.route}`); }
  // El contenido no puede salirse de la cabecera.
  for (const row of rows) if (row.cta && row.cta[1] + row.cta[3] > row.hero[1] + row.hero[3]) { failures++; console.log(`${width}px CTA desborda la cabecera en ${row.route}`); }
  console.log(`${width}px: ${rows.length} rutas, cabecera ${JSON.stringify(ref.hero)}`);
  await page.close();
}
await browser.close();
console.log(failures ? `${failures} diferencias` : "cabeceras idénticas en todas las rutas y tamaños");
process.exitCode = failures ? 1 : 0;
