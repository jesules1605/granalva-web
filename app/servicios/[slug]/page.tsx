import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePageView } from "../../components/service-page";
import { serviceBySlug, servicePages, SITE_URL } from "../../lib/services";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return servicePages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug[slug];
  if (!service) return {};
  const url = `${SITE_URL}/servicios/${service.slug}`;

  return {
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url,
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

  const url = `${SITE_URL}/servicios/${service.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        description: service.metaDescription,
        url,
        provider: { "@id": `${SITE_URL}/#organization` },
        areaServed: [{ "@type": "City", name: "Granada" }, { "@type": "AdministrativeArea", name: "Área metropolitana de Granada" }],
        audience: service.audiences.map((name) => ({ "@type": "Audience", name })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE_URL}/servicios` },
          { "@type": "ListItem", position: 3, name: service.navLabel, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <ServicePageView service={service} />
    </>
  );
}
