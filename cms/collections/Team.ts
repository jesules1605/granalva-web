import type { CollectionConfig } from "payload";
import { isEditor, visibleOrEditor } from "../access";
import { revalidateSite, revalidateSiteOnDelete } from "../hooks/revalidate";

// Equipo de Granalva. Solo personas reales; la foto debe ser real (no de banco de imágenes).
export const Team: CollectionConfig = {
  slug: "team",
  labels: { singular: "Persona del equipo", plural: "Equipo" },
  admin: { group: "Contenido", useAsTitle: "name", defaultColumns: ["name", "role", "order", "visible"] },
  access: { read: visibleOrEditor, create: isEditor, update: isEditor, delete: isEditor },
  defaultSort: "order",
  hooks: { afterChange: [revalidateSite(["/", "/sobre-nosotros"])], afterDelete: [revalidateSiteOnDelete(["/", "/sobre-nosotros"])] },
  fields: [
    { type: "row", fields: [
      { name: "name", label: "Nombre", type: "text", required: true },
      { name: "role", label: "Función", type: "text", required: true },
      { name: "order", label: "Orden", type: "number", defaultValue: 10 },
    ] },
    { name: "text", label: "Descripción breve", type: "textarea", maxLength: 220 },
    {
      name: "photo",
      label: "Fotografía real",
      type: "upload",
      relationTo: "media",
      admin: { description: "Solo fotografías reales de esta persona, con su consentimiento. Nunca modelos de banco de imágenes." },
    },
    {
      name: "photoConsent",
      label: "La persona ha autorizado la publicación de su imagen",
      type: "checkbox",
      defaultValue: false,
      validate: (value: boolean | null | undefined, { siblingData }: { siblingData: { photo?: unknown } }) =>
        !siblingData.photo || value === true ? true : "Para publicar una fotografía hace falta la autorización de la persona.",
    },
    { name: "visible", label: "Visible en la web", type: "checkbox", defaultValue: true },
  ],
};
