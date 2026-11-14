import { analyticsAdmin, panelOrigin } from "../../../../../lib/analytics/admin-auth";
import { clearAnalyticsCache, encryptSecret } from "../../../../../lib/analytics/server";

// Retorno de Google: comprueba el estado, canjea el código y guarda el token cifrado.
export async function GET(request: Request) {
  const back = (message: string) => Response.redirect(`${panelOrigin()}/admin/analitica?google=${encodeURIComponent(message)}`, 302);
  const { payload, allowed } = await analyticsAdmin(request);
  if (!allowed) return new Response("Sesión del panel no válida.", { status: 403 });
  const url = new URL(request.url);
  const state = (request.headers.get("cookie") ?? "").split("; ").find((item) => item.startsWith("granalva_oauth_state="))?.split("=")[1];
  if (!state || state !== url.searchParams.get("state")) return back("estado-no-valido");
  if (url.searchParams.get("error")) return back(url.searchParams.get("error") ?? "cancelado");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: new URLSearchParams({
      code: url.searchParams.get("code") ?? "",
      client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
      client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "",
      redirect_uri: `${panelOrigin()}/api/analitica/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  const json = (await response.json()) as { refresh_token?: string; id_token?: string; error?: string };
  if (!json.refresh_token) return back(json.error ?? "sin-token");
  let email = "";
  try {
    email = JSON.parse(Buffer.from((json.id_token ?? "").split(".")[1] ?? "", "base64url").toString("utf8")).email ?? "";
  } catch {
    email = "";
  }
  await payload.updateGlobal({
    slug: "analytics-settings",
    overrideAccess: true,
    data: { googleRefreshToken: encryptSecret(json.refresh_token), googleConnectedEmail: email, googleConnectedAt: new Date().toISOString() },
  });
  clearAnalyticsCache();
  return back("conectado");
}
