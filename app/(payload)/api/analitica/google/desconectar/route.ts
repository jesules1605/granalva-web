import { analyticsAdmin, panelOrigin } from "../../../../../lib/analytics/admin-auth";
import { clearAnalyticsCache, decryptSecret } from "../../../../../lib/analytics/server";

// Retira la autorización: revoca el token en Google y lo borra del panel.
export async function POST(request: Request) {
  const { payload, allowed } = await analyticsAdmin(request);
  if (!allowed) return new Response(null, { status: 403 });
  const settings = await payload.findGlobal({ slug: "analytics-settings", overrideAccess: true });
  if (settings.googleRefreshToken) {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(decryptSecret(settings.googleRefreshToken))}`, { method: "POST" }).catch(() => null);
  }
  await payload.updateGlobal({ slug: "analytics-settings", overrideAccess: true, data: { googleRefreshToken: null, googleConnectedEmail: null, googleConnectedAt: null } });
  clearAnalyticsCache();
  return Response.redirect(`${panelOrigin()}/admin/analitica?google=desconectado`, 303);
}
