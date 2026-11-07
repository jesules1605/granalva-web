import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompactServicePage } from "../../../components/compact-service-page";
import { ServicePageView } from "../../../components/service-page";
import { jsonLdString, servicePageJsonLd, type Crumb } from "../../../lib/seo";
import { serviceBySlug, servicePages } from "../../../lib/services";
import { absoluteUrl } from "../../../lib/site";

type PageProps = { params: Promise<{ slug: string }> };

/** Solo existen los slugs definidos: cualquier otro devuelve 404 real. */
export const dynamicParams = false;

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

const crumbsFor = (slug: string): Crumb[] => [
  { name: "Inicio", path: "/" },
  { name: "Servicios", path: "/servicios" },
  { name: serviceBySlug[slug].navLabel, path: `/servicios/${slug}` },
];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) return {};
  const url = absoluteUrl(`/servicios/${service.slug}`);

  return {
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url,
      siteName: "Limpiezas Granalva",
      title: service.metaTitle,
      description: service.metaDescription,
      images: [{ url: service.image, alt: service.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: service.metaTitle, description: service.metaDescription, images: [service.image] },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) notFound();
  const crumbs = crumbsFor(slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(servicePageJsonLd(service, crumbs)) }} />
      {service.layout === "compact" ? <CompactServicePage service={service} crumbs={crumbs} /> : <ServicePageView service={service} crumbs={crumbs} />}
    </>
  );
}
