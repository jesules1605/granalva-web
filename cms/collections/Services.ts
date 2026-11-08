import type { CollectionConfig } from "payload";
import { servicePages } from "../../app/lib/services";
import { isEditor, isOwnerOrAdmin, publishedOrEditor } from "../access";
import { revalidate } from "../hooks/revalidate";

// Ajustes editables de cada página de servicio. El contenido SEO base (H1, textos,
// proceso, FAQ por defecto) vive en app/lib/services.ts y está cubierto por pruebas;
// aquí el equipo puede sustituir la portada (foto, alt, foco), el title/description,
// el resumen, el CTA y las preguntas frecuentes. Campo vacío = valor por defecto.
const lengthBetween = (min: number, max: number) => (value: string | null | undefined) =>
  !value || (value.length >= min && value.length <= max) ? true : `Entre ${min} y ${max} caracteres (ahora ${value.length}).`;

export const Services: CollectionConfig = {
  slug: "services",
  labels: { singular: "Servicio", plural: "Servicios" },
  admin: {
    group: "Contenido",
    useAsTitle: "slug",
    defaultColumns: ["slug", "_status", "updatedAt"],
    description: "Ajustes por servicio. Los campos vacíos usan el texto revisado para SEO.",
    preview: (doc) => `/api/preview?path=/servicios/${doc.slug as string}`,
  },
  access: { read: publishedOrEditor, create: isOwnerOrAdmin, update: isEditor, delete: isOwnerOrAdmin },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 30 },
  hooks: { afterChange: [async ({ doc }) => { await revalidate(["/servicios", `/servicios/${doc.slug}`]); return doc; }] },
  fields: [
    { name: "slug", label: "Servicio", type: "select", required: true, unique: true, options: servicePages.map((service) => ({ label: service.navLabel, value: service.slug })) },
    {
      type: "collapsible",
      label: "Portada (ServiceHero)",
      fields: [
        { type: "row", fields: [
          { name: "heroImage", label: "Fotografía de escritorio", type: "upload", relationTo: "media", admin: { description: "Real y relacionada con el servicio (mín. 1920 px). Recorte y punto focal: en el propio archivo." } },
          { name: "heroImageMobile", label: "Fotografía móvil (opcional, vertical)", type: "upload", relationTo: "media" },
        ] },
        { name: "heroAlt", label: "Texto alternativo (vacío = el del archivo)", type: "text", maxLength: 160 },
        { name: "heroOverlay", label: "Oscurecimiento azul (%)", type: "number", min: 40, max: 100, defaultValue: 72, admin: { description: "Por debajo de 60 comprueba en la vista previa que el texto se lee bien." } },
        { name: "eyebrow", label: "Etiqueta superior", type: "text", maxLength: 60 },
        { name: "tagline", label: "Frase editorial", type: "text", maxLength: 80 },
        { name: "ctaLabel", label: "Texto del botón principal", type: "text", maxLength: 40 },
      ],
    },
    {
      type: "collapsible",
      label: "SEO",
      fields: [
        { name: "metaTitle", label: "Title (sin «| Granalva»)", type: "text", validate: lengthBetween(25, 62), admin: { description: "Una intención por página; no repitas el title de otro servicio." } },
        { name: "metaDescription", label: "Meta description", type: "textarea", validate: lengthBetween(110, 160) },
        { name: "summary", label: "Resumen (entradilla y tarjetas)", type: "textarea", validate: lengthBetween(80, 260) },
      ],
    },
    {
      name: "faqs",
      label: "Preguntas frecuentes (sustituyen a las predeterminadas si hay al menos una)",
      type: "array",
      labels: { singular: "Pregunta", plural: "Preguntas" },
      fields: [
        { name: "question", label: "Pregunta", type: "text", required: true },
        { name: "answer", label: "Respuesta", type: "textarea", required: true },
      ],
    },
  ],
};
