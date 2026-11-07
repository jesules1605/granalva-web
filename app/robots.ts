import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/services";
import { INDEXABLE } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  // Preproducción y previsualizaciones: no se rastrea nada.
  if (!INDEXABLE) return { rules: { userAgent: "*", disallow: "/" } };

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Panel, API y previsualizaciones de Payload nunca deben indexarse.
      disallow: ["/admin", "/api/", "/preview"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
