// Detecta párrafos colocados al lado de un H2 (composición título + minipárrafo lateral).
// Uso: node tests/visual/side-paragraphs.mjs [baseUrl]
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright")); }
const base = process.argv[2] ?? "http://localhost:3000";
const routes = ["/", "/servicios", "/servicios/empresa-limpieza-granada", "/servicios/lavanderia-profesional-granada", "/servicios/lavanderia-domicilio-granada", "/servicios/lavanderia-sierra-nevada", "/sobre-nosotros", "/contacto"];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
let total = 0;
for (const route of routes) {
  await page.goto(base + route, { waitUntil: "load" });
  const found = await page.evaluate(() => {
    const out = [];
    for (const h of document.querySelectorAll("main h2")) {
      const hr = h.getBoundingClientRect();
      if (hr.width === 0) continue;
      const section = h.closest("section") ?? h.parentElement;
      for (const p of section.querySelectorAll("p")) {
        if (p.closest("form, article, li, details, .accordion, blockquote, footer")) continue;
        const pr = p.getBoundingClientRect();
        const sideBySide = pr.left >= hr.right - 4 && pr.top < hr.bottom && pr.bottom > hr.top - 40;
        if (sideBySide) out.push({ h2: h.textContent.trim().slice(0, 60), p: p.textContent.trim().slice(0, 90), words: p.textContent.trim().split(/\s+/).length });
      }
    }
    return out;
  });
  for (const f of found) { total++; console.log(`${route} | «${f.h2}» ⟷ «${f.p}» (${f.words} palabras)`); }
}
console.log(`Total: ${total}`);
await browser.close();
process.exitCode = 0;
