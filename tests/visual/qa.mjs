// QA de navegador: node tests/visual/qa.mjs [baseUrl] [outDir]
// Recorre todas las rutas en los 8 tamaños de referencia y comprueba: errores de consola
// y de página (incluidas CSP e hidratación), desbordamiento horizontal, imágenes rotas,
// enlaces sin nombre accesible y un único H1. Guarda capturas a 1440 y 390.
import { mkdirSync, writeFileSync } from "node:fs";
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
const out = process.argv[3] ?? "tests/visual/out/qa";
mkdirSync(out, { recursive: true });

const sitemap = await readSitemaps(base);
const routes = [...new Set([...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname), "/aviso-legal", "/politica-de-privacidad", "/politica-de-cookies", "/declaracion-de-accesibilidad", "/blog", "/no-existe-esta-pagina"])];
const viewports = [[1920, 1080], [1440, 900], [1366, 768], [1024, 768], [768, 1024], [430, 932], [390, 844], [360, 800]];

const browser = await chromium.launch();
const problems = [];
let checks = 0;
for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  let messages = [];
  page.on("console", (m) => { if (m.type() === "error" || /hydrat/i.test(m.text())) messages.push(m.text()); });
  page.on("pageerror", (e) => messages.push(e.message));
  for (const route of routes) {
    messages = [];
    const response = await page.goto(base + route, { waitUntil: "load" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(500);
    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      brokenImages: [...document.images].filter((img) => img.complete && img.naturalWidth === 0 && img.loading !== "lazy").map((img) => img.currentSrc || img.src),
      emptyLinks: [...document.querySelectorAll("a[href]")].filter((a) => !(a.textContent ?? "").trim() && !a.getAttribute("aria-label") && !a.querySelector("img[alt]:not([alt=''])")).map((a) => a.getAttribute("href")),
      h1: document.querySelectorAll("h1").length,
    }));
    const expected404 = route === "/no-existe-esta-pagina";
    const issues = [];
    if ((response?.status() ?? 0) !== (expected404 ? 404 : 200)) issues.push(`HTTP ${response?.status()}`);
    // El 404 genera un error de consola esperado del recurso principal.
    const relevant = messages.filter((m) => !(expected404 && /404/.test(m)));
    if (relevant.length) issues.push(`consola: ${relevant.slice(0, 2).join(" | ")}`);
    if (result.overflow > 0) issues.push(`desbordamiento ${result.overflow}px`);
    if (result.brokenImages.length) issues.push(`imágenes rotas: ${result.brokenImages.join(", ")}`);
    if (result.emptyLinks.length) issues.push(`enlaces vacíos: ${result.emptyLinks.join(", ")}`);
    if (result.h1 !== 1) issues.push(`${result.h1} H1`);
    if (issues.length) problems.push(`${width}x${height} ${route}: ${issues.join("; ")}`);
    if (width === 1440 || width === 390) await page.screenshot({ path: `${out}/${(route.replace(/\//g, "_") || "_") }-${width}.png`, fullPage: true });
    checks++;
  }
  await context.close();
}
await browser.close();
writeFileSync(`${out}/informe.json`, JSON.stringify({ routes, viewports, checks, problems }, null, 2));
console.log(`${checks} comprobaciones (${routes.length} rutas × ${viewports.length} tamaños)`);
console.log(problems.length ? problems.join("\n") : "sin incidencias");
