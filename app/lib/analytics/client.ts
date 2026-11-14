"use client";

import { sanitizeParams, type AnalyticsEvent } from "./events";

/**
 * Capa de datos de la web (solo navegador).
 * - Sin consentimiento de analítica no se envía nada: track() no hace nada.
 * - Cada evento pasa por sanitizeParams(): lista blanca de parámetros, sin datos personales.
 * - Un mismo evento con los mismos parámetros en menos de 1 s se ignora (doble clic,
 *   doble montaje de React o doble manejador).
 */

export const CONSENT_COOKIE = "granalva_consent";
export const CONSENT_VERSION = 2;
export const CONSENT_EVENT = "granalva:consent";

export type ConsentChoice = { v: number; id: string; analytics: boolean; date: string };

export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((item) => item.startsWith(`${CONSENT_COOKIE}=`))?.slice(CONSENT_COOKIE.length + 1);
  if (!raw) return null;
  try {
    const choice = JSON.parse(decodeURIComponent(raw)) as ConsentChoice;
    return choice.v === CONSENT_VERSION ? choice : null;
  } catch {
    return null;
  }
}

export const hasAnalyticsConsent = () => Boolean(readConsent()?.analytics);

/** Solo el dominio definitivo envía datos (se excluyen localhost y la preproducción). */
export function isProductionHost() {
  if (typeof location === "undefined") return false;
  const allowed = [process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname : "", ...(process.env.NEXT_PUBLIC_ANALYTICS_EXTRA_HOSTS ?? "").split(",")]
    .map((host) => host.trim())
    .filter(Boolean);
  return allowed.includes(location.hostname);
}

const INTERNAL_KEY = "granalva_interno";

/** ?granalva_interno=1 marca este navegador como tráfico interno (=0 lo desmarca). */
export function syncInternalFlag() {
  try {
    const flag = new URLSearchParams(location.search).get(INTERNAL_KEY);
    if (flag === "1") localStorage.setItem(INTERNAL_KEY, "1");
    if (flag === "0") localStorage.removeItem(INTERNAL_KEY);
  } catch {
    /* almacenamiento bloqueado: no pasa nada */
  }
}

function isInternal() {
  try {
    return localStorage.getItem(INTERNAL_KEY) === "1";
  } catch {
    return false;
  }
}

export const deviceCategory = () => (typeof window === "undefined" ? "" : window.matchMedia("(max-width: 767px)").matches ? "mobile" : window.matchMedia("(max-width: 1023px)").matches ? "tablet" : "desktop");

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };
const recent = new Map<string, number>();

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return false;
  const payload = sanitizeParams({
    page_path: location.pathname,
    language: document.documentElement.lang || "es",
    device_category: deviceCategory(),
    traffic_type: isInternal() ? "internal" : undefined,
    ...params,
  });
  const key = `${event}|${JSON.stringify(payload)}`;
  const now = Date.now();
  if (now - (recent.get(key) ?? 0) < 1000) return false;
  recent.set(key, now);
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload });
  return true;
}

/** Identificador único de evento (deduplicación de conversiones). */
export const eventId = () => (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
