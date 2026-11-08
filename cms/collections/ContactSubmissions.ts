import type { CollectionConfig } from "payload";
import { SERVICE_OPTIONS } from "../../app/lib/contact-schema";
import { isOwner, isOwnerOrAdmin } from "../access";
import { exportSubmissions } from "../endpoints/exportSubmissions";

/** Embudo comercial de cada solicitud (más «spam» para descartar envíos basura). */
export const SUBMISSION_STATUSES = [
  { label: "Nuevo", value: "nuevo" },
  { label: "Contactado", value: "contactado" },
  { label: "Presupuesto enviado", value: "presupuesto-enviado" },
  { label: "Ganado", value: "ganado" },
  { label: "Perdido", value: "perdido" },
  { label: "Spam", value: "spam" },
] as const;

// Solicitudes recibidas desde los formularios de la web.
// Solo propietario y administradores pueden verlas. Nadie las crea desde la API
// pública: la web las registra con la API local (server action) tras validarlas.
// Retención propuesta (pendiente de validar en la política de privacidad, fase 7):
// solicitudes sin relación comercial, 12 meses; spam, 30 días.
export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  labels: { singular: "Solicitud", plural: "Solicitudes" },
  admin: {
    useAsTitle: "reference",
    defaultColumns: ["reference", "createdAt", "status", "empresa", "contacto", "servicio", "formulario"],
    group: "Solicitudes",
    listSearchableFields: ["reference", "empresa", "contacto", "email", "telefono"],
    description: "Solicitudes de presupuesto y contacto recibidas en la web.",
    components: { beforeListTable: ["/cms/components/ExportCsvButton#ExportCsvButton"] },
  },
  endpoints: [{ path: "/export.csv", method: "get", handler: exportSubmissions }],
  access: {
    create: () => false,
    read: isOwnerOrAdmin,
    update: isOwnerOrAdmin,
    delete: isOwner,
  },
  defaultSort: "-createdAt",
  fields: [
    {
      type: "row",
      fields: [
        { name: "reference", label: "Referencia", type: "text", required: true, unique: true, index: true, admin: { readOnly: true } },
        {
          name: "status",
          label: "Estado",
          type: "select",
          required: true,
          defaultValue: "nuevo",
          index: true,
          options: SUBMISSION_STATUSES.map((status) => ({ ...status })),
        },
        { name: "assignedTo", label: "Responsable", type: "relationship", relationTo: "users" },
      ],
    },
    { name: "notes", label: "Notas internas", type: "textarea" },
    {
      type: "collapsible",
      label: "Datos de la solicitud",
      fields: [
        { type: "row", fields: [
          { name: "tipoCliente", label: "Tipo de cliente", type: "text", required: true },
          { name: "servicio", label: "Servicio", type: "select", required: true, index: true, options: SERVICE_OPTIONS.map((option) => ({ label: option.label, value: option.value })) },
          { name: "formulario", label: "Formulario", type: "text" },
        ] },
        { type: "row", fields: [
          { name: "empresa", label: "Nombre comercial", type: "text" },
          { name: "contacto", label: "Persona de contacto", type: "text", required: true },
        ] },
        { type: "row", fields: [
          { name: "telefono", label: "Teléfono", type: "text" },
          { name: "email", label: "Correo", type: "email", required: true },
        ] },
        { type: "row", fields: [
          { name: "ubicacion", label: "Ubicación", type: "text" },
          { name: "unidades", label: "Alojamientos o espacios", type: "text" },
          { name: "volumen", label: "Volumen de ropa", type: "text" },
        ] },
        { type: "row", fields: [
          { name: "frecuencia", label: "Frecuencia", type: "text" },
          { name: "inicio", label: "Temporada o inicio", type: "text" },
        ] },
        { name: "mensaje", label: "Información adicional", type: "textarea" },
      ],
    },
    {
      type: "collapsible",
      label: "Origen y consentimiento",
      admin: { initCollapsed: true },
      fields: [
        { name: "consentVersion", label: "Versión del texto de privacidad aceptado", type: "text", required: true },
        {
          name: "attribution",
          label: "Atribución",
          type: "group",
          fields: [
            { name: "pagina", label: "Página del formulario", type: "text" },
            { name: "paginaEntrada", label: "Página de entrada", type: "text" },
            { name: "referrer", label: "Referrer", type: "text" },
            { type: "row", fields: [
              { name: "utmSource", label: "utm_source", type: "text" },
              { name: "utmMedium", label: "utm_medium", type: "text" },
              { name: "utmCampaign", label: "utm_campaign", type: "text" },
            ] },
            { type: "row", fields: [
              { name: "utmTerm", label: "utm_term", type: "text" },
              { name: "utmContent", label: "utm_content", type: "text" },
            ] },
          ],
        },
        {
          name: "emailStatus",
          label: "Aviso por correo",
          type: "select",
          defaultValue: "pendiente",
          options: [
            { label: "Enviado", value: "enviado" },
            { label: "Pendiente (correo no configurado)", value: "pendiente" },
            { label: "Error al enviar", value: "error" },
          ],
          admin: { readOnly: true },
        },
        { name: "emailError", label: "Detalle del error de correo", type: "text", admin: { readOnly: true } },
        {
          name: "submissionKey",
          label: "Clave de envío (evita duplicados)",
          type: "text",
          unique: true,
          index: true,
          admin: { readOnly: true },
        },
      ],
    },
  ],
};
