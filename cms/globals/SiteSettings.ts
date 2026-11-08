import type { GlobalConfig } from "payload";
import { isOwnerOrAdmin } from "../access";
import { revalidateGlobal } from "../hooks/revalidate";

// Ajustes generales. Los datos NAP (nombre, teléfono, correo) que alimentan el SEO local
// y los datos legales se cambian aquí con cuidado: deben coincidir con el perfil de Google.
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Ajustes del sitio",
  admin: { group: "Configuración" },
  access: { read: () => true, update: isOwnerOrAdmin },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: "collapsible",
      label: "Contacto",
      fields: [
        { type: "row", fields: [
          { name: "phoneDisplay", label: "Teléfono (como se muestra)", type: "text", admin: { description: "Vacío = 744 488 964. Debe coincidir con Google Business Profile." } },
          { name: "phoneE164", label: "Teléfono internacional (+34…)", type: "text", validate: (v: string | null | undefined) => !v || /^\+\d{9,15}$/.test(v) ? true : "Formato +34XXXXXXXXX." },
        ] },
        { name: "email", label: "Correo de contacto", type: "email" },
        { name: "whatsapp", label: "WhatsApp (solo números, con prefijo: 34600000000)", type: "text", validate: (v: string | null | undefined) => !v || /^\d{9,15}$/.test(v) ? true : "Solo dígitos, con prefijo internacional." },
        { name: "areaServedLabel", label: "Zona de servicio (texto visible)", type: "text" },
      ],
    },
    { name: "ribbon", label: "Marquesina superior", type: "array", maxRows: 8, fields: [{ name: "text", label: "Texto", type: "text", required: true, maxLength: 48 }] },
    { name: "footerTagline", label: "Frase del pie", type: "text", maxLength: 80 },
    {
      type: "collapsible",
      label: "Autoridad: años de experiencia y cifras",
      admin: { description: "Solo se muestran las cifras marcadas como verificadas y con su fuente." },
      fields: [
        { type: "row", fields: [
          { name: "yearsExperience", label: "Años de experiencia", type: "number", min: 1, max: 80 },
          { name: "yearsVerified", label: "Dato verificado", type: "checkbox", defaultValue: false },
        ] },
        { name: "yearsSource", label: "Fuente del dato (alta, escrituras, contrato…)", type: "text" },
        {
          name: "figures",
          label: "Cifras verificadas",
          type: "array",
          maxRows: 4,
          fields: [
            { type: "row", fields: [
              { name: "value", label: "Cifra", type: "text", required: true, maxLength: 12 },
              { name: "label", label: "Qué mide", type: "text", required: true, maxLength: 60 },
            ] },
            { type: "row", fields: [
              { name: "source", label: "Fuente", type: "text", required: true },
              { name: "verified", label: "Verificada", type: "checkbox", defaultValue: false },
            ] },
          ],
        },
      ],
    },
  ],
};
