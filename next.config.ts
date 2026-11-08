import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

// Política de seguridad de contenidos de la web pública. Las páginas son estáticas
// (sin nonce), por eso los scripts en línea de Next se permiten con 'unsafe-inline';
// los orígenes externos se limitan a los servicios realmente usados:
// Google Analytics (solo tras consentimiento), Cloudflare Turnstile y Vercel Blob.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://challenges.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://*.google-analytics.com https://www.googletagmanager.com",
  "media-src 'self' https://*.public.blob.vercel-storage.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // 404 global con varios layouts raíz (web + Payload). Ver app/global-not-found.tsx.
  experimental: {
    globalNotFound: true,
    // La caché persistente de Turbopack en `next build` (activa por defecto en 16.4)
    // llegó a servir un CSS desfasado: faltaban las reglas añadidas al final de
    // globals.css, en local y en Vercel. Se desactiva para que cada build sea fiel al código.
    turbopackFileSystemCacheForBuild: false,
  },
  images: {
    // Medios del panel guardados en Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
    formats: ["image/avif", "image/webp"],
  },
  // Las redirecciones (www, WordPress y barra final) se resuelven en proxy.ts con un único 301.
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // HTTPS obligatorio 1 año. Sin includeSubDomains: no afecta a otros servicios del dominio (correo, etc.).
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
      {
        // CSP en la web pública (el panel de Payload gestiona sus propios recursos).
        source: "/((?!admin|api).*)",
        headers: [{ key: "Content-Security-Policy", value: CSP }],
      },
      {
        // Panel y API de Payload: nunca indexables, aunque alguien los enlace.
        source: "/(admin|api)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        // Recursos estáticos con nombre estable: caché larga en el navegador.
        source: "/:file(.*\\.(?:png|jpg|webp|avif|svg|mp4|otf))",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default withPayload(nextConfig);
