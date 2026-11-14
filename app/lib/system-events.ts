import "server-only";
import config from "@payload-config";
import { getPayload } from "payload";

/** Registra una incidencia técnica sin datos personales (para las alertas). Nunca lanza errores. */
export async function logSystemEvent(type: "form_error" | "form_verification" | "email_error", path?: string, detail?: string) {
  if (!process.env.DATABASE_URL) return;
  try {
    const payload = await getPayload({ config });
    await payload.create({ collection: "system-events", overrideAccess: true, data: { type, path: path?.split(/[?#]/)[0].slice(0, 200), detail: detail?.replace(/\S+@\S+/g, "[correo]").slice(0, 200) } });
  } catch {
    /* la incidencia no debe romper el formulario */
  }
}
