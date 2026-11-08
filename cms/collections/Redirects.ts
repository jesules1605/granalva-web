import type { CollectionConfig } from "payload";
import { servicePages } from "../../app/lib/services";
import { isOwnerOrAdmin } from "../access";

// Rutas reales de la web: una redirección nunca puede ocultarlas.
const PROTECTED = new Set(["/", "/servicios", "/contacto", "/sobre-nosotros", "/referencias", "/blog", "/aviso-legal", "/politica-de-privacidad", "/politica-de-cookies", "/declaracion-de-accesibilidad", ...servicePages.map((service) => `/servicios/${service.slug}`)]);

// Redirecciones gestionadas desde el panel (además del mapa fijo de app/lib/redirects.ts).
// Se aplican solo a rutas que no existen (nunca ocultan una página real) y siempre en un salto.
export const Redirects: CollectionConfig = {
  slug: "redirects",
  labels: { singular: "Redirección", plural: "Redirecciones" },
  admin: { group: "SEO", useAsTitle: "from", defaultColumns: ["from", "to", "type", "note"], description: "Solo 301/308, sin cadenas ni bucles. Nunca redirijas todo a la portada." },
  access: { read: () => true, create: isOwnerOrAdmin, update: isOwnerOrAdmin, delete: isOwnerOrAdmin },
  hooks: {
    // Sin cadenas: el destino no puede ser a su vez una URL redirigida, y las reglas que
    // apuntaban a esta URL de origen pasan a apuntar directamente al destino final.
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        const to = String(data.to ?? "").replace(/\/+$/, "") || "/";
        const from = String(data.from ?? "").replace(/\/+$/, "") || "/";
        if (to.startsWith("/")) {
          const chained = await req.payload.find({ collection: "redirects", where: { and: [{ from: { equals: to } }, ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : [])] }, limit: 1, depth: 0, req });
          if (chained.docs[0]) throw new Error(`El destino ${to} ya redirige a ${chained.docs[0].to}: usa ese destino final para no crear una cadena.`);
        }
        const pointing = await req.payload.find({ collection: "redirects", where: { to: { equals: from } }, limit: 100, depth: 0, req });
        for (const redirect of pointing.docs) {
          if (redirect.id !== originalDoc?.id) await req.payload.update({ collection: "redirects", id: redirect.id, data: { to: data.to }, req });
        }
        return { ...data, from, to: data.to };
      },
    ],
  },
  fields: [
    { type: "row", fields: [
      {
        name: "from",
        label: "URL antigua (ruta)",
        type: "text",
        required: true,
        unique: true,
        index: true,
        validate: (value: string | null | undefined) => {
          const path = (value ?? "").replace(/\/+$/, "") || "/";
          if (!/^\/[a-z0-9\-/_.%]*$/i.test(value ?? "") || path.startsWith("/admin") || path.startsWith("/api")) return "Ruta relativa que empiece por «/» (no /admin ni /api).";
          if (PROTECTED.has(path)) return "Esa ruta es una página existente de la web: no se puede redirigir.";
          return true;
        },
      },
      {
        name: "to",
        label: "URL nueva",
        type: "text",
        required: true,
        validate: (value: string | null | undefined, { siblingData }: { siblingData: { from?: string } }) => {
          if (!value || !(value.startsWith("/") || value.startsWith("https://"))) return "Ruta relativa («/…») o URL https.";
          if (value === siblingData.from) return "El destino no puede ser igual que el origen.";
          return true;
        },
      },
      { name: "type", label: "Código", type: "select", required: true, defaultValue: "301", options: [{ label: "301 permanente", value: "301" }, { label: "308 permanente (conserva método)", value: "308" }] },
    ] },
    { name: "note", label: "Justificación", type: "text" },
  ],
};
