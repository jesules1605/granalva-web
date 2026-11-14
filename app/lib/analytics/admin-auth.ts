import "server-only";
import config from "@payload-config";
import { getPayload } from "payload";

/** Sesión del panel con rol propietario o administrador (para la analítica). */
export async function analyticsAdmin(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  const role = (user as { role?: string; active?: boolean } | null)?.role;
  const active = (user as { active?: boolean } | null)?.active !== false;
  return { payload, allowed: Boolean(user && active && (role === "owner" || role === "admin")) };
}

/** Dirección pública del panel (para la URL de retorno de Google). */
export const panelOrigin = () => (process.env.PAYLOAD_SERVER_URL || process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
