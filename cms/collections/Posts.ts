import type { CollectionConfig } from "payload";
import { isEditor, isOwnerOrAdmin, publishedOrEditor } from "../access";
import { revalidate, revalidateSiteOnDelete } from "../hooks/revalidate";

// Blog: borradores, versiones, publicación programada y vista previa.
// Nada de artículos de relleno: cada entrada responde a una intención del
// calendario editorial (docs/CALENDARIO-EDITORIAL.md) y enlaza a su servicio.
const slugify = (value: string) =>
  value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Artículo", plural: "Blog" },
  admin: {
    group: "Contenido",
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "publishedAt", "updatedAt"],
    preview: (doc) => `/api/preview?path=/blog/${doc.slug as string}`,
  },
  access: { read: publishedOrEditor, create: isEditor, update: isEditor, delete: isOwnerOrAdmin },
  versions: { drafts: { schedulePublish: true, autosave: { interval: 2000 } }, maxPerDoc: 50 },
  defaultSort: "-publishedAt",
  hooks: {
    afterChange: [async ({ doc }) => { await revalidate(["/blog", `/blog/${doc.slug}`, "/sitemap.xml"]); return doc; }],
    afterDelete: [revalidateSiteOnDelete(["/blog", "/sitemap.xml"])],
  },
  fields: [
    { name: "title", label: "Título (H1)", type: "text", required: true, maxLength: 90 },
    {
      name: "slug",
      label: "URL (/blog/…)",
      type: "text",
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "Se genera desde el título si se deja vacío. No la cambies tras publicar (o crea una redirección)." },
      hooks: { beforeValidate: [({ value, siblingData }) => slugify((value as string) || (siblingData.title as string) || "")] },
    },
    { name: "publishedAt", label: "Fecha de publicación", type: "date", admin: { position: "sidebar" } },
    { name: "author", label: "Autoría (texto)", type: "text", defaultValue: "Equipo Granalva", admin: { position: "sidebar" } },
    { name: "authorMember", label: "Autor (persona del equipo)", type: "relationship", relationTo: "team", admin: { position: "sidebar" } },
    { name: "categories", label: "Categorías", type: "relationship", relationTo: "categories", hasMany: true, admin: { position: "sidebar" } },
    { name: "excerpt", label: "Entradilla", type: "textarea", required: true, maxLength: 260 },
    { name: "cover", label: "Imagen principal", type: "upload", relationTo: "media" },
    { name: "content", label: "Contenido", type: "richText", required: true },
    {
      name: "relatedService",
      label: "Servicio relacionado (enlace al final del artículo)",
      type: "text",
      admin: { description: "Slug del servicio, p. ej. lavanderia-hoteles-granada." },
    },
    {
      type: "collapsible",
      label: "SEO",
      fields: [
        { name: "metaTitle", label: "Title", type: "text", maxLength: 62 },
        { name: "metaDescription", label: "Meta description", type: "textarea", maxLength: 160 },
        { name: "noindex", label: "No indexar este artículo", type: "checkbox", defaultValue: false },
        { name: "serpPreview", type: "ui", admin: { components: { Field: { path: "/cms/components/SerpPreview#SerpPreview", clientProps: { path: "" } } } } },
      ],
    },
  ],
};
