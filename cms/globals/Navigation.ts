import type { GlobalConfig } from "payload";
import { isOwnerOrAdmin } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

// Menú principal. Solo enlaces internos existentes o anclas.
export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Menú principal",
  admin: { group: "Configuración" },
  access: { read: () => true, update: isOwnerOrAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: "links",
      label: "Enlaces",
      type: "array",
      maxRows: 8,
      fields: [
        { type: "row", fields: [
          { name: "label", label: "Texto", type: "text", required: true, maxLength: 24 },
          { name: "href", label: "Ruta interna", type: "text", required: true, validate: (v: string | null | undefined) => /^\/[a-z0-9\-/#?=]*$/i.test(v ?? "") ? true : "Ruta interna que empiece por «/»." },
        ] },
      ],
    },
  ],
};
