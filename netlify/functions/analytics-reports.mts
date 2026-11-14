// Informes y alertas de analítica: a diario a las 8:20 (hora peninsular en invierno).
// Lunes: resumen semanal. Día 1: informe mensual. Cada día: alertas. Requiere CRON_SECRET.
const runAnalyticsReports = async () => {
  const base = process.env.URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) return new Response("Falta URL o CRON_SECRET", { status: 500 });
  const response = await fetch(`${base}/api/analitica/informes`, { method: "POST", headers: { authorization: `Bearer ${secret}` } });
  return new Response(`informes: ${response.status} ${await response.text()}`, { status: response.ok ? 200 : 502 });
};

export default runAnalyticsReports;

export const config = { schedule: "20 7 * * *" };
