import type { CollectionConfig, Where } from "payload";

const publicLogos: Where = { and: [{ visible: { equals: true } }, { authorized: { equals: true } }] };
import { isEditor, isOwnerOrAdmin } from "../access";
import { revalidateSite, revalidateSiteOnDelete } from "../hooks/revalidate";

// Logotipos de empresas colaboradoras. Solo se publican con archivo oficial y
// autorización por escrito: sin autorización registrada, el logotipo no aparece.
export const ClientLogos: CollectionConfig = {
  slug: "client-logos",
  labels: { singular: "Empresa colaboradora", plural: "Empresas colaboradoras" },
  admin: { group: "Contenido", useAsTitle: "name", defaultColumns: ["name", "authorized", "authorizationDate", "visible"] },
  access: {
    read: ({ req }) => (req.user ? true : publicLogos),
    create: isEditor,
    update: isEditor,
    delete: isOwnerOrAdmin,
  },
  defaultSort: "order",
  hooks: { afterChange: [revalidateSite(["/"])], afterDelete: [revalidateSiteOnDelete(["/"])] },
  fields: [
    { type: "row", fields: [
      { name: "name", label: "Empresa", type: "text", required: true },
      { name: "order", label: "Orden", type: "number", defaultValue: 10 },
    ] },
    { name: "logo", label: "Logotipo oficial (SVG convertido a PNG/WebP o PNG transparente)", type: "upload", relationTo: "media", required: true },
    { type: "row", fields: [
      { name: "authorized", label: "La empresa ha autorizado por escrito el uso de su logotipo", type: "checkbox", defaultValue: false, access: { update: ({ req }) => ["owner", "admin"].includes((req.user as { role?: string } | null)?.role ?? "") } },
      { name: "authorizationDate", label: "Fecha de la autorización", type: "date" },
    ] },
    { name: "authorizationNote", label: "Dónde consta la autorización (correo, contrato…)", type: "text" },
    { name: "visible", label: "Visible en la web", type: "checkbox", defaultValue: true },
  ],
};
