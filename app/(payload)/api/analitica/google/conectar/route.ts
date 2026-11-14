import { randomBytes } from "node:crypto";
import { analyticsAdmin, panelOrigin } from "../../../../../lib/analytics/admin-auth";
import { GOOGLE_SCOPES, googleConfigured } from "../../../../../lib/analytics/server";

// Inicia la autorización de solo lectura de Google Analytics y Search Console con la
// cuenta de Granalva. Sin archivos de clave: Google devuelve un token que se guarda cifrado.
export async function GET(request: Request) {
  const { allowed } = await analyticsAdmin(request);
  if (!allowed) return new Response("Solo el propietario o un administrador pueden conectar Google.", { status: 403 });
  if (!googleConfigured()) return new Response("Faltan GOOGLE_OAUTH_CLIENT_ID y GOOGLE_OAUTH_CLIENT_SECRET en Netlify.", { status: 503 });
  const state = randomBytes(24).toString("base64url");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.search = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID ?? "",
    redirect_uri: `${panelOrigin()}/api/analitica/google/callback`,
    response_type: "code",
    scope: GOOGLE_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  }).toString();
  return new Response(null, {
    status: 302,
    headers: { location: url.toString(), "set-cookie": `granalva_oauth_state=${state}; Path=/api/analitica/google; HttpOnly; Secure; SameSite=Lax; Max-Age=600` },
  });
}
