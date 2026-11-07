// Genera la tabla del mapa SEO a partir de app/lib/services.ts (fuente única).
// Uso: node scripts/seo-map.mjs  → imprime Markdown para docs/seo-strategy.md
const { servicePages } = await import("../app/lib/services.ts");

const home = {
  url: "/",
  intent: "Encontrar una empresa de limpieza y lavandería en Granada (visión global de la empresa).",
  primaryKeyword: "empresa de limpieza y lavandería Granada",
  secondaryKeywords: ["Limpiezas Granalva (marca)", "limpieza y lavandería profesional Granada"],
  metaTitle: "Empresa de limpieza y lavandería en Granada | Granalva",
  h1: "Empresa de limpieza y lavandería profesional en Granada",
  metaDescription:
    "Empresa de limpieza y lavandería profesional en Granada: empresas, oficinas y apartamentos turísticos, lavandería con recogida y entrega y renting textil.",
};
const hub = {
  url: "/servicios",
  intent: "Comparar o explorar todos los servicios (página índice que distribuye autoridad).",
  primaryKeyword: "servicios de limpieza y lavandería Granada",
  secondaryKeywords: ["(navegacional: no compite con /servicios/empresa-limpieza-granada)"],
  metaTitle: "Servicios de limpieza y lavandería en Granada | Granalva",
  h1: "Servicios de limpieza y lavandería en Granada. Cada servicio, bien definido.",
  metaDescription:
    "Servicios de limpieza y lavandería en Granada: empresas, oficinas, apartamentos turísticos, hoteles, fin de obra, renting textil y lavandería a domicilio.",
};
const rows = [home, hub, ...servicePages.map((s) => ({ ...s, url: `/servicios/${s.slug}` }))];
const cell = (value) => String(value).replace(/\|/g, "\\|");

console.log("| URL | Intención | Palabra principal | Secundarias | Title (car.) | H1 | Meta description (car.) |");
console.log("|---|---|---|---|---|---|---|");
for (const r of rows) {
  console.log(
    `| \`${r.url}\` | ${cell(r.intent)} | ${cell(r.primaryKeyword)} | ${cell(r.secondaryKeywords.join("; "))} | ${cell(r.metaTitle)} (${r.metaTitle.length}) | ${cell(r.h1)} | ${cell(r.metaDescription)} (${r.metaDescription.length}) |`,
  );
}
console.log("\n#### Enlaces relacionados por servicio (texto de anclaje)\n");
for (const s of servicePages) {
  console.log(`- \`/servicios/${s.slug}\` → ${s.related.map((r) => `«${r.anchor}» (\`/servicios/${r.slug}\`)`).join(", ")}`);
}
