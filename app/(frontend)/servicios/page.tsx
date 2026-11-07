import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "../../components/breadcrumbs";
import { LogoSeal } from "../../components/logo-seal";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import { breadcrumbJsonLd, jsonLdString, WEBSITE_ID, type Crumb } from "../../lib/seo";
import { servicePages } from "../../lib/services";
import { absoluteUrl } from "../../lib/site";

const TITLE = "Servicios de limpieza y lavandería en Granada | Granalva";
const DESCRIPTION =
  "Servicios de limpieza y lavandería en Granada: empresas, oficinas, apartamentos turísticos, hoteles, fin de obra, renting textil y lavandería a domicilio.";
const URL = absoluteUrl("/servicios");

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Limpiezas Granalva",
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    images: [{ url: "/limpieza-profesional-alojamiento-granada.png", alt: "Servicios de limpieza y lavandería de Granalva en Granada" }],
  },
};

const crumbs: Crumb[] = [
  { name: "Inicio", path: "/" },
  { name: "Servicios", path: "/servicios" },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${URL}#webpage`,
      url: URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "es-ES",
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${URL}#breadcrumb` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: servicePages.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.h1,
          url: absoluteUrl(`/servicios/${service.slug}`),
        })),
      },
    },
    { ...breadcrumbJsonLd(crumbs), "@id": `${URL}#breadcrumb` },
  ],
};

export default function ServicesPage() {
  return (
    <main className="site-shell services-hub">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      <SiteHeader />
      <section className="services-hub__hero">
        <div>
          <Breadcrumbs crumbs={crumbs} />
          <p className="eyebrow"><LogoSeal small />SERVICIOS DE GRANALVA</p>
          <h1>Servicios de limpieza y lavandería en Granada.<br /><em>Cada servicio, bien definido.</em></h1>
          <p>Limpieza profesional para empresas, oficinas, locales y apartamentos turísticos; lavandería con recogida y entrega para hoteles, alojamientos y particulares; y renting textil. Entra en cada servicio para conocer el proceso, qué incluye y cómo lo adaptamos.</p>
        </div>
        <LogoSeal className="services-hub__seal" />
      </section>

      <section className="services-hub__grid" aria-label="Servicios de Granalva">
        {servicePages.map((service, index) => (
          <article key={service.slug}>
            <Link className="services-hub__image" href={`/servicios/${service.slug}`} tabIndex={-1} aria-hidden="true">
              <Image src={service.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" quality={65} />
            </Link>
            <div>
              <span>{String(index + 1).padStart(2, "0")} · {service.eyebrow}</span>
              <h2><Link href={`/servicios/${service.slug}`}>{service.navLabel}</Link></h2>
              <p>{service.summary}</p>
              <Link className="text-link" href={`/servicios/${service.slug}`}>{service.h1} <span>→</span></Link>
            </div>
          </article>
        ))}
      </section>

      <section className="service-final-cta">
        <LogoSeal />
        <div><span>UNA SOLA COORDINACIÓN</span><h2>¿Necesitas combinar varios servicios?</h2><p>Podemos estudiar limpieza, lavandería, transporte y renting textil como una misma operativa.</p></div>
        <Link className="button button--yellow" href="/contacto#formulario">Solicitar presupuesto empresarial <span>→</span></Link>
      </section>
      <SiteFooter />
    </main>
  );
}
