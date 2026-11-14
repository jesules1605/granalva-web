import type { CollectionConfig } from "payload";
import { isOwner, isOwnerOrAdmin } from "../access";

// Prueba técnica de cada elección de cookies (RGPD art. 7.1: el responsable debe poder
// demostrar el consentimiento). Sin IP, sin agente de usuario y sin datos personales:
// identificador aleatorio guardado en la propia cookie del visitante, decisión, versión,
// página y fecha. Retención propuesta: 2 años (docs/ANALITICA.md).
export const ConsentRecords: CollectionConfig = {
  slug: "consent-records",
  labels: { singular: "Registro de consentimiento", plural: "Registros de consentimiento" },
  admin: {
    group: "Analítica",
    useAsTitle: "consentId",
    defaultColumns: ["createdAt", "analytics", "version", "path"],
    description: "Prueba técnica de las decisiones sobre cookies. Sin datos personales.",
  },
  access: { create: () => false, read: isOwnerOrAdmin, update: () => false, delete: isOwner },
  defaultSort: "-createdAt",
  fields: [
    { name: "consentId", label: "Identificador aleatorio", type: "text", required: true, index: true },
    { name: "analytics", label: "Analítica aceptada", type: "checkbox", defaultValue: false },
    { name: "version", label: "Versión del aviso", type: "number", required: true },
    { name: "tools", label: "Herramientas mostradas", type: "text" },
    { name: "path", label: "Página", type: "text" },
  ],
};
