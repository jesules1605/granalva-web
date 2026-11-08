import type { GlobalConfig } from "payload";
import { isEditor } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

const internalOrAnchor = (value: string | null | undefined) =>
  !value || /^(\/[a-z0-9\-/#?=&]*|#[a-z0-9-]+|tel:\+?\d+|mailto:\S+)$/i.test(value) ? true : "Ruta interna («/…»), ancla («#contacto»), tel: o mailto:.";

// Portada: imagen principal y textos del primer bloque. Campos vacíos = valores
// revisados del código. Con borradores, versiones, vista previa y programación.
export const HomePage: GlobalConfig = {
  slug: "home-page",
  label: "Portada",
  admin: { group: "Páginas", description: "Imagen principal, titular y botones del inicio. Los campos vacíos usan el texto revisado para SEO." },
  access: { read: () => true, update: isEditor, readVersions: isEditor },
  versions: { drafts: { schedulePublish: true }, max: 50 },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "collapsible",
      label: "Imagen principal",
      fields: [
        { type: "row", fields: [
          { name: "imageDesktop", label: "Imagen de escritorio (mín. 1920 px de ancho)", type: "upload", relationTo: "media" },
          { name: "imageMobile", label: "Imagen móvil (vertical, mín. 900 px de ancho)", type: "upload", relationTo: "media" },
        ] },
        { name: "imageAlt", label: "Texto alternativo (si se deja vacío, el del archivo)", type: "text", maxLength: 160 },
        {
          name: "overlay",
          label: "Oscurecimiento azul (%)",
          type: "number",
          min: 40,
          max: 100,
          defaultValue: 85,
          admin: { description: "40 = foto muy visible; 100 = máximo contraste. Por debajo de 60 comprueba que el texto se lee bien." },
        },
        { name: "zoom", label: "Zoom lento (de 1 a 1,03 en 16 s, sin desplazamiento; se desactiva con movimiento reducido)", type: "checkbox", defaultValue: false },
      ],
    },
    {
      type: "collapsible",
      label: "Textos",
      fields: [
        { name: "eyebrow", label: "Etiqueta superior", type: "text", maxLength: 60 },
        { type: "row", fields: [
          { name: "titleLine1", label: "Titular (H1), primera línea", type: "text", maxLength: 60 },
          { name: "titleLine2", label: "Titular (H1), segunda línea destacada", type: "text", maxLength: 60 },
        ] },
        { name: "subtitle", label: "Subtítulo", type: "textarea", maxLength: 260 },
      ],
    },
    {
      type: "collapsible",
      label: "Botones",
      fields: [
        { type: "row", fields: [
          { name: "primaryLabel", label: "Botón principal: texto", type: "text", maxLength: 40 },
          { name: "primaryHref", label: "Botón principal: enlace", type: "text", validate: internalOrAnchor },
        ] },
        { type: "row", fields: [
          { name: "secondaryLabel", label: "Botón secundario: texto", type: "text", maxLength: 40 },
          { name: "secondaryHref", label: "Botón secundario: enlace", type: "text", validate: internalOrAnchor },
        ] },
      ],
    },
  ],
};
