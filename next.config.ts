import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  // 404 global con varios layouts raíz (web + Payload). Ver app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  images: {
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
        ],
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
