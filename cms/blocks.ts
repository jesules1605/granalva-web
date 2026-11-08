import type { Block, Field } from "payload";
import { servicePages } from "../app/lib/services";

// Secciones reutilizables de las páginas del panel. Reordenar y duplicar es nativo
// del editor de bloques de Payload; cada sección puede ocultarse sin borrarla.
// Ningún bloque genera un H1: el H1 es el título de la página (o el de su portada).

const linkValidate = (value: string | null | undefined) =>
  !value || /^(\/[a-z0-9\-/#?=&]*|#[a-z0-9-]+|tel:\+?\d+|mailto:\S+|https:\/\/\S+)$/i.test(value) ? true : "Ruta interna («/…»), ancla («#…»), tel:, mailto: o https://";

const common: Field[] = [
  { type: "row", fields: [
    { name: "hidden", label: "Ocultar esta sección", type: "checkbox", defaultValue: false },
    { name: "anchor", label: "Ancla (id) opcional", type: "text", validate: (v: string | null | undefined) => !v || /^[a-z0-9-]+$/.test(v) ? true : "Minúsculas, números y guiones." },
  ] },
];

const button = (name: string, label: string): Field => ({
  type: "row",
  fields: [
    { name: `${name}Label`, label: `${label}: texto`, type: "text", maxLength: 40 },
    { name: `${name}Href`, label: `${label}: enlace`, type: "text", validate: linkValidate },
  ],
});

const heading = (label = "Titular de la sección (H2)"): Field => ({ name: "heading", label, type: "text", maxLength: 120 });

export const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Portada con imagen", plural: "Portadas con imagen" },
  fields: [
    ...common,
    { name: "eyebrow", label: "Etiqueta superior", type: "text", maxLength: 60 },
    { name: "lead", label: "Entradilla", type: "textarea", maxLength: 300 },
    { name: "tagline", label: "Frase editorial", type: "text", maxLength: 90 },
    { type: "row", fields: [
      { name: "image", label: "Imagen de escritorio", type: "upload", relationTo: "media" },
      { name: "imageMobile", label: "Imagen móvil (opcional)", type: "upload", relationTo: "media" },
    ] },
    { name: "overlay", label: "Oscurecimiento azul (%)", type: "number", min: 40, max: 100, defaultValue: 90 },
    button("primary", "Botón principal"),
    button("secondary", "Botón secundario"),
  ],
};

export const TextBlock: Block = {
  slug: "text",
  labels: { singular: "Texto", plural: "Textos" },
  fields: [...common, heading(), { name: "label", label: "Etiqueta", type: "text", maxLength: 60 }, { name: "content", label: "Contenido", type: "richText", required: true }],
};

export const ImageTextBlock: Block = {
  slug: "imageText",
  labels: { singular: "Imagen y texto", plural: "Imágenes y texto" },
  fields: [
    ...common,
    heading(),
    { name: "content", label: "Texto", type: "richText", required: true },
    { type: "row", fields: [
      { name: "image", label: "Imagen", type: "upload", relationTo: "media", required: true },
      { name: "imagePosition", label: "Imagen a la", type: "select", defaultValue: "right", options: [{ label: "Derecha", value: "right" }, { label: "Izquierda", value: "left" }] },
    ] },
    button("button", "Botón"),
  ],
};

export const CardsBlock: Block = {
  slug: "cards",
  labels: { singular: "Tarjetas", plural: "Tarjetas" },
  fields: [
    ...common,
    heading(),
    { name: "columns", label: "Columnas", type: "select", defaultValue: "3", options: ["2", "3", "4"].map((value) => ({ label: value, value })) },
    {
      name: "items",
      label: "Tarjetas",
      type: "array",
      minRows: 1,
      maxRows: 12,
      fields: [
        { name: "title", label: "Título", type: "text", required: true, maxLength: 80 },
        { name: "text", label: "Texto", type: "textarea", maxLength: 300 },
        { name: "href", label: "Enlace (opcional)", type: "text", validate: linkValidate },
        { name: "image", label: "Imagen (opcional)", type: "upload", relationTo: "media" },
      ],
    },
  ],
};

export const ProcessBlock: Block = {
  slug: "process",
  labels: { singular: "Proceso", plural: "Procesos" },
  fields: [
    ...common,
    heading(),
    { name: "steps", label: "Pasos", type: "array", minRows: 2, maxRows: 8, fields: [{ name: "title", label: "Paso", type: "text", required: true }, { name: "text", label: "Descripción", type: "textarea" }] },
  ],
};

export const FaqBlock: Block = {
  slug: "faq",
  labels: { singular: "Preguntas frecuentes", plural: "Preguntas frecuentes" },
  fields: [
    ...common,
    heading(),
    { name: "items", label: "Preguntas", type: "array", minRows: 1, fields: [{ name: "question", label: "Pregunta", type: "text", required: true }, { name: "answer", label: "Respuesta", type: "textarea", required: true }] },
    { name: "schema", label: "Publicar como datos estructurados FAQPage (solo si las respuestas son visibles y reales)", type: "checkbox", defaultValue: true },
  ],
};

export const CtaBlock: Block = {
  slug: "cta",
  labels: { singular: "Llamada a la acción", plural: "Llamadas a la acción" },
  fields: [...common, heading(), { name: "text", label: "Texto", type: "textarea", maxLength: 300 }, button("button", "Botón")],
};

export const ReviewsBlock: Block = {
  slug: "reviews",
  labels: { singular: "Reseñas", plural: "Reseñas" },
  fields: [...common, heading(), { name: "layout", label: "Presentación", type: "select", defaultValue: "grid", options: [{ label: "Cuadrícula (todas)", value: "grid" }, { label: "Carrusel", value: "carousel" }] }],
};

export const TeamBlock: Block = { slug: "team", labels: { singular: "Equipo", plural: "Equipo" }, fields: [...common, heading()] };
export const LogosBlock: Block = { slug: "logos", labels: { singular: "Empresas colaboradoras", plural: "Empresas colaboradoras" }, fields: [...common, heading()] };
export const SectorsBlock: Block = { slug: "sectors", labels: { singular: "Sectores", plural: "Sectores" }, fields: [...common, heading()] };

export const ServicesBlock: Block = {
  slug: "services",
  labels: { singular: "Servicios", plural: "Servicios" },
  fields: [
    ...common,
    heading(),
    { name: "services", label: "Servicios a mostrar", type: "select", hasMany: true, required: true, options: servicePages.map((service) => ({ label: service.navLabel, value: service.slug })) },
  ],
};

export const ContactBlock: Block = {
  slug: "contact",
  labels: { singular: "Formulario de contacto", plural: "Formularios de contacto" },
  fields: [
    ...common,
    heading(),
    { name: "text", label: "Texto", type: "textarea", maxLength: 400 },
    { name: "variant", label: "Formulario", type: "select", defaultValue: "general", options: [{ label: "General", value: "general" }, { label: "Sierra Nevada", value: "sierra-nevada" }] },
  ],
};

export const DocumentsBlock: Block = {
  slug: "documents",
  labels: { singular: "Documentos descargables", plural: "Documentos descargables" },
  fields: [...common, heading(), { name: "files", label: "Documentos (PDF)", type: "upload", relationTo: "media", hasMany: true, required: true }],
};

export const PAGE_BLOCKS: Block[] = [HeroBlock, TextBlock, ImageTextBlock, CardsBlock, ProcessBlock, FaqBlock, CtaBlock, ReviewsBlock, TeamBlock, LogosBlock, SectorsBlock, ServicesBlock, ContactBlock, DocumentsBlock];
