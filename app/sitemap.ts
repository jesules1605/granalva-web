import type { MetadataRoute } from "next";
import { servicePages } from "./lib/services";
import { absoluteUrl } from "./lib/site";

// Solo URLs publicadas, indexables y canónicas. Con Payload (fase 4) se generará
// a partir del contenido publicado, excluyendo borradores y páginas noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  const latest = servicePages.map((service) => service.updatedAt).sort().at(-1)!;
  const priorityServices = new Set(["empresa-limpieza-granada", "lavanderia-profesional-granada", "lavanderia-sierra-nevada"]);

  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/servicios"), lastModified: latest, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/contacto"), lastModified: latest, changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/sobre-nosotros"), lastModified: latest, changeFrequency: "yearly", priority: 0.5 },
    ...servicePages.map((service) => ({
      url: absoluteUrl(`/servicios/${service.slug}`),
      lastModified: service.updatedAt,
      changeFrequency: "monthly" as const,
      priority: priorityServices.has(service.slug) ? 0.9 : 0.8,
    })),
  ];
}
