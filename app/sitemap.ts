import type { MetadataRoute } from "next";
import { servicePages, SITE_URL } from "./lib/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-05T00:00:00.000Z");
  const serviceUrls: MetadataRoute.Sitemap = servicePages.map((service) => ({
    url: `${SITE_URL}/servicios/${service.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: service.slug === "empresa-limpieza-granada" || service.slug === "lavanderia-profesional-granada" ? 0.9 : 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/servicios`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...serviceUrls,
  ];
}
