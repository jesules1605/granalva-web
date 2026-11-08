import type { PayloadHandler } from "payload";

// GET /api/contact-submissions/export.csv[?status=nuevo] — solo propietario y administradores.
// CSV en UTF-8 con BOM (Excel en español), separador «;» y protección contra
// inyección de fórmulas (celdas que empiezan por = + - @ se prefijan con ').
const COLUMNS: [string, string][] = [
  ["reference", "Referencia"],
  ["createdAt", "Fecha"],
  ["status", "Estado"],
  ["tipoCliente", "Tipo de cliente"],
  ["servicio", "Servicio"],
  ["empresa", "Empresa"],
  ["contacto", "Contacto"],
  ["telefono", "Teléfono"],
  ["email", "Correo"],
  ["ubicacion", "Localidad"],
  ["unidades", "Alojamientos o espacios"],
  ["volumen", "Volumen"],
  ["frecuencia", "Frecuencia"],
  ["inicio", "Inicio"],
  ["mensaje", "Mensaje"],
  ["formulario", "Formulario"],
  ["attribution.pagina", "Página"],
  ["attribution.utmSource", "utm_source"],
  ["attribution.utmMedium", "utm_medium"],
  ["attribution.utmCampaign", "utm_campaign"],
  ["notes", "Notas internas"],
];

export const csvCell = (value: unknown): string => {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const pick = (doc: Record<string, unknown>, path: string) =>
  path.split(".").reduce<unknown>((value, key) => (value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined), doc);

export const exportSubmissions: PayloadHandler = async (req) => {
  const role = (req.user as { role?: string; active?: boolean } | null)?.role;
  if (!req.user || !["owner", "admin"].includes(role ?? "") || (req.user as { active?: boolean }).active === false) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }
  const status = new URL(req.url ?? "http://x").searchParams.get("status");
  const result = await req.payload.find({
    collection: "contact-submissions",
    where: status ? { status: { equals: status } } : {},
    sort: "-createdAt",
    limit: 10000,
    depth: 0,
    overrideAccess: false,
    user: req.user,
  });
  const lines = [COLUMNS.map(([, label]) => csvCell(label)).join(";")];
  for (const doc of result.docs as unknown as Record<string, unknown>[]) {
    lines.push(COLUMNS.map(([path]) => csvCell(pick(doc, path))).join(";"));
  }
  const date = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="solicitudes-granalva-${date}${status ? `-${status}` : ""}.csv"`,
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
};
