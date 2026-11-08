// Inventario SEO de la web WordPress actual (solo lectura): node scripts/inventario-wordpress.mjs
// Rastrea el sitemap y las URLs conocidas y genera docs/inventario-wordpress.csv con
// código HTTP, destino, title, description, H1, canonical, robots, JSON-LD, enlaces e imágenes.
// Las columnas de Search Console (clics, impresiones, posición, enlaces externos) quedan
// pendientes de la exportación del propietario.
import { writeFileSync } from "node:fs";

const ORIGIN = "https://limpiezasgranalva.com";
const NEW = { "/": "/", "/servicios-de-limpieza-granada/": "/servicios", "/sobre-nosotros/": "/sobre-nosotros", "/contacto/": "/contacto", "/aviso-legal/": "/aviso-legal", "/politica-de-privacidad/": "/politica-de-privacidad", "/politica-de-cookies/": "/politica-de-cookies", "/declaracion-de-accesibilidad/": "/declaracion-de-accesibilidad", "/inicio/": "/", "/servicios/": "/servicios", "/referencias/": "/referencias", "/hello-world/": "(410)", "/feed/": "(410)", "/comments/feed/": "(410)" };
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#8211;/g, "–").replace(/&#8217;/g, "’").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, " ").trim();
const pick = (html, re) => decode(html.match(re)?.[1] ?? "");

const sitemap = await (await fetch(`${ORIGIN}/page-sitemap.xml`)).text();
const urls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname));
for (const path of Object.keys(NEW)) urls.add(path);

const rows = [];
const images = new Set();
for (const path of urls) {
  const response = await fetch(`${ORIGIN}${path}`, { redirect: "manual" });
  const raw = response.status === 200 ? await response.text() : "";
  const html = raw.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<noscript[\s\S]*?<\/noscript>/g, "");
  const heads = (tag) => [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g"))].map((m) => decode(m[1].replace(/<[^>]+>/g, ""))).filter(Boolean);
  const main = html.replace(/<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>/g, "");
  const internal = new Set([...main.matchAll(/href="(https:\/\/limpiezasgranalva\.com\/[^"#?]*)"/g)].map((m) => new URL(m[1]).pathname));
  for (const m of html.matchAll(/https:\/\/limpiezasgranalva\.com\/wp-content\/uploads\/[^"' )]+\.(?:jpe?g|png|webp|pdf)/g)) images.add(m[0].replace(/-\d+x\d+(?=\.)/, ""));
  rows.push({
    url: `${ORIGIN}${path}`,
    codigo: response.status,
    destino: response.headers.get("location") ?? "",
    title: pick(html, /<title>([^<]*)<\/title>/),
    description: pick(html, /<meta name="description" content="([^"]*)"/),
    h1: heads("h1").join(" | "),
    h2: heads("h2").slice(0, 6).join(" | "),
    canonical: pick(html, /<link rel="canonical" href="([^"]*)"/),
    robots: pick(html, /<meta name=["']robots["'] content=["']([^"']*)["']/),
    jsonld: [...new Set([...raw.matchAll(/"@type":"([^"]+)"/g)].map((m) => m[1]))].join(" "),
    enlaces_internos: internal.size,
    url_nueva: NEW[path] ?? "",
  });
  await new Promise((r) => setTimeout(r, 400));
}
const cols = ["url", "codigo", "destino", "title", "description", "h1", "h2", "canonical", "robots", "jsonld", "enlaces_internos", "clics_gsc", "impresiones_gsc", "posicion_gsc", "enlaces_externos_gsc", "url_nueva", "codigo_nuevo", "justificacion", "estado_comprobacion"];
const esc = (v) => (/[;"\n]/.test(String(v ?? "")) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? ""));
const lines = [cols.join(";"), ...rows.map((r) => cols.map((c) => esc(r[c] ?? (c.endsWith("_gsc") ? "pendiente de Search Console" : ""))).join(";"))];
writeFileSync("docs/inventario-wordpress.csv", "﻿" + lines.join("\n") + "\n");
writeFileSync("docs/inventario-wordpress-medios.txt", [...images].sort().join("\n") + "\n");
console.log(`${rows.length} URLs, ${images.size} medios`);
for (const r of rows) console.log(r.codigo, r.url.replace(ORIGIN, ""), "|", r.title.slice(0, 60), "| H1:", r.h1.slice(0, 70), "| H2:", r.h2.slice(0, 120), "|", r.canonical.replace(ORIGIN, ""), "|", r.jsonld.slice(0, 80));
