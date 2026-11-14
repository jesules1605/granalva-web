/**
 * Diccionario de eventos de analítica de Granalva (fuente única).
 * Lo usan la web (capa de datos de Google Tag Manager), las pruebas y la documentación
 * (docs/ANALITICA.md). Ningún evento lleva datos personales: solo los parámetros de
 * ALLOWED_PARAMS, con valores filtrados por sanitizeParams().
 */

export const EVENTS = {
  // Navegación e interés
  page_view: "Vista de página (una por ruta, también en navegación interna)",
  service_view: "Vista de una página de servicio",
  business_service_view: "Vista de un servicio para empresas",
  private_service_view: "Vista de un servicio para particulares",
  sierra_nevada_view: "Vista de la página de Sierra Nevada",
  blog_article_view: "Vista de un artículo del blog",
  scroll_50: "Desplazamiento hasta el 50 % de la página",
  scroll_90: "Desplazamiento hasta el 90 % de la página",
  // Botones y contacto
  quote_cta_click: "Clic en «Solicitar presupuesto» (microconversión)",
  order_cta_click: "Clic en «Hacer un pedido» de particulares",
  phone_click: "Clic para llamar (conversión)",
  whatsapp_click: "Clic en WhatsApp (conversión)",
  email_click: "Clic en el correo",
  app_order_click: "Acceso a la aplicación de pedidos (conversión)",
  map_click: "Clic en el mapa o la dirección",
  // Formulario
  quote_form_view: "El formulario entra en pantalla",
  quote_form_start: "Primera interacción con el formulario (microconversión)",
  quote_form_step: "Apertura de los datos operativos opcionales",
  quote_form_validation_error: "Error de validación (datos incompletos o incorrectos)",
  quote_form_submit: "Pulsación de enviar (aún no es una solicitud)",
  quote_form_success: "Solicitud guardada y confirmada por el servidor (conversión principal)",
  quote_form_error: "Fallo técnico o de verificación al guardar la solicitud",
  // Campañas y autoridad
  client_logo_click: "Clic en el logotipo de una empresa colaboradora",
  review_interaction: "Interacción con las reseñas (pausa, anterior o siguiente)",
  campaign_view: "Vista de una campaña destacada",
  campaign_cta_click: "Clic en el botón de una campaña",
  sierra_nevada_quote_click: "Clic en presupuesto o ruta de temporada de Sierra Nevada",
} as const;

export type AnalyticsEvent = keyof typeof EVENTS;

/** Eventos clave (conversiones) en GA4. */
export const KEY_EVENTS: AnalyticsEvent[] = ["quote_form_success", "phone_click", "whatsapp_click", "app_order_click"];
/** Microconversiones: interés, no solicitudes terminadas. */
export const MICRO_CONVERSIONS: AnalyticsEvent[] = ["quote_cta_click", "quote_form_start"];

/** Únicos parámetros que pueden salir hacia las plataformas de analítica. */
export const ALLOWED_PARAMS = [
  "page_path",
  "page_type",
  "service_slug",
  "audience_type",
  "cta_location",
  "form_type",
  "campaign_name",
  "device_category",
  "language",
  "conversion_type",
  "event_id",
  "traffic_type",
  "form_field_count",
  "form_step",
] as const;
export type AnalyticsParams = Partial<Record<(typeof ALLOWED_PARAMS)[number], string | number>>;

const PERSONAL = [/@/, /\+?\d[\d\s().-]{7,}\d/]; // correos y números de teléfono

/** Quita parámetros no permitidos, consultas de URL y cualquier valor que parezca un dato personal. */
export function sanitizeParams(params: Record<string, unknown>): AnalyticsParams {
  const clean: AnalyticsParams = {};
  for (const key of ALLOWED_PARAMS) {
    const raw = params[key];
    if (raw === undefined || raw === null || raw === "") continue;
    if (typeof raw === "number") {
      clean[key] = raw;
      continue;
    }
    let value = String(raw).slice(0, 100);
    if (key === "page_path") value = value.split(/[?#]/)[0];
    if (PERSONAL.some((pattern) => pattern.test(value))) continue;
    clean[key] = value;
  }
  return clean;
}

export const SIERRA_NEVADA_SLUG = "lavanderia-sierra-nevada";
export const PRIVATE_SERVICE_SLUGS = ["lavanderia-domicilio-granada"];

export type PageInfo = { page_type: string; service_slug?: string; audience_type?: "empresa" | "particular" };

/** Tipo de página a partir de la ruta (sin consultar datos). */
export function pageInfo(path: string): PageInfo {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  if (clean === "/") return { page_type: "home" };
  const service = clean.match(/^\/servicios\/([^/]+)$/);
  if (service) {
    const slug = service[1];
    if (slug === SIERRA_NEVADA_SLUG) return { page_type: "sierra_nevada", service_slug: slug, audience_type: "empresa" };
    return { page_type: "service", service_slug: slug, audience_type: PRIVATE_SERVICE_SLUGS.includes(slug) ? "particular" : "empresa" };
  }
  if (clean === "/servicios") return { page_type: "service_index" };
  if (clean === "/blog") return { page_type: "blog_index" };
  if (clean.startsWith("/blog/")) return { page_type: "blog_article" };
  if (clean === "/contacto") return { page_type: "contact" };
  if (["/aviso-legal", "/politica-de-privacidad", "/politica-de-cookies", "/declaracion-de-accesibilidad"].includes(clean)) return { page_type: "legal" };
  return { page_type: "page" };
}
