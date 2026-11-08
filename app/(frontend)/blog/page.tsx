import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../../components/breadcrumbs";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import { getPosts } from "../../lib/cms";
import { breadcrumbJsonLd, jsonLdString, ORGANIZATION_ID, WEBSITE_ID, type Crumb } from "../../lib/seo";
import { absoluteUrl, BUSINESS } from "../../lib/site";

// Índice del blog. Sin artículos publicados la página existe pero NO se indexa ni
// aparece en el sitemap ni en los menús: nada de páginas vacías o de relleno.
const TITLE = "Blog de limpieza y lavandería profesional en Granada | Granalva";
const DESCRIPTION = "Guías prácticas de Granalva sobre limpieza profesional, lavandería para hoteles y apartamentos turísticos y renting textil en Granada.";
const URL = absoluteUrl("/blog");
const crumbs: Crumb[] = [
  { name: "Inicio", path: "/" },
  { name: "Blog", path: "/blog" },
];

const formatDate = (iso: string) => new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(iso));

export async function generateMetadata(): Promise<Metadata> {
  const posts = await getPosts();
  return {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    alternates: { canonical: URL },
    robots: posts.length === 0 ? { index: false, follow: true } : undefined,
    openGraph: { type: "website", locale: "es_ES", siteName: BUSINESS.name, url: URL, title: TITLE, description: DESCRIPTION },
  };
}

export default async function BlogIndex() {
  const posts = await getPosts();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Blog", "@id": `${URL}#blog`, url: URL, name: TITLE, description: DESCRIPTION, inLanguage: "es-ES", isPartOf: { "@id": WEBSITE_ID }, publisher: { "@id": ORGANIZATION_ID } },
      { ...breadcrumbJsonLd(crumbs), "@id": `${URL}#breadcrumb` },
    ],
  };
  return (
    <main className="site-shell blog-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      <SiteHeader />
      <section className="blog-head">
        <Breadcrumbs crumbs={crumbs} tone="dark" />
        <h1 className="wide-title">Blog de limpieza y lavandería profesional</h1>
      </section>
      <section className="blog-list" aria-label="Artículos">
        {posts.length === 0 ? (
          <p className="blog-empty">Estamos preparando las primeras guías. Mientras tanto, consulta <Link href="/servicios">todos los servicios</Link> o <Link href="/contacto">escríbenos</Link>.</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <article>
                  {post.publishedAt ? <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> : null}
                  <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                  <p>{post.excerpt}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
