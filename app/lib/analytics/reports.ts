import "server-only";
import type { Payload } from "payload";
import { cloudflareStats, formErrorCount, ga4Stats, getAnalyticsSettings, leadStats, period, searchConsoleStats } from "./server";

/**
 * Informes y alertas de analítica (los ejecuta a diario netlify/functions/analytics-reports.mts).
 * - Lunes: resumen semanal. Día 1: informe mensual.
 * - Cada día: alertas; la misma alerta no se repite antes de 7 días.
 * - Solo a los destinatarios configurados en /admin (Ajustes de analítica). Nunca a terceros.
 * - Sin datos personales: solo cifras agregadas.
 */

const fmt = new Intl.NumberFormat("es-ES");
const change = (current: number, previous: number) => (previous ? `${current >= previous ? "+" : ""}${Math.round(((current - previous) / previous) * 100)} %` : "sin comparación");

async function summary(payload: Payload, days: number) {
  const p = period(days);
  const [leads, ga, gsc, cf] = await Promise.all([leadStats(payload, p), ga4Stats(payload, p), searchConsoleStats(payload, p), cloudflareStats(payload, p)]);
  const L = leads.current;
  const lines = [
    `Periodo: últimos ${days} días (comparado con los ${days} anteriores).`,
    "",
    `Solicitudes recibidas: ${L.total} (${change(L.total, leads.previous.total)})`,
    `  Empresas: ${L.business.total} · Particulares: ${L.private.total} · Sierra Nevada: ${L.sierra.total}`,
    `Gestionadas: ${L.contacted} · Presupuestos enviados: ${L.quoted} · Ganadas: ${L.won} · Perdidas: ${L.lost}`,
    L.wonAmount ? `Importe estimado ganado: ${fmt.format(L.wonAmount)} €` : "",
    L.byChannel[0] ? `Canal principal de solicitudes: ${L.byChannel[0][0]} (${L.byChannel[0][1]})` : "",
    L.byService[0] ? `Servicio más solicitado: ${L.byService[0][0]} (${L.byService[0][1]})` : "",
  ];
  if (cf.status === "ok") {
    const visits = cf.current.total?.[0]?.sum?.visits ?? 0;
    lines.push("", `Visitas (Cloudflare, sin cookies): ${fmt.format(visits)} (${change(visits, cf.previous.total?.[0]?.sum?.visits ?? 0)})`, visits ? `Tasa de conversión: ${((L.total / visits) * 100).toFixed(2)} %` : "");
  }
  if (ga.status === "ok") {
    const e = (name: string) => ga.events[name]?.current ?? 0;
    lines.push("", `GA4 (visitantes que aceptan la analítica): ${fmt.format(ga.current[0])} sesiones (${change(ga.current[0], ga.previous[0])})`, `  Clics: presupuesto ${e("quote_cta_click")} · teléfono ${e("phone_click")} · WhatsApp ${e("whatsapp_click")} · app ${e("app_order_click")}`, `  Formularios correctos: ${e("quote_form_success")} · con error técnico: ${e("quote_form_error")}`);
  }
  if (gsc.status === "ok") {
    lines.push("", `Google (Search Console, ${gsc.range}): ${fmt.format(gsc.total?.clicks ?? 0)} clics (${change(gsc.total?.clicks ?? 0, gsc.previous?.clicks ?? 0)}), ${fmt.format(gsc.total?.impressions ?? 0)} impresiones, posición media ${(gsc.total?.position ?? 0).toFixed(1)}`);
    if (gsc.queries[0]) lines.push(`  Consultas principales: ${gsc.queries.slice(0, 5).map((q) => `${q.keys?.[0]} (${q.clicks})`).join(", ")}`);
  }
  return lines.filter((line, i, all) => line !== "" || all[i - 1] !== "").join("\n");
}

type Alert = { key: string; text: string };

