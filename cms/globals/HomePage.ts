import type { GlobalConfig } from "payload";
import { isEditor } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

/** Secciones de la portada en su orden por defecto. */
export const HOME_SECTIONS = [
  { value: "propuesta", label: "Propuesta de valor y recorridos" },
  { value: "servicios", label: "Servicios para empresas" },
  { value: "lavanderia", label: "Lavandería" },
  { value: "sierra", label: "Temporada en Sierra Nevada" },
  { value: "sectores", label: "Sectores" },
  { value: "proceso", label: "Proceso de recogida y entrega" },
  { value: "autoridad", label: "Autoridad y experiencia" },
  { value: "empresas", label: "Empresas colaboradoras" },
  { value: "resenas", label: "Reseñas" },
  { value: "equipo", label: "Equipo" },
  { value: "cta", label: "Llamada final" },
  { value: "contacto", label: "Contacto y formulario" },
] as const;

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
          defaultValue: 70,
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
      name: "sections",
      label: "Secciones de la portada (arrastra para reordenar; marca «Ocultar» para retirarla)",
      type: "array",
      admin: { description: "Vacío = orden por defecto. Cada sección solo puede aparecer una vez." },
      validate: (value: unknown) => {
        const keys = ((Array.isArray(value) ? value : []) as { section?: string }[]).map((row) => row.section);
        return new Set(keys).size === keys.length ? true : "Cada sección solo puede aparecer una vez.";
      },
      fields: [
        { type: "row", fields: [
          { name: "section", label: "Sección", type: "select", required: true, options: HOME_SECTIONS.map((section) => ({ ...section })) },
          { name: "hidden", label: "Ocultar", type: "checkbox", defaultValue: false },
        ] },
        { name: "heading", label: "Titular (H2) opcional", type: "text", maxLength: 120, admin: { description: "Vacío = titular por defecto." } },
      ],
    },
    {
      name: "seo",
      label: "SEO de la portada",
      type: "group",
      fields: [
        { name: "metaTitle", label: "Title completo", type: "text", validate: (v: string | null | undefined) => !v || (v.length >= 30 && v.length <= 65) ? true : "Entre 30 y 65 caracteres." },
        { name: "metaDescription", label: "Meta description", type: "textarea", validate: (v: string | null | undefined) => !v || (v.length >= 110 && v.length <= 160) ? true : "Entre 110 y 160 caracteres." },
        { name: "ogImage", label: "Imagen para redes (1200×630)", type: "upload", relationTo: "media" },
        {
          name: "noindex",
          label: "⚠ No indexar la portada (la retiraría de Google)",
          type: "checkbox",
          defaultValue: false,
          admin: { description: "Solo para emergencias. En producción hundiría el posicionamiento de toda la web." },
        },
        {
          name: "noindexConfirm",
          label: "Entiendo que la portada desaparecerá de Google",
          type: "checkbox",
          defaultValue: false,
          validate: (value: boolean | null | undefined, { siblingData }: { siblingData: { noindex?: boolean } }) =>
            !siblingData.noindex || value ? true : "Confirma expresamente que quieres retirar la portada de Google.",
        },
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
