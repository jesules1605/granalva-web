// Definición compartida del formulario de solicitudes (cliente y servidor).
// Se valida siempre en el servidor; el navegador solo ayuda con `required`.
import { servicePages } from "./services";

export const BUSINESS_TYPES = [
  "Hotel o apartahotel",
  "Apartamentos turísticos o gestor",
  "Alojamiento rural, albergue u hostal",
  "Oficina o despacho",
  "Comercio o local",
  "Centro deportivo",
  "Comunidad de propietarios",
  "Obra o reforma",
  "Particular",
  "Otro",
] as const;

export const FREQUENCIES = [
  "Diaria",
  "Varias veces por semana",
  "Semanal",
  "Quincenal o mensual",
  "Solo en temporada",
  "Servicio puntual",
  "Aún no lo sé",
] as const;

export const SERVICE_OPTIONS = [
  ...servicePages.map((service) => ({ value: service.slug, label: service.navLabel })),
  { value: "varios", label: "Varios servicios" },
] as const;

/** Versión del texto de información básica de privacidad que acepta el usuario. */
export const CONSENT_VERSION = "2026-11-07-borrador";

export type ContactFormState = {
  status: "idle" | "ok" | "error";
  message: string;
  reference?: string;
  fieldErrors?: Partial<Record<FieldName, string>>;
};

export type FieldName =
  | "tipoCliente"
  | "servicio"
  | "empresa"
  | "contacto"
  | "telefono"
  | "email"
  | "ubicacion"
  | "unidades"
  | "volumen"
  | "frecuencia"
  | "inicio"
  | "mensaje"
  | "consentimiento";

export type ContactSubmission = {
  tipoCliente: string;
  servicio: string;
  empresa: string;
  contacto: string;
  telefono: string;
  email: string;
  ubicacion: string;
  unidades: string;
  volumen: string;
  frecuencia: string;
  inicio: string;
  mensaje: string;
  formulario: string;
  consentVersion: string;
  attribution: {
    pagina: string;
    paginaEntrada: string;
    referrer: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign: string;
    utmTerm: string;
    utmContent: string;
  };
};

const text = (data: FormData, name: string, max: number) => String(data.get(name) ?? "").trim().slice(0, max);

/** Valida y normaliza el envío. Devuelve los datos limpios o los errores por campo. */
export function parseSubmission(data: FormData): { ok: true; value: ContactSubmission } | { ok: false; errors: ContactFormState["fieldErrors"] } {
  const errors: NonNullable<ContactFormState["fieldErrors"]> = {};
  const value: ContactSubmission = {
    tipoCliente: text(data, "tipoCliente", 80),
    servicio: text(data, "servicio", 80),
    empresa: text(data, "empresa", 160),
    contacto: text(data, "contacto", 120),
    telefono: text(data, "telefono", 30),
    email: text(data, "email", 160).toLowerCase(),
    ubicacion: text(data, "ubicacion", 160),
    unidades: text(data, "unidades", 60),
    volumen: text(data, "volumen", 120),
    frecuencia: text(data, "frecuencia", 60),
    inicio: text(data, "inicio", 120),
    mensaje: text(data, "mensaje", 3000),
    formulario: text(data, "formulario", 40) || "general",
    consentVersion: CONSENT_VERSION,
    attribution: {
      pagina: text(data, "pagina", 300),
      paginaEntrada: text(data, "paginaEntrada", 300),
      referrer: text(data, "referrer", 300),
      utmSource: text(data, "utm_source", 120),
      utmMedium: text(data, "utm_medium", 120),
      utmCampaign: text(data, "utm_campaign", 120),
      utmTerm: text(data, "utm_term", 120),
      utmContent: text(data, "utm_content", 120),
    },
  };

  if (!BUSINESS_TYPES.includes(value.tipoCliente as (typeof BUSINESS_TYPES)[number])) errors.tipoCliente = "Indica qué tipo de cliente eres.";
  if (!SERVICE_OPTIONS.some((option) => option.value === value.servicio)) errors.servicio = "Elige el servicio que te interesa.";
  if (value.contacto.length < 2) errors.contacto = "Indica una persona de contacto.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.email)) errors.email = "Revisa el correo electrónico.";
  if (value.telefono && !/^[+\d][\d\s().-]{6,}$/.test(value.telefono)) errors.telefono = "Revisa el número de teléfono.";
  if (value.frecuencia && !FREQUENCIES.includes(value.frecuencia as (typeof FREQUENCIES)[number])) errors.frecuencia = "Elige una frecuencia de la lista.";
  if (data.get("consentimiento") !== "on") errors.consentimiento = "Necesitamos tu consentimiento para responder a la solicitud.";

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
