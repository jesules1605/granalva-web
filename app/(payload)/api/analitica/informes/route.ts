import { timingSafeEqual } from "node:crypto";
import config from "@payload-config";
import { getPayload } from "payload";
import { analyticsAdmin } from "../../../../lib/analytics/admin-auth";
import { runReports } from "../../../../lib/analytics/reports";

// Informes y alertas. Lo llama a diario la función programada de Netlify (CRON_SECRET);
// el propietario o un administrador pueden forzar un envío de prueba con ?tipo=semanal|mensual|alertas.
const cronOk = (request: Request) => {
  const expected = process.env.CRON_SECRET ?? "";
  const given = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  return expected.length >= 16 && given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
};

export async function POST(request: Request) {
  const tipo = new URL(request.url).searchParams.get("tipo");
  const force = tipo === "semanal" || tipo === "mensual" || tipo === "alertas" ? tipo : undefined;
  let payload;
  const cron = cronOk(request);
  if (cron) payload = await getPayload({ config });
  else {
    const session = await analyticsAdmin(request);
    if (!session.allowed || !force) return new Response(null, { status: 403 });
    payload = session.payload;
  }
  const result = await runReports(payload, new Date(), force);
  if (cron) return Response.json(result);
  const message = result.sent.length ? `enviado: ${result.sent.join(", ")}` : (result as { note?: string }).note ?? "nada que enviar";
  return Response.redirect(new URL(`/admin/analitica?informe=${encodeURIComponent(message)}`, request.url), 303);
}
