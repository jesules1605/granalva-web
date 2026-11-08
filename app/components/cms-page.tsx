import type { Metadata } from "next";
import { Breadcrumbs } from "./breadcrumbs";
import { faqsForSchema, PageBlocks } from "./page-blocks";
import { ServiceHero } from "./service-hero";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { breadcrumbJsonLd, faqJsonLd, jsonLdString, ORGANIZATION_ID, WEBSITE_ID, type Crumb } from "../lib/seo";
import { absoluteUrl, BUSINESS, INDEXABLE } from "../lib/site";
import type { Media, Page } from "../../payload-types";

const media = (value: unknown) => (value && typeof value === "object" && "url" in value ? ({ ...(value as Media), url: ((value as Media).url ?? "").replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, "") } as Media) : null);
const focal = (m: Media | null) => (m && typeof m.focalX === "number" && typeof m.focalY === "number" ? `${m.focalX}% ${m.focalY}%` : undefined);

/** Metadatos SEO de una página del panel (canonical siempre en el dominio final). */
export function cmsPageMetadata(page: Page): Metadata {
  const path = `/${page.slug}`;
  const title = page.seo?.metaTitle ? `${page.seo.metaTitle} | Granalva` : `${page.title} | Granalva`;
  const description = page.seo?.metaDescription ?? undefined;
  const canonical = page.seo?.canonical || absoluteUrl(path);
  const og = media(page.seo?.ogImage);
  const noindex = Boolean(page.seo?.noindex && page.seo?.noindexConfirm);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    // Sin noindex propio manda el global (preproducción: noindex, nofollow).
    robots: noindex ? { index: false, follow: INDEXABLE } : undefined,
    openGraph: {
      type: "website",
      locale: "es_ES",
      siteName: BUSINESS.name,
      url: canonical,
      title: page.seo?.ogTitle || title,
      description: page.seo?.ogDescription || description,
      images: og?.url ? [{ url: og.url, alt: og.alt }] : [{ url: "/og-granalva-limpieza-lavanderia-granada.jpg", width: 1200, height: 630, alt: "Limpieza y lavandería profesional de Granalva en Granada" }],
    },
  };
}

/** Página construida en el panel: portada (con el único H1) o cabecera simple, secciones y pie. */
export async function CmsPage({ page }: { page: Page }) {
  const path = `/${page.slug}`;
  const url = absoluteUrl(path);
  const crumbs: Crumb[] = [{ name: "Inicio", path: "/" }, { name: page.title, path }];
  const blocks = page.layout ?? [];
  const hero = blocks[0]?.blockType === "hero" && !blocks[0].hidden ? blocks[0] : null;
  const faqs = faqsForSchema(blocks);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": page.seo?.schemaType || "WebPage", "@id": `${url}#webpage`, url, name: page.seo?.metaTitle || page.title, description: page.seo?.metaDescription ?? undefined, inLanguage: "es-ES", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORGANIZATION_ID }, breadcrumb: { "@id": `${url}#breadcrumb` } },
      { ...breadcrumbJsonLd(crumbs), "@id": `${url}#breadcrumb` },
      ...(faqs.length ? [{ ...faqJsonLd(faqs), "@id": `${url}#faq` }] : []),
    ],
  };
  const image = hero ? media(hero.image) : null;
  const imageMobile = hero ? media(hero.imageMobile) : null;

  return (
    <main className="site-shell cms-site">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      <SiteHeader />
      {hero && image?.url ? (
        <ServiceHero
          crumbs={crumbs}
          eyebrow={hero.eyebrow || BUSINESS.name.toUpperCase()}
          title={page.title}
          tagline={hero.tagline ?? undefined}
          image={image.url}
          imageAlt={image.alt}
          imageSize={image.width && image.height ? { width: image.width, height: image.height } : undefined}
          focal={focal(image)}
          mobile={imageMobile?.url && imageMobile.width && imageMobile.height ? { src: imageMobile.url, width: imageMobile.width, height: imageMobile.height, focal: focal(imageMobile) } : undefined}
          overlay={hero.overlay ?? undefined}
          cta={hero.primaryHref && hero.primaryLabel ? { href: hero.primaryHref, label: hero.primaryLabel } : undefined}
        />
      ) : (
        <section className="cms-head">
          <Breadcrumbs crumbs={crumbs} tone="dark" />
          <h1 className="wide-title">{page.title}</h1>
          {hero?.lead ? <p className="cms-head__lead">{hero.lead}</p> : null}
        </section>
      )}
      {hero && image?.url && hero.lead ? <section className="cms-block cms-intro"><p className="service-lead">{hero.lead}</p></section> : null}
      <PageBlocks blocks={blocks} />
      <SiteFooter />
    </main>
  );
}
