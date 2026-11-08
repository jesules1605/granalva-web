import type { MetadataRoute } from "next";
import { getPosts, getPublishedPages } from "./lib/cms";
import { servicePages } from "./lib/services";
import { absoluteUrl } from "./lib/site";

// Solo URLs publicadas, indexables y canónicas: borradores y artículos noindex
// quedan fuera; el índice del blog solo aparece cuando hay artículos publicados.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages] = await Promise.all([getPosts({ indexableOnly: true }), getPublishedPages()]);
  // Páginas nuevas del panel (las que sustituyen rutas existentes ya están listadas).
  const fixed = new Set(["contacto", "sobre-nosotros", "referencias", "aviso-legal", "politica-de-privacidad", "politica-de-cookies", "declaracion-de-accesibilidad"]);
  const panelPages = pages.filter((page) => page.showInSitemap !== false && !page.seo?.noindex && !fixed.has(page.slug));
  const latest = servicePages.map((service) => service.updatedAt).sort().at(-1)!;
  const priorityServices = new Set(["empresa-limpieza-granada", "lavanderia-profesional-granada", "lavanderia-sierra-nevada"]);

  return [
    { url: absoluteUrl("/"), lastModified: latest, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/servicios"), lastModified: latest, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/contacto"), lastModified: latest, changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/sobre-nosotros"), lastModified: latest, changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/referencias"), lastModified: latest, changeFrequency: "monthly", priority: 0.6 },
    ...servicePages.map((service) => ({
      url: absoluteUrl(`/servicios/${service.slug}`),
      lastModified: service.updatedAt,
      changeFrequency: "monthly" as const,
      priority: priorityServices.has(service.slug) ? 0.9 : 0.8,
    })),
    ...panelPages.map((page) => ({ url: absoluteUrl(`/${page.slug}`), lastModified: page.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...(posts.length > 0
      ? [
          { url: absoluteUrl("/blog"), lastModified: posts[0].updatedAt, changeFrequency: "weekly" as const, priority: 0.6 },
          ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
        ]
      : []),
  ];
}
