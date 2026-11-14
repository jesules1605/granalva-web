import config from "@payload-config";
import { getPayload } from "payload";

// Registro técnico de cada decisión sobre cookies (prueba del consentimiento).
// Público pero limitado: solo acepta el formato exacto del banner y como mucho
// 20 registros por IP cada 10 minutos (la IP no se guarda).
const hits = new Map<string, number[]>();
const limited = (ip: string) => {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 20;
};

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim();
  if (limited(ip)) return new Response(null, { status: 429 });
  const body = (await request.json().catch(() => null)) as { id?: unknown; analytics?: unknown; version?: unknown; path?: unknown; tools?: unknown } | null;
  if (!body || typeof body.id !== "string" || !/^[0-9a-z-]{8,64}$/i.test(body.id) || typeof body.analytics !== "boolean" || typeof body.version !== "number") {
    return new Response(null, { status: 400 });
  }
  if (!process.env.DATABASE_URL) return new Response(null, { status: 204 });
  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "consent-records",
      overrideAccess: true,
      data: {
        consentId: body.id,
        analytics: body.analytics,
        version: body.version,
        path: typeof body.path === "string" ? body.path.split(/[?#]/)[0].slice(0, 200) : undefined,
        tools: Array.isArray(body.tools) ? body.tools.filter((tool): tool is string => typeof tool === "string").join(", ").slice(0, 120) : undefined,
      },
    });
  } catch (error) {
    console.error("[consentimiento] No se pudo registrar", error instanceof Error ? error.message : error);
  }
  return new Response(null, { status: 204 });
}
