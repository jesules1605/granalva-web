import type { CollectionAfterChangeHook, CollectionConfig, Field, PayloadRequest, TextFieldSingleValidation } from "payload";
import { PAGE_BLOCKS } from "../blocks";
import { isEditor, isOwnerOrAdmin, publishedOrEditor } from "../access";
import { revalidate } from "../hooks/revalidate";

// Páginas editables (Sobre nosotros, Contacto, Referencias, legales, Empresas,
// Particulares y cualquier página nueva). Si existe una página publicada con el slug
// de una ruta de la web, sustituye al contenido por defecto del código.
// Borradores, versiones (restaurar), vista previa y publicación programada.

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://limpiezasgranalva.com").replace(/\/$/, "");
/** Rutas propias de la web que una página del panel no puede ocupar. */
export const RESERVED_SLUGS = ["servicios", "blog", "admin", "api", "inicio", "hello-world", "feed", "servicios-de-limpieza-granada", "_next", "sitemap.xml", "robots.txt"];

export const seoFields = (options: { canonicalPath?: boolean } = {}): Field => ({
  name: "seo",
  label: "SEO",
  type: "group",
  admin: { description: "Vacío = valores por defecto. Una intención de búsqueda por página; no copies el title de otra." },
  fields: [
    { name: "metaTitle", label: "Title (sin «| Granalva»)", type: "text", validate: (v: string | null | undefined) => !v || (v.length >= 20 && v.length <= 62) ? true : `Entre 20 y 62 caracteres (ahora ${v?.length}).` },
    { name: "metaDescription", label: "Meta description", type: "textarea", validate: (v: string | null | undefined) => !v || (v.length >= 100 && v.length <= 160) ? true : `Entre 100 y 160 caracteres (ahora ${v?.length}).` },
    ...(options.canonicalPath === false ? [] : [{
      name: "canonical",
      label: "Canonical (solo si debe apuntar a otra URL del dominio)",
      type: "text" as const,
      validate: (v: string | null | undefined) => {
        if (!v) return true;
        if (/vercel\.app/.test(v)) return "Nunca una URL de vercel.app.";
        return v.startsWith(`${SITE}/`) || v === SITE ? true : `Debe empezar por ${SITE}`;
      },
    }]),
    { type: "row", fields: [
      { name: "ogTitle", label: "Título para redes (Open Graph)", type: "text", maxLength: 90 },
      { name: "ogImage", label: "Imagen para redes (1200×630)", type: "upload", relationTo: "media" },
    ] },
    { name: "ogDescription", label: "Descripción para redes", type: "textarea", maxLength: 200 },
    { type: "row", fields: [
      { name: "noindex", label: "No indexar (ocultar de Google)", type: "checkbox", defaultValue: false },
      {
        name: "noindexConfirm",
        label: "Confirmo que esta página NO debe aparecer en Google",
        type: "checkbox",
        defaultValue: false,
        validate: (value: boolean | null | undefined, { siblingData }: { siblingData: { noindex?: boolean } }) =>
          !siblingData.noindex || value ? true : "Para ocultar la página de Google marca también la confirmación.",
      },
    ] },
    {
      name: "schemaType",
      label: "Tipo de página (datos estructurados)",
      type: "select",
      defaultValue: "WebPage",
      options: [
        { label: "Página", value: "WebPage" },
        { label: "Sobre la empresa", value: "AboutPage" },
        { label: "Contacto", value: "ContactPage" },
        { label: "Listado o referencias", value: "CollectionPage" },
      ],
    },
  ],
});

/** Si cambia el slug de una página publicada: 301 de la URL antigua a la nueva, sin cadenas. */
const redirectOnSlugChange: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const before = previousDoc?.slug as string | undefined;
  if (before && before !== doc.slug && previousDoc?._status === "published" && doc._status === "published") {
    const from = `/${before}`;
    const to = `/${doc.slug}`;
    // Las redirecciones que apuntaban a la URL antigua pasan a apuntar a la nueva (sin cadenas).
    const pointing = await req.payload.find({ collection: "redirects", where: { to: { equals: from } }, limit: 100, depth: 0, req });
    for (const redirect of pointing.docs) await req.payload.update({ collection: "redirects", id: redirect.id, data: { to }, req });
    const existing = await req.payload.find({ collection: "redirects", where: { from: { equals: from } }, limit: 1, depth: 0, req });
    if (existing.docs[0]) await req.payload.update({ collection: "redirects", id: existing.docs[0].id, data: { to }, req });
    else await req.payload.create({ collection: "redirects", data: { from, to, type: "301", note: `Cambio de slug de «${doc.title}»` }, req });
  }
  await revalidate([`/${doc.slug}`, ...(before && before !== doc.slug ? [`/${before}`] : []), "/sitemap.xml"]);
  return doc;
};

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "Página", plural: "Páginas" },
  admin: {
    group: "Páginas",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
    description: "Páginas y secciones de la web. Una página publicada con el slug de una página existente (p. ej. «sobre-nosotros») la sustituye.",
    preview: (doc) => `/api/preview?path=/${doc.slug as string}`,
  },
  access: { read: publishedOrEditor, create: isEditor, update: isEditor, delete: isOwnerOrAdmin },
  versions: { drafts: { schedulePublish: true, autosave: { interval: 2000 } }, maxPerDoc: 50 },
  hooks: { afterChange: [redirectOnSlugChange] },
  fields: [
    { name: "title", label: "Título de la página (H1)", type: "text", required: true, maxLength: 90, admin: { description: "Es el único H1 de la página." } },
    {
      name: "slug",
      label: "URL (/…)",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { position: "sidebar", description: "Minúsculas y guiones. Si la cambias tras publicar se crea una redirección 301 automáticamente." },
      validate: (async (value: string | null | undefined, { req, id }: { req: PayloadRequest; id?: string | number }) => {
        if (!value || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) return "Solo minúsculas, números y guiones (sin barras).";
        if (RESERVED_SLUGS.includes(value)) return "Esa URL está reservada por la web.";
        const redirect = await req.payload.find({ collection: "redirects", where: { from: { equals: `/${value}` } }, limit: 1, depth: 0 });
        if (redirect.docs.length) return "Esa URL tiene una redirección activa: bórrala antes de reutilizarla.";
        const clash = await req.payload.find({ collection: "pages", where: { and: [{ slug: { equals: value } }, ...(id ? [{ id: { not_equals: id } }] : [])] }, limit: 1, depth: 0, draft: true });
        return clash.docs.length ? "Ya existe otra página con esa URL." : true;
      }) as TextFieldSingleValidation,
    },
    { name: "showInSitemap", label: "Incluir en el sitemap", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
    {
      name: "layout",
      label: "Secciones",
      type: "blocks",
      blocks: PAGE_BLOCKS,
      validate: (value: unknown) => {
        const blocks = (Array.isArray(value) ? value : []) as { blockType: string }[];
        const heroes = blocks.filter((block) => block.blockType === "hero").length;
        if (heroes > 1) return "Solo puede haber una «Portada con imagen» (la página tendría dos H1).";
        if (heroes === 1 && blocks[0]?.blockType !== "hero") return "La «Portada con imagen» debe ser la primera sección.";
        return true;
      },
    },
    seoFields(),
  ],
};
