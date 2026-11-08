import type { CollectionConfig } from "payload";
import { servicePages } from "../../app/lib/services";
import { isOwnerOrAdmin } from "../access";

// Rutas reales de la web: una redirección nunca puede ocultarlas.
const PROTECTED = new Set(["/", "/servicios", "/contacto", "/sobre-nosotros", "/blog", "/aviso-legal", "/politica-de-privacidad", "/politica-de-cookies", "/declaracion-de-accesibilidad", ...servicePages.map((service) => `/servicios/${service.slug}`)]);

// Redirecciones gestionadas desde el panel (además del mapa fijo de app/lib/redirects.ts).
// Se aplican solo a rutas que no existen (nunca ocultan una página real) y siempre en un salto.
export const Redirects: CollectionConfig = {
  slug: "redirects",
  labels: { singular: "Redirección", plural: "Redirecciones" },
  admin: { group: "SEO", useAsTitle: "from", defaultColumns: ["from", "to", "type", "note"], description: "Solo 301/308, sin cadenas ni bucles. Nunca redirijas todo a la portada." },
  access: { read: () => true, create: isOwnerOrAdmin, update: isOwnerOrAdmin, delete: isOwnerOrAdmin },
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
