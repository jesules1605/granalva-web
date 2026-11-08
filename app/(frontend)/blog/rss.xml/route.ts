import { getPosts } from "../../../lib/cms";
import { absoluteUrl, BUSINESS } from "../../../lib/site";

// Feed RSS del blog (solo artículos publicados e indexables).
export const revalidate = 3600;
const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const posts = await getPosts({ indexableOnly: true });
  const items = posts
    .map((post) => `<item>\n<title>${esc(post.title)}</title>\n<link>${absoluteUrl(`/blog/${post.slug}`)}</link>\n<guid isPermaLink="true">${absoluteUrl(`/blog/${post.slug}`)}</guid>\n<pubDate>${new Date(post.publishedAt ?? post.createdAt).toUTCString()}</pubDate>\n<description>${esc(post.excerpt)}</description>\n</item>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel>\n<title>Blog de ${esc(BUSINESS.name)}</title>\n<link>${absoluteUrl("/blog")}</link>\n<description>Guías de limpieza y lavandería profesional en Granada.</description>\n<language>es-ES</language>\n${items}\n</channel></rss>`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
