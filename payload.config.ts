// Configuración de Payload CMS (panel en /admin). Documentación: docs/CMS-ADMIN-PLAN.md
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { es } from "@payloadcms/translations/languages/es";
import { buildConfig } from "payload";
import sharp from "sharp";
import { ContactSubmissions } from "./cms/collections/ContactSubmissions";
import { Users } from "./cms/collections/Users";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// El correo se activa solo si hay SMTP configurado. Sin él, las solicitudes se
// registran igualmente y quedan marcadas como «aviso pendiente».
const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.EMAIL_FROM || "info@limpiezasgranalva.com",
      defaultFromName: "Web Granalva",
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT || 587) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      },
    })
  : undefined;

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || "",
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || "",
  admin: {
    user: Users.slug,
    meta: { titleSuffix: " · Granalva", icons: [{ rel: "icon", url: "/favicon.svg" }] },
    // Sin Gravatar: evita enviar a terceros un hash del correo de cada usuario.
    avatar: "default",
    components: {
      graphics: {
        Logo: "/cms/components/AdminBrand#AdminLogo",
        Icon: "/cms/components/AdminBrand#AdminIcon",
      },
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { fallbackLanguage: "es", supportedLanguages: { es } },
  collections: [Users, ContactSubmissions],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
    migrationDir: path.resolve(dirname, "migrations"),
    // En producción el esquema solo cambia mediante migraciones versionadas.
    push: process.env.NODE_ENV !== "production" && process.env.PAYLOAD_DB_PUSH !== "false",
  }),
  email,
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  sharp,
});
