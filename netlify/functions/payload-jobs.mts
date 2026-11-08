// Publicación programada en Netlify: ejecuta a diario la cola de trabajos de Payload
// (equivalente a la tarea cron de vercel.json). Requiere CRON_SECRET en las variables.
const runPayloadJobs = async () => {
  const base = process.env.URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) return new Response("Falta URL o CRON_SECRET", { status: 500 });
  const response = await fetch(`${base}/api/payload-jobs/run`, { headers: { authorization: `Bearer ${secret}` } });
  return new Response(`payload-jobs: ${response.status}`, { status: response.ok ? 200 : 502 });
};

export default runPayloadJobs;

export const config = { schedule: "15 5 * * *" };
