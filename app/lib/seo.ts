// Generadores de datos estructurados (JSON-LD) a partir del contenido visible.
// Regla: solo se marca información verdadera y visible en la página.
// No se publican valoraciones agregadas ni reseñas de la propia empresa.
import { SITE_URL, type ServicePage } from "./services";
import { BUSINESS, absoluteUrl } from "./site";

export type Crumb = { name: string; path: string };

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationJsonLd(services: Pick<ServicePage, "slug" | "navLabel">[], extras: { sameAs?: string[]; telephone?: string; email?: string } = {}) {
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORGANIZATION_ID,
    name: BUSINESS.name,
    alternateName: BUSINESS.shortName,
    url: SITE_URL,
    logo: absoluteUrl(BUSINESS.logo),
    image: absoluteUrl(BUSINESS.logo),
    email: extras.email ?? BUSINESS.email,
    telephone: extras.telephone ?? BUSINESS.phoneE164,
    description: BUSINESS.description,
    areaServed: BUSINESS.areaServed,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS.phoneE164,
      email: BUSINESS.email,
      contactType: "customer service",
      areaServed: "ES-GR",
      availableLanguage: "Spanish",
    },
    ...((extras.sameAs ?? BUSINESS.sameAs).length ? { sameAs: extras.sameAs ?? BUSINESS.sameAs } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios de limpieza y lavandería en Granada",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.navLabel, url: absoluteUrl(`/servicios/${service.slug}`) },
      })),
    },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: BUSINESS.name,
    alternateName: BUSINESS.shortName,
    inLanguage: "es-ES",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function servicePageJsonLd(service: ServicePage, crumbs: Crumb[]) {
  const url = absoluteUrl(`/servicios/${service.slug}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: service.metaTitle,
        description: service.metaDescription,
        inLanguage: "es-ES",
        isPartOf: { "@id": WEBSITE_ID },
        about: { "@id": `${url}#service` },
        primaryImageOfPage: absoluteUrl(service.image),
        dateModified: service.updatedAt,
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.h1,
        serviceType: service.navLabel,
        description: service.metaDescription,
        url,
        image: absoluteUrl(service.image),
        provider: { "@id": ORGANIZATION_ID },
        areaServed: service.areaServed ?? BUSINESS.areaServed,
        audience: service.audiences.map((name) => ({ "@type": "Audience", audienceType: name })),
      },
      { ...breadcrumbJsonLd(crumbs), "@id": `${url}#breadcrumb` },
      faqJsonLd(service.faqs),
    ],
  };
}

/** Serializa JSON-LD de forma segura para incrustarlo en <script>. */
export const jsonLdString = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
