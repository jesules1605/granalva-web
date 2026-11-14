import type { GlobalConfig } from "payload";
import { isOwnerOrAdmin } from "../access";

// Ajustes de «Analítica y rendimiento». Solo identificadores públicos y preferencias:
// las claves secretas (OAuth de Google, token de Cloudflare) van en variables de entorno
// de Netlify; el token de acceso de Google se guarda cifrado y nunca se devuelve por la API.
export const AnalyticsSettings: GlobalConfig = {
  slug: "analytics-settings",
  label: "Ajustes de analítica",
  admin: { group: "Analítica", description: "Identificadores de las cuentas de Granalva, destinatarios de informes y umbrales de alerta." },
  access: { read: isOwnerOrAdmin, update: isOwnerOrAdmin },
  fields: [
    {
      type: "collapsible",
      label: "Cuentas e identificadores (todas propiedad de Granalva)",
      fields: [
        { type: "row", fields: [
          { name: "ga4MeasurementId", label: "GA4 · ID de medición (G-…)", type: "text" },
          { name: "ga4PropertyId", label: "GA4 · ID de propiedad (número)", type: "text", admin: { description: "Administrar → Detalles de la propiedad. Necesario para el panel." } },
        ] },
        { type: "row", fields: [
          { name: "gtmContainerId", label: "Tag Manager · contenedor (GTM-…)", type: "text" },
          { name: "clarityProjectId", label: "Clarity · ID del proyecto", type: "text" },
        ] },
        { type: "row", fields: [
          { name: "cloudflareSiteTag", label: "Cloudflare Web Analytics · site tag", type: "text", admin: { description: "Identificador del sitio (no es el token del fragmento)." } },
          { name: "searchConsoleProperty", label: "Search Console · propiedad", type: "text", defaultValue: "sc-domain:limpiezasgranalva.com" },
        ] },
        { name: "lookerStudioUrl", label: "Looker Studio · enlace del informe (privado)", type: "text" },
      ],
    },
    {
      type: "collapsible",
      label: "Informes y alertas",
      fields: [
        {
          name: "recipients",
          label: "Destinatarios (solo cuentas de Granalva)",
          type: "array",
          labels: { singular: "Destinatario", plural: "Destinatarios" },
          fields: [{ name: "email", label: "Correo", type: "email", required: true }],
        },
        { type: "row", fields: [
          { name: "weeklyReport", label: "Resumen semanal (lunes)", type: "checkbox", defaultValue: true },
          { name: "monthlyReport", label: "Informe mensual (día 1)", type: "checkbox", defaultValue: true },
          { name: "alerts", label: "Alertas", type: "checkbox", defaultValue: true },
        ] },
        { type: "row", fields: [
          { name: "noLeadsDays", label: "Alerta si no llegan solicitudes en (días)", type: "number", defaultValue: 10, min: 2 },
          { name: "formErrorsPerDay", label: "Alerta con errores de formulario en 24 h (≥)", type: "number", defaultValue: 3, min: 1 },
          { name: "organicDropPercent", label: "Alerta si los clics orgánicos caen (%)", type: "number", defaultValue: 40, min: 10 },
        ] },
        { type: "row", fields: [
          { name: "notFoundIncreasePercent", label: "Alerta si las 404 suben (%)", type: "number", defaultValue: 100, min: 10 },
          { name: "lcpThresholdMs", label: "LCP máximo p75 (ms)", type: "number", defaultValue: 2500 },
          { name: "inpThresholdMs", label: "INP máximo p75 (ms)", type: "number", defaultValue: 200 },
          { name: "clsThreshold", label: "CLS máximo p75", type: "number", defaultValue: 0.1 },
        ] },
      ],
    },
    {
      type: "collapsible",
      label: "Conexión con Google (Analytics y Search Console)",
      admin: { initCollapsed: true },
      fields: [
        { name: "googleConnectedEmail", label: "Cuenta conectada", type: "text", admin: { readOnly: true } },
        { name: "googleConnectedAt", label: "Conectada el", type: "date", admin: { readOnly: true } },
        // Token de actualización cifrado con PAYLOAD_SECRET. Nunca se lee desde la API ni el panel.
        { name: "googleRefreshToken", type: "text", access: { read: () => false, update: () => false, create: () => false }, admin: { hidden: true } },
        // Última vez que se envió cada alerta (evita repetirlas a diario).
        { name: "alertState", type: "json", admin: { hidden: true } },
      ],
    },
  ],
};
