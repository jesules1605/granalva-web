import type { CollectionConfig } from "payload";
import { isEditor, visibleOrEditor } from "../access";
import { revalidateSite, revalidateSiteOnDelete } from "../hooks/revalidate";

// Reseñas reales copiadas literalmente de su plataforma de origen.
// No se publican valoraciones en datos estructurados (directrices de Google).
export const Reviews: CollectionConfig = {
  slug: "reviews",
  labels: { singular: "Reseña", plural: "Reseñas" },
  admin: { group: "Contenido", useAsTitle: "author", defaultColumns: ["author", "platform", "date", "visible"], description: "Solo reseñas reales, copiadas sin editar, con su plataforma y fecha." },
  access: { read: visibleOrEditor, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: "-date",
  hooks: { afterChange: [revalidateSite(["/"])], afterDelete: [revalidateSiteOnDelete(["/"])] },
  fields: [
    { name: "quote", label: "Texto literal de la reseña", type: "textarea", required: true, maxLength: 600 },
    { type: "row", fields: [
      { name: "author", label: "Autor (como aparece en la plataforma)", type: "text", required: true },
      { name: "platform", label: "Plataforma", type: "select", required: true, defaultValue: "Google", options: ["Google", "Booking", "Airbnb", "Tripadvisor", "Otra"].map((value) => ({ label: value, value })) },
      { name: "date", label: "Fecha de publicación", type: "date", required: true, admin: { date: { pickerAppearance: "dayOnly" } } },
    ] },
    { name: "sourceUrl", label: "Enlace a la reseña o al perfil", type: "text" },
    { name: "rating", label: "Valoración (1-5)", type: "number", min: 1, max: 5, defaultValue: 5 },
    { name: "relatedToCompany", label: "El autor tiene relación con Granalva (familiar, empleado…)", type: "checkbox", defaultValue: false, admin: { description: "Si está marcado, la reseña no se mostrará en la web." } },
    { name: "visible", label: "Visible en la web", type: "checkbox", defaultValue: true },
  ],
};
