// Configuración de Payload CMS (panel en /admin). Documentación: docs/CMS-ADMIN-PLAN.md
import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { es } from "@payloadcms/translations/languages/es";
import { buildConfig } from "payload";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import sharp from "sharp";
import { ClientLogos } from "./cms/collections/ClientLogos";
import { ContactSubmissions } from "./cms/collections/ContactSubmissions";
import { Media } from "./cms/collections/Media";
import { Posts } from "./cms/collections/Posts";
import { Redirects } from "./cms/collections/Redirects";
import { Reviews } from "./cms/collections/Reviews";
import { Services } from "./cms/collections/Services";
import { Team } from "./cms/collections/Team";
import { Users } from "./cms/collections/Users";
import { Navigation } from "./cms/globals/Navigation";
import { SiteSettings } from "./cms/globals/SiteSettings";

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
  collections: [ContactSubmissions, Services, Posts, Media, Team, Reviews, ClientLogos, Redirects, Users],
  globals: [SiteSettings, Navigation],
  // Subidas: máximo 15 MB por archivo (los tipos MIME se limitan en cada colección).
  upload: { limits: { fileSize: 15 * 1024 * 1024 } },
  // Medios persistentes: en producción y preproducción, Vercel Blob (BLOB_READ_WRITE_TOKEN).
  // Sin el token (desarrollo local) se usa el disco local, que NO es persistente en Vercel.
  plugins: [
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || "" },
    migrationDir: path.resolve(dirname, "migrations"),
    // En producción el esquema solo cambia mediante migraciones versionadas.
    push: process.env.NODE_ENV !== "production" && process.env.PAYLOAD_DB_PUSH !== "false",
  }),
  email,
  // Publicación programada (blog y servicios): la cola de trabajos se ejecuta desde
  // la tarea cron de Vercel (vercel.json) con CRON_SECRET, o por un usuario del panel.
  jobs: {
    access: {
      run: ({ req }) => {
        if (req.user) return true;
        const secret = process.env.CRON_SECRET;
        return Boolean(secret) && req.headers.get("authorization") === `Bearer ${secret}`;
      },
    },
  },
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  sharp,
});
