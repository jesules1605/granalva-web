import type { CollectionConfig } from "payload";
import { isOwner, isOwnerOrAdmin } from "../access";

// Incidencias técnicas sin datos personales (p. ej. un formulario que no se pudo guardar).
// Alimentan las alertas de /admin/analitica. Retención propuesta: 90 días.
export const SystemEvents: CollectionConfig = {
  slug: "system-events",
  labels: { singular: "Incidencia técnica", plural: "Incidencias técnicas" },
  admin: { group: "Analítica", defaultColumns: ["createdAt", "type", "path", "detail"], description: "Errores técnicos registrados por la web (sin datos personales)." },
  access: { create: () => false, read: isOwnerOrAdmin, update: () => false, delete: isOwner },
  defaultSort: "-createdAt",
  fields: [
    { name: "type", label: "Tipo", type: "select", required: true, index: true, options: [
      { label: "Error al guardar una solicitud", value: "form_error" },
      { label: "Verificación antispam fallida", value: "form_verification" },
      { label: "Error de correo", value: "email_error" },
    ] },
    { name: "path", label: "Página", type: "text" },
    { name: "detail", label: "Detalle técnico", type: "text" },
  ],
};
