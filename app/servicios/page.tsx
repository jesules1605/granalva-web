import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LogoSeal } from "../components/logo-seal";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { servicePages, SITE_URL } from "../lib/services";

export const metadata: Metadata = {
  title: { absolute: "Servicios de limpieza y lavandería en Granada | Granalva" },
  description: "Servicios de limpieza profesional y lavandería en Granada para empresas, hoteles, apartamentos turísticos, oficinas y particulares.",
  alternates: { canonical: `${SITE_URL}/servicios` },
  openGraph: {
    title: "Servicios de limpieza y lavandería en Granada | Granalva",
    description: "Limpieza profesional, lavandería, renting textil, recogida y entrega para empresas, alojamientos y particulares.",
    url: `${SITE_URL}/servicios`,
    images: ["/service-cleaning.png"],
  },
};

export default function ServicesPage() {
  return (
    <main className="site-shell services-hub">
      <SiteHeader />
      <section className="services-hub__hero">
        <div>
          <p className="eyebrow"><LogoSeal small />SERVICIOS DE GRANALVA</p>
          <h1>Limpieza y lavandería en Granada.<br /><em>Cada servicio, bien definido.</em></h1>
          <p>Una arquitectura de servicios para empresas, alojamientos y particulares. Entra en cada página para conocer el proceso, qué incluye y cómo podemos adaptarlo.</p>
        </div>
        <LogoSeal className="services-hub__seal" />
      </section>

      <section className="services-hub__grid" aria-label="Servicios de Granalva">
        {servicePages.map((service, index) => (
          <article key={service.slug}>
            <Link className="services-hub__image" href={`/servicios/${service.slug}`}>
              <Image src={service.image} alt={service.imageAlt} fill sizes="(max-width: 760px) 100vw, 33vw" unoptimized />
            </Link>
            <div>
              <span>{String(index + 1).padStart(2, "0")} · {service.eyebrow}</span>
              <h2><Link href={`/servicios/${service.slug}`}>{service.navLabel}</Link></h2>
              <p>{service.summary}</p>
              <Link className="text-link" href={`/servicios/${service.slug}`}>Ver servicio <span>→</span></Link>
            </div>
          </article>
        ))}
      </section>

      <section className="service-final-cta">
        <LogoSeal />
        <div><span>UNA SOLA COORDINACIÓN</span><h2>¿Necesitas combinar varios servicios?</h2><p>Podemos estudiar limpieza, lavandería, transporte y renting textil como una misma operativa.</p></div>
        <Link className="button button--yellow" href="/#contacto">Hablar con Granalva <span>→</span></Link>
      </section>
      <SiteFooter />
    </main>
  );
}
