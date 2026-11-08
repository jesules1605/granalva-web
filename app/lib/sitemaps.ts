import "server-only";
import { getPosts, getPublishedPages } from "./cms";
import { servicePages } from "./services";
import { absoluteUrl } from "./site";

// Sitemaps por tipo de contenido. Solo URLs publicadas, indexables y canónicas:
// borradores, páginas noindex y el blog vacío quedan fuera.
export type SitemapEntry = { url: string; lastModified: string; changeFrequency: string; priority: number };
export const SITEMAP_TYPES = ["paginas", "servicios", "blog"] as const;
export type SitemapType = (typeof SITEMAP_TYPES)[number];

const FIXED_PANEL = new Set(["contacto", "sobre-nosotros", "referencias", "aviso-legal", "politica-de-privacidad", "politica-de-cookies", "declaracion-de-accesibilidad"]);
const latest = () => servicePages.map((service) => service.updatedAt).sort().at(-1)!;

export async function sitemapEntries(type: SitemapType): Promise<SitemapEntry[]> {
  if (type === "servicios") {
    const priority = new Set(["empresa-limpieza-granada", "lavanderia-profesional-granada", "lavanderia-sierra-nevada"]);
    return [
      { url: absoluteUrl("/servicios"), lastModified: latest(), changeFrequency: "monthly", priority: 0.9 },
      ...servicePages.map((service) => ({ url: absoluteUrl(`/servicios/${service.slug}`), lastModified: service.updatedAt, changeFrequency: "monthly", priority: priority.has(service.slug) ? 0.9 : 0.8 })),
    ];
  }
  if (type === "blog") {
    const posts = await getPosts({ indexableOnly: true });
    if (posts.length === 0) return [];
    return [
      { url: absoluteUrl("/blog"), lastModified: posts[0].updatedAt, changeFrequency: "weekly", priority: 0.6 },
      ...posts.map((post) => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updatedAt, changeFrequency: "monthly", priority: 0.6 })),
    ];
  }
  const pages = (await getPublishedPages()).filter((page) => page.showInSitemap !== false && !page.seo?.noindex && !FIXED_PANEL.has(page.slug));
  return [
    { url: absoluteUrl("/"), lastModified: latest(), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/contacto"), lastModified: latest(), changeFrequency: "yearly", priority: 0.6 },
    { url: absoluteUrl("/sobre-nosotros"), lastModified: latest(), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/referencias"), lastModified: latest(), changeFrequency: "monthly", priority: 0.6 },
    ...pages.map((page) => ({ url: absoluteUrl(`/${page.slug}`), lastModified: page.updatedAt, changeFrequency: "monthly", priority: 0.6 })),
  ];
}

const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const xmlResponse = (body: string) =>
  new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" } });

export const urlsetXml = (entries: SitemapEntry[]) =>
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries
    .map((e) => `<url>\n<loc>${esc(e.url)}</loc>\n<lastmod>${new Date(e.lastModified).toISOString()}</lastmod>\n<changefreq>${e.changeFrequency}</changefreq>\n<priority>${e.priority}</priority>\n</url>`)
    .join("\n")}\n</urlset>`;

export async function sitemapIndexXml() {
  const parts: string[] = [];
  for (const type of SITEMAP_TYPES) {
    const entries = await sitemapEntries(type);
    if (entries.length === 0) continue;
    const last = entries.map((e) => new Date(e.lastModified).getTime()).sort().at(-1)!;
    parts.push(`<sitemap>\n<loc>${absoluteUrl(`/sitemaps/${type}.xml`)}</loc>\n<lastmod>${new Date(last).toISOString()}</lastmod>\n</sitemap>`);
  }
  return `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${parts.join("\n")}\n</sitemapindex>`;
}
