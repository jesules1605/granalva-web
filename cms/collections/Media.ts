import type { CollectionConfig } from "payload";
import { isEditor } from "../access";

// Biblioteca de medios. En producción los archivos se guardan en Vercel Blob
// (almacenamiento persistente, BLOB_READ_WRITE_TOKEN); nunca en el disco efímero.
// Solo imágenes (con recorte y punto focal) y documentos PDF descargables, con tamaño
// máximo controlado en payload.config.ts (upload.limits). Cada archivo guarda versiones
// para poder restaurar uno sustituido.
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Archivo", plural: "Medios" },
  admin: { group: "Contenido", defaultColumns: ["filename", "category", "alt", "credit", "updatedAt"], description: "Fotografías y vídeos. Usa solo imágenes propias o con licencia y añade siempre texto alternativo." },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isEditor },
  upload: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "application/pdf"],
    crop: true,
    focalPoint: true,
    imageSizes: [
      { name: "card", width: 800 },
      { name: "hero", width: 1920 },
    ],
    formatOptions: { format: "webp", options: { quality: 80 } },
  },
  versions: { maxPerDoc: 10 },
  fields: [
    { name: "alt", label: "Texto alternativo", type: "text", required: true, admin: { description: "Describe la imagen con naturalidad (qué se ve). Obligatorio." } },
    { name: "credit", label: "Autoría y licencia", type: "text", required: true, admin: { description: "P. ej. «Fotografía propia de Granalva» o «Autor · licencia». Necesario para publicar con garantías." } },
    { name: "category", label: "Uso previsto", type: "select", options: [
      { label: "Portada (principal)", value: "portada" },
      { label: "Sierra Nevada", value: "sierra-nevada" },
      { label: "Limpieza de apartamentos", value: "limpieza-apartamentos" },
      { label: "Lavandería", value: "lavanderia" },
      { label: "Empresas", value: "empresas" },
      { label: "Renting textil", value: "renting" },
      { label: "Equipo", value: "equipo" },
      { label: "Blog", value: "blog" },
      { label: "Logotipo de cliente", value: "logotipo" },
      { label: "Documento", value: "documento" },
      { label: "Otro", value: "otro" },
    ], admin: { description: "Ayuda a encontrar cada foto en la biblioteca (filtro «Uso previsto»)." } },
    { name: "realPhoto", label: "Es una fotografía real de Granalva (personas, instalaciones o trabajos propios)", type: "checkbox", defaultValue: false },
  ],
};
