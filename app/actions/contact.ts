"use server";

import { headers } from "next/headers";
import { parseSubmission, type ContactFormState } from "../lib/contact-schema";
import { storeSubmission } from "../lib/submissions";

// Límite de frecuencia por IP: 5 envíos cada 10 minutos. En memoria del proceso:
// en una plataforma con varias instancias es una protección básica, no absoluta
// (Turnstile y el campo trampa cubren el resto).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile desactivado hasta configurar las claves.
  if (!token) return false;
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const result = (await response.json().catch(() => ({ success: false }))) as { success?: boolean };
  return Boolean(result.success);
}

const FALLBACK = "Llámanos al 744 488 964 o escribe a info@limpiezasgranalva.com.";

export async function submitContactRequest(_previous: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const requestHeaders = await headers();
  const ip = (requestHeaders.get("x-forwarded-for") ?? "").split(",")[0].trim() || "desconocida";

  // Campo trampa: los usuarios no lo ven; los bots suelen rellenarlo.
  // Se responde como si todo fuera bien para no dar pistas.
  if (String(formData.get("website") ?? "") !== "") return { status: "ok", message: "Solicitud recibida." };

  // Tiempo mínimo de rellenado (solo si el navegador ejecutó JavaScript).
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (startedAt && Date.now() - startedAt < 2500) {
    return { status: "error", message: "No hemos podido verificar el envío. Espera unos segundos y vuelve a intentarlo." };
  }

  if (rateLimited(ip)) {
    return { status: "error", message: `Has enviado varias solicitudes seguidas. Inténtalo de nuevo en unos minutos o ${FALLBACK.charAt(0).toLowerCase()}${FALLBACK.slice(1)}` };
  }

  if (!(await verifyTurnstile(String(formData.get("cf-turnstile-response") ?? ""), ip))) {
    return { status: "error", message: "No hemos podido verificar que no eres un robot. Vuelve a intentarlo." };
  }

  const parsed = parseSubmission(formData);
  if (!parsed.ok) {
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors: parsed.errors };
  }

  try {
    const key = String(formData.get("submissionKey") ?? "");
    const { reference, emailSent } = await storeSubmission(parsed.value, /^[0-9a-f-]{36}$/i.test(key) ? key : undefined);
    return {
      status: "ok",
      reference,
      message: emailSent
        ? `Hemos recibido tu solicitud (referencia ${reference}). El equipo de Granalva te contactará para estudiar tu caso.`
        : `Hemos registrado tu solicitud (referencia ${reference}). El equipo de Granalva te contactará para estudiar tu caso.`,
    };
  } catch (error) {
    console.error("[contacto] No se pudo registrar la solicitud", error instanceof Error ? error.message : error);
    return { status: "error", message: `No hemos podido registrar la solicitud por un problema técnico. ${FALLBACK}` };
  }
}
