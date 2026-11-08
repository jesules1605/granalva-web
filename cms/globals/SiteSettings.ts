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
        { name: "whatsapp", label: "WhatsApp (solo números, con prefijo: 34600000000)", type: "text", validate: (v: string | null | undefined) => !v || /^\d{9,15}$/.test(v) ? true : "Solo dígitos, con prefijo internacional." },
        { name: "areaServedLabel", label: "Zona de servicio (texto visible)", type: "text" },
      ],
    },
    { name: "ribbon", label: "Marquesina superior", type: "array", maxRows: 8, fields: [{ name: "text", label: "Texto", type: "text", required: true, maxLength: 48 }] },
    { name: "footerTagline", label: "Frase del pie", type: "text", maxLength: 80 },
  ],
};
