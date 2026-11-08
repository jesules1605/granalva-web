// Mapa de migración: node scripts/mapa-migracion.mjs [baseNueva]
// Une el inventario de WordPress (docs/inventario-wordpress.csv) con las reglas de
// docs/redirecciones-wordpress.csv y comprueba cada URL contra la web nueva (enviando el
// Host del dominio final). Escribe docs/mapa-migracion.csv con las columnas pedidas.
import { readFileSync, writeFileSync } from "node:fs";
import { request } from "node:http";
import { request as requestTls } from "node:https";

const base = new URL(process.argv[2] ?? "http://localhost:3000");
const parse = (file) => {
  const [head, ...rows] = readFileSync(file, "utf8").replace(/^﻿/, "").trim().split("\n");
  const cols = head.split(";");
  return rows.map((line) => {
    const cells = line.match(/("([^"]|"")*"|[^;]*)(;|$)/g).map((c) => c.replace(/;$/, "").replace(/^"|"$/g, "").replace(/""/g, '"'));
    return Object.fromEntries(cols.map((c, i) => [c, cells[i] ?? ""]));
  });
};
const inventory = parse("docs/inventario-wordpress.csv");
const rules = parse("docs/redirecciones-wordpress.csv");
const byUrl = Object.fromEntries(inventory.map((row) => [row.url, row]));

const check = (url) =>
  new Promise((resolve) => {
    const target = new URL(url);
    const lib = base.protocol === "https:" ? requestTls : request;
    const req = lib({ host: base.hostname, port: base.port || (base.protocol === "https:" ? 443 : 80), path: target.pathname, headers: { host: base.protocol === "https:" ? base.host : target.host } }, (res) => {
      res.resume();
      resolve({ status: res.statusCode, location: res.headers.location ?? "" });
    });
    req.on("error", (error) => resolve({ status: 0, location: error.message }));
    req.end();
  });

const cols = ["url_antigua", "codigo_actual", "title_antiguo", "h1_antiguo", "canonical_antiguo", "trafico_clics", "impresiones", "enlaces", "url_nueva", "codigo_redireccion", "justificacion", "estado_comprobacion"];
const out = [];
for (const rule of rules) {
  const old = byUrl[rule.url_antigua] ?? {};
  let estado = "no comprobable aquí (HTTP lo fuerza la plataforma)";
  if (!rule.url_antigua.startsWith("http:")) {
    const result = await check(rule.url_antigua);
    const okCode = String(result.status) === rule.codigo;
    const okTarget = rule.codigo !== "301" || new URL(result.location, rule.url_nueva).pathname === new URL(rule.url_nueva).pathname;
    estado = okCode && okTarget ? `OK (${result.status}${result.location ? ` → ${new URL(result.location, rule.url_nueva).pathname}` : ""})` : `FALLO (${result.status} ${result.location})`;
  }
  out.push({
    url_antigua: rule.url_antigua,
    codigo_actual: old.codigo ?? "",
    title_antiguo: old.title ?? "",
    h1_antiguo: old.h1 ?? "",
    canonical_antiguo: old.canonical ?? "",
    trafico_clics: old.clics_gsc ?? "pendiente de Search Console",
    impresiones: old.impresiones_gsc ?? "pendiente de Search Console",
    enlaces: old.enlaces_externos_gsc ?? "pendiente de Search Console",
    url_nueva: rule.url_nueva || "—",
    codigo_redireccion: rule.codigo,
    justificacion: rule.justificacion,
    estado_comprobacion: estado,
  });
}
const esc = (v) => (/[;"\n]/.test(String(v ?? "")) ? `"${String(v).replace(/"/g, '""')}"` : String(v ?? ""));
writeFileSync("docs/mapa-migracion.csv", "﻿" + [cols.join(";"), ...out.map((r) => cols.map((c) => esc(r[c])).join(";"))].join("\n") + "\n");
for (const r of out) console.log(r.codigo_redireccion, r.url_antigua, "→", r.url_nueva, "|", r.estado_comprobacion);
