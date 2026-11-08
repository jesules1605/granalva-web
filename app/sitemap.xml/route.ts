import { sitemapIndexXml, xmlResponse } from "../lib/sitemaps";

// Índice de sitemaps (páginas, servicios y blog), referenciado en robots.txt.
export const revalidate = 3600;
export async function GET() {
  return xmlResponse(await sitemapIndexXml());
}
