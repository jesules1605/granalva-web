import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Breadcrumbs } from "../../../components/breadcrumbs";
import { SiteFooter, SiteHeader } from "../../../components/site-chrome";
import { focalOf, getPost, getPosts } from "../../../lib/cms";
import { breadcrumbJsonLd, jsonLdString, ORGANIZATION_ID, WEBSITE_ID, type Crumb } from "../../../lib/seo";
import { serviceBySlug } from "../../../lib/services";
import { absoluteUrl, BUSINESS } from "../../../lib/site";
import type { Media } from "../../../../payload-types";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug ?? "" })).filter((post) => post.slug);
}

const formatDate = (iso: string) => new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(iso));
const cover = (value: unknown) => (value && typeof value === "object" && "url" in value ? (value as Media) : null);

async function load(slug: string) {
  const { isEnabled } = await draftMode();
  return getPost(slug, isEnabled);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) return {};
  const title = post.metaTitle || `${post.title} | Granalva`;
  const description = post.metaDescription || post.excerpt;
  const url = absoluteUrl(`/blog/${post.slug}`);
  const image = cover(post.cover);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: post.noindex || post._status !== "published" ? { index: false, follow: true } : undefined,
    openGraph: { type: "article", locale: "es_ES", siteName: BUSINESS.name, url, title, description, publishedTime: post.publishedAt ?? undefined, modifiedTime: post.updatedAt, images: image?.url ? [{ url: image.url, alt: image.alt }] : undefined },
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = await load(slug);
  if (!post) notFound();
  const url = absoluteUrl(`/blog/${post.slug}`);
  const image = cover(post.cover);
  const related = post.relatedService ? serviceBySlug[post.relatedService] : undefined;
  const crumbs: Crumb[] = [
    { name: "Inicio", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        url,
        mainEntityOfPage: url,
        inLanguage: "es-ES",
        datePublished: post.publishedAt ?? post.createdAt,
        dateModified: post.updatedAt,
        author: { "@type": "Organization", name: post.author || BUSINESS.name, url: absoluteUrl("/sobre-nosotros") },
        publisher: { "@id": ORGANIZATION_ID },
        isPartOf: { "@id": WEBSITE_ID },
        ...(image?.url ? { image: image.url } : {}),
      },
      { ...breadcrumbJsonLd(crumbs), "@id": `${url}#breadcrumb` },
    ],
  };

  return (
    <main className="site-shell blog-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      <SiteHeader />
      <article className="blog-article">
        <header>
          <Breadcrumbs crumbs={crumbs} tone="dark" />
          <h1>{post.title}</h1>
          <p className="blog-article__meta">
            {post.author || "Equipo Granalva"}
            {post.publishedAt ? <> · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></> : null}
          </p>
          <p className="blog-article__excerpt">{post.excerpt}</p>
        </header>
        {image?.url ? (
          <div className="blog-article__cover">
            <Image src={image.url} alt={image.alt} fill priority sizes="(max-width: 900px) 100vw, 860px" style={{ objectPosition: focalOf(image) }} />
          </div>
        ) : null}
        <div className="blog-article__content">
          <RichText data={post.content} />
        </div>
        {related ? (
          <aside className="blog-article__related">
            <span>Servicio relacionado</span>
            <Link href={`/servicios/${related.slug}`}>{related.navLabel} <span aria-hidden="true">→</span></Link>
          </aside>
        ) : null}
      </article>
      <SiteFooter />
    </main>
  );
}
