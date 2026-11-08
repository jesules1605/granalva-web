import type { CollectionConfig } from "payload";
import { isEditor, isOwnerOrAdmin } from "../access";

// Categorías del blog (p. ej. «Apartamentos turísticos», «Lavandería para hoteles»).
export const Categories: CollectionConfig = {
  slug: "categories",
  labels: { singular: "Categoría", plural: "Categorías del blog" },
  admin: { group: "Contenido", useAsTitle: "name" },
  access: { read: () => true, create: isEditor, update: isEditor, delete: isOwnerOrAdmin },
  fields: [
    { name: "name", label: "Nombre", type: "text", required: true, unique: true, maxLength: 60 },
    { name: "description", label: "Descripción", type: "textarea", maxLength: 200 },
  ],
};
