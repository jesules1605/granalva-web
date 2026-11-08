import type { CollectionConfig } from "payload";
import { isEditor, isOwnerOrAdmin } from "../access";
import { revalidateSite, revalidateSiteOnDelete } from "../hooks/revalidate";

// Campañas estacionales (Sierra Nevada y otras). La portada muestra la campaña activa
// de mayor prioridad dentro de sus fechas; sin campaña activa, el bloque por defecto.
export const Campaigns: CollectionConfig = {
  slug: "campaigns",
  labels: { singular: "Campaña", plural: "Campañas estacionales" },
  admin: { group: "Páginas", useAsTitle: "name", defaultColumns: ["name", "active", "startDate", "endDate"], description: "Bloque de temporada de la portada (p. ej. Sierra Nevada). Sin campaña activa se muestra el texto revisado por defecto." },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isOwnerOrAdmin },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 20 },
  hooks: { afterChange: [revalidateSite(["/"])], afterDelete: [revalidateSiteOnDelete(["/"])] },
  fields: [
    { type: "row", fields: [
      { name: "name", label: "Nombre interno", type: "text", required: true },
      { name: "active", label: "Activa", type: "checkbox", defaultValue: true },
      { name: "priority", label: "Prioridad", type: "number", defaultValue: 10 },
    ] },
    { type: "row", fields: [
      { name: "startDate", label: "Desde (opcional)", type: "date", admin: { date: { pickerAppearance: "dayOnly" } } },
      { name: "endDate", label: "Hasta (opcional)", type: "date", admin: { date: { pickerAppearance: "dayOnly" } } },
    ] },
    { name: "label", label: "Etiqueta", type: "text", required: true, maxLength: 60 },
    { name: "title", label: "Titular (H2)", type: "text", required: true, maxLength: 90 },
    { name: "text", label: "Texto", type: "textarea", required: true, maxLength: 400 },
    { name: "points", label: "Puntos", type: "array", maxRows: 6, fields: [
      { type: "row", fields: [
        { name: "title", label: "Título", type: "text", required: true, maxLength: 40 },
        { name: "text", label: "Texto", type: "text", required: true, maxLength: 90 },
      ] },
    ] },
    { type: "row", fields: [
      { name: "primaryLabel", label: "Botón principal", type: "text", required: true },
      { name: "primaryHref", label: "Enlace", type: "text", required: true },
    ] },
    { type: "row", fields: [
      { name: "secondaryLabel", label: "Enlace secundario", type: "text" },
      { name: "secondaryHref", label: "Enlace", type: "text" },
    ] },
  ],
};
