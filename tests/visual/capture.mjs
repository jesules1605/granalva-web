// Captura de regresión visual: node tests/visual/capture.mjs <baseUrl> <outDir>
// Recorre las 11 rutas SEO en los 5 tamaños exigidos por docs/AUDIT-HANDOFF.md.
// Usa movimiento reducido y congela vídeos/animaciones para obtener capturas estables.
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright")); }
import { mkdirSync } from "node:fs";

const [base = "http://localhost:3000", out = "tests/visual/out"] = process.argv.slice(2);
export const routes = [
  "/", "/servicios",
  "/servicios/empresa-limpieza-granada", "/servicios/lavanderia-profesional-granada",
  "/servicios/lavanderia-hoteles-granada", "/servicios/lavanderia-apartamentos-turisticos-granada",
  "/servicios/limpieza-apartamentos-turisticos-granada", "/servicios/limpieza-oficinas-locales-granada",
  "/servicios/limpieza-fin-de-obra-granada", "/servicios/renting-textil-granada",
  "/servicios/lavanderia-domicilio-granada",
];
export const viewports = [[1920, 1080], [1440, 900], [1024, 768], [390, 844], [360, 800]];
const slug = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replaceAll("/", "_"));

mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const report = [];
for (const [w, h] of viewports) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: "*,*::before,*::after{animation-play-state:paused!important;animation-delay:0s!important;transition:none!important;caret-color:transparent!important}" });
    await page.evaluate(async () => {
      document.querySelectorAll("video").forEach((v) => { v.pause(); v.currentTime = 0; });
      await document.fonts.ready;
    });
    await page.waitForTimeout(300);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await page.screenshot({ path: `${out}/${w}x${h}__${slug(r)}.png`, fullPage: true });
    report.push({ viewport: `${w}x${h}`, route: r, overflow });
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report.filter((x) => x.overflow > 0), null, 0) || "[]");
console.log(`capturas: ${report.length} en ${out}`);