async function alerts(payload: Payload): Promise<Alert[]> {
  const settings = await getAnalyticsSettings(payload);
  const found: Alert[] = [];
  const noLeadsDays = settings.noLeadsDays ?? 10;
  const last = await payload.find({ collection: "contact-submissions", where: { status: { not_equals: "spam" } }, sort: "-createdAt", limit: 1, depth: 0, overrideAccess: true, select: { createdAt: true } });
  const lastAt = last.docs[0] ? new Date(last.docs[0].createdAt).getTime() : 0;
  if (lastAt && Date.now() - lastAt > noLeadsDays * 86_400_000) found.push({ key: "sin-solicitudes", text: `No llegan solicitudes desde hace más de ${noLeadsDays} días. Comprueba el formulario de la web.` });
  const errors = await formErrorCount(payload, 1);
  if (errors >= (settings.formErrorsPerDay ?? 3)) found.push({ key: "errores-formulario", text: `${errors} errores del formulario o del aviso por correo en las últimas 24 h (Analítica → Incidencias técnicas).` });
  const p = period(7);
  const [gsc, ga, cf] = await Promise.all([searchConsoleStats(payload, p), ga4Stats(payload, p), cloudflareStats(payload, p)]);
  if (gsc.status === "ok" && (gsc.previous?.clicks ?? 0) >= 20) {
    const drop = 1 - (gsc.total?.clicks ?? 0) / (gsc.previous?.clicks ?? 1);
    if (drop * 100 >= (settings.organicDropPercent ?? 40)) found.push({ key: "caida-organica", text: `Los clics desde Google han caído un ${Math.round(drop * 100)} % (7 días frente a los 7 anteriores).` });
  }
  if (ga.status === "ok") {
    const p30 = await ga4Stats(payload, period(30));
    const weekly404 = ga.notFound;
    const baseline = p30.status === "ok" ? p30.notFound / 4.3 : 0;
    if (weekly404 >= 10 && baseline && ((weekly404 - baseline) / baseline) * 100 >= (settings.notFoundIncreasePercent ?? 100)) found.push({ key: "aumento-404", text: `Aumentan las páginas no encontradas: ${weekly404} en 7 días (media semanal ${Math.round(baseline)}).` });
  }
  if (cf.status === "ok") {
    const q = cf.current.vitals?.[0]?.quantiles;
    const count = cf.current.vitals?.[0]?.count ?? 0;
    if (q && count >= 50) {
      const bad = [
        q.largestContentfulPaintP75 > (settings.lcpThresholdMs ?? 2500) ? `LCP ${(q.largestContentfulPaintP75 / 1000).toFixed(2)} s` : "",
        q.interactionToNextPaintP75 > (settings.inpThresholdMs ?? 200) ? `INP ${Math.round(q.interactionToNextPaintP75)} ms` : "",
        q.cumulativeLayoutShiftP75 > (settings.clsThreshold ?? 0.1) ? `CLS ${q.cumulativeLayoutShiftP75.toFixed(3)}` : "",
      ].filter(Boolean);
      if (bad.length) found.push({ key: "core-web-vitals", text: `Core Web Vitals por encima del umbral (p75, 7 días): ${bad.join(", ")}.` });
    }
  }
  return found;
}

export async function runReports(payload: Payload, now = new Date(), force?: "semanal" | "mensual" | "alertas") {
  const settings = await getAnalyticsSettings(payload);
  const to = (settings.recipients ?? []).map((r) => r.email).filter(Boolean);
  const sent: string[] = [];
  if (!to.length) return { sent, note: "Sin destinatarios configurados" };
  const send = async (subject: string, text: string) => {
    await payload.sendEmail({ to, subject, text: `${text}\n\nPanel completo: ${(process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "")}/admin/analitica\n\n(Mensaje automático de la web de Granalva. Destinatarios configurables en Analítica → Ajustes de analítica.)` });
    sent.push(subject);
  };
  const madrid = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Madrid" }));
  if ((force === "semanal" || (!force && madrid.getDay() === 1)) && settings.weeklyReport !== false) await send("Granalva · Resumen semanal de la web", await summary(payload, 7));
  if ((force === "mensual" || (!force && madrid.getDate() === 1)) && settings.monthlyReport !== false) await send("Granalva · Informe mensual de la web", await summary(payload, 30));
  if ((!force || force === "alertas") && settings.alerts !== false) {
    const state = { ...((settings.alertState as Record<string, string> | null) ?? {}) };
    const fresh = (await alerts(payload)).filter((alert) => force === "alertas" || !state[alert.key] || now.getTime() - new Date(state[alert.key]).getTime() > 7 * 86_400_000);
    if (fresh.length) {
      await send(`Granalva · Alerta de la web (${fresh.length})`, fresh.map((alert) => `• ${alert.text}`).join("\n"));
      for (const alert of fresh) state[alert.key] = now.toISOString();
      await payload.updateGlobal({ slug: "analytics-settings", overrideAccess: true, data: { alertState: state } });
    }
  }
  return { sent };
}
