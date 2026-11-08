import { SITEMAP_TYPES, sitemapEntries, urlsetXml, xmlResponse, type SitemapType } from "../../lib/sitemaps";

export const revalidate = 3600;
export function generateStaticParams() {
  return SITEMAP_TYPES.map((type) => ({ file: `${type}.xml` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const type = (await params).file.replace(/\.xml$/, "") as SitemapType;
  if (!SITEMAP_TYPES.includes(type)) return new Response("No encontrado", { status: 404 });
  return xmlResponse(urlsetXml(await sitemapEntries(type)));
}
