import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { preload } from "react-dom";
import { ContactForm } from "../components/contact-form";
import { HeroVideo } from "../components/home/hero-video";
import { Reviews } from "../components/home/reviews";
import { RouteProcess } from "../components/home/route-process";
import { ServiceSelector } from "../components/home/service-selector";
import { LogoSeal } from "../components/logo-seal";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { sectors, serviceCategories, sierraNevadaBlock } from "../lib/home-content";
import { jsonLdString, ORGANIZATION_ID, WEBSITE_ID } from "../lib/seo";
import { SITE_URL } from "../lib/services";
import { BUSINESS, WHATSAPP_URL } from "../lib/site";

// Portada compacta orientada a conversión B2B (≈75 % empresas / 25 % particulares).
// Resume y distribuye hacia las páginas indexables; el contenido SEO completo de
// cada servicio vive en su propia URL. Componente de servidor: el H1, los textos
// y todos los enlaces llegan en el HTML inicial.
const TITLE = "Empresa de limpieza y lavandería en Granada | Granalva";
const DESCRIPTION =
  "Empresa de limpieza y lavandería profesional en Granada: empresas, oficinas y apartamentos turísticos, lavandería con recogida y entrega y renting textil.";
const OG_IMAGE = "/og-granalva-limpieza-lavanderia-granada.jpg";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: BUSINESS.name,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Limpieza y lavandería profesional de Granalva en Granada" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "es-ES",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
    },
  ],
};

export default function Home() {
  // Imagen de fondo del hero (elemento LCP): se solicita con prioridad alta.
  preload("/textiles-lavanderia-profesional-granada-poster.webp", { as: "image", fetchPriority: "high" });

  return (
    <main className="site-shell home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      {/* 1. Cabecera fija y cinta superior */}
      <SiteHeader />

      {/* 2. Hero: H1 SEO, propuesta de valor y CTA por prioridad comercial */}
      <section className="hero hero--business" id="inicio">
        <HeroVideo>
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow"><LogoSeal small /> Empresa granadina · Equipo propio</p>
            <h1>Empresa de limpieza y lavandería{" "}<br /><em>profesional en Granada</em></h1>
            <p className="hero-lead">Servicios de limpieza para empresas, hoteles y apartamentos turísticos, lavandería profesional con recogida y entrega, renting textil y soluciones para particulares en Granada.</p>
            <div className="hero-actions">
              <a className="button button--yellow" href="#contacto">Solicitar presupuesto empresarial <span>→</span></a>
              <Link className="button button--glass" href="/servicios/lavanderia-profesional-granada">Contratar lavandería profesional <span>→</span></Link>
            </div>
            <ul className="hero-quicklinks" aria-label="Accesos directos">
              <li><Link href="/servicios/empresa-limpieza-granada">Limpieza para empresas</Link></li>
              <li><a href="#sierra-nevada">Temporada en Sierra Nevada</a></li>
              <li><Link href="/servicios/lavanderia-domicilio-granada#colada">Hacer un pedido particular</Link></li>
            </ul>
          </div>
          <div className="hero-stamp" aria-label="Granalva, servicio local en Granada">
            <Image src="/granalva-logo.jpg" alt="Granalva" width={800} height={800} sizes="240px" />
          </div>
        </HeroVideo>
      </section>

      {/* 3. Prueba de autoridad (solo afirmaciones verificables; cifras cuando se confirmen) */}
      <section className="authority-strip" aria-label="Razones para confiar en Granalva">
        <article><strong>Años de experiencia</strong><span>Especialización real en limpieza turística y profesional.</span></article>
        <article><strong>Equipo propio</strong><span>Coordinación directa, seguimiento y personas con nombre. <Link href="/sobre-nosotros">Conoce al equipo</Link></span></article>
        <article><strong>Servicio integral</strong><span>Limpieza, lavandería, recogida, entrega y renting textil.</span></article>
        <article><strong>Granada y Sierra Nevada</strong><span>Capital, área metropolitana y rutas de lavandería a la estación.</span></article>
      </section>

      {/* 4. Selector empresas / particulares (75 / 25) */}
      <section className="audience-section" id="empresas">
        <div className="audience-heading">
          <span className="section-number">01 / DOS NECESIDADES, UN MISMO EQUIPO</span>
          <h2>Tu empresa no puede parar.{" "}<br /><em>Tu hogar tampoco debería esperar.</em></h2>
        </div>
        <div className="audience-grid audience-grid--weighted">
          <article className="audience-card audience-card--primary">
            <span>PARA EMPRESAS Y ALOJAMIENTOS</span>
            <h3>Un servicio que encaja en tu operativa.</h3>
            <p>Planificamos frecuencias, horarios, recogidas y entregas para que la limpieza y los textiles dejen de ser una preocupación diaria.</p>
            <ul>
              <li><Link href="/servicios/lavanderia-hoteles-granada">Lavandería para hoteles</Link> y <Link href="/servicios/lavanderia-apartamentos-turisticos-granada">apartamentos turísticos</Link></li>
              <li><Link href="/servicios/limpieza-apartamentos-turisticos-granada">Limpieza de apartamentos turísticos</Link></li>
              <li><Link href="/servicios/limpieza-oficinas-locales-granada">Limpieza de oficinas, locales y centros</Link></li>
              <li><Link href="/servicios/renting-textil-granada">Renting textil</Link> y atención directa</li>
            </ul>
            <a className="button button--yellow" href="#contacto">Solicitar presupuesto empresarial <span>→</span></a>
          </article>
          <article className="audience-card audience-card--secondary">
            <span>PARA PARTICULARES</span>
            <h3>Tu colada vuelve limpia, seca y doblada.</h3>
            <p>Recogemos la ropa en tu puerta y te la devolvemos preparada para guardar.</p>
            <Link className="button button--outline-dark" href="/servicios/lavanderia-domicilio-granada#colada">Hacer un pedido particular <span>→</span></Link>
          </article>
        </div>
      </section>

      {/* 5. Selector dinámico de servicios */}
      <section className="services" id="servicios">
        <div className="section-heading">
          <div><span className="section-number">02 / SERVICIOS PROFESIONALES</span><h2>Una respuesta.<br /><em>Todo coordinado.</em></h2></div>
          <p>Granalva reúne limpieza profesional, lavandería con recogida y entrega y renting textil para evitar proveedores dispersos, retrasos y tareas sin supervisión. <Link className="inline-link" href="/servicios">Ver todos los servicios</Link></p>
        </div>
        <ServiceSelector categories={serviceCategories} />
      </section>

      {/* 6. Proceso resumido */}
      <section className="process process--route" id="como-funciona">
        <div className="process-intro">
          <span className="section-number">03 / ASÍ FUNCIONA</span>
          <h2>Nosotros hacemos el recorrido.<br /><em>Tú sigues con lo importante.</em></h2>
          <p>Una operativa clara para empresas y particulares: solicitud, coordinación, cuidado y entrega.</p>
        </div>
        <RouteProcess />
      </section>

      {/* 7. Campaña estacional de Sierra Nevada */}
      <section className="sierra-block" id="sierra-nevada" aria-labelledby="sierra-title">
        <div className="sierra-block__head">
          <span className="sierra-block__label">{sierraNevadaBlock.label}</span>
          <h2 id="sierra-title">{sierraNevadaBlock.title}</h2>
          <p>{sierraNevadaBlock.text}</p>
          <div className="sierra-block__actions">
            <Link className="button button--yellow" href={sierraNevadaBlock.primary.href}>{sierraNevadaBlock.primary.label} <span>→</span></Link>
            <Link className="text-link text-link--light" href={sierraNevadaBlock.secondary.href}>{sierraNevadaBlock.secondary.label} <span>→</span></Link>
          </div>
        </div>
        <ul className="sierra-block__points">
          {sierraNevadaBlock.points.map((point, index) => (
            <li key={point.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{point.title}</strong>
              <small>{point.text}</small>
            </li>
          ))}
        </ul>
      </section>

      {/* 8. Sectores atendidos */}
      <section className="sector-authority" id="clientes">
        <div className="sector-authority__heading">
          <span className="section-number">EXPERIENCIA MULTISECTORIAL</span>
          <h2>Preparados para espacios<br /><em>que tienen que estar siempre listos.</em></h2>
          <p>Trabajamos con negocios que dependen de una operación impecable, puntual y discreta, incluso en los días de mayor actividad.</p>
        </div>
        <div className="sector-marquee" aria-label="Sectores atendidos por Granalva">
          {[0, 1].map((copy) => (
            <div className="sector-track" key={copy} aria-hidden={copy === 1}>
              {sectors.map((sector, index) => (
                <div className="sector-logo" key={`${copy}-${sector}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{sector}</strong>
                  <LogoSeal small />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Reseñas (logotipos de clientes y casos de éxito, cuando haya autorización) */}
      <Reviews />

      {/* 10. CTA final y formulario empresarial */}
      <section className="contact-section" id="contacto">
        <div className="contact-copy">
          <span className="section-number section-number--light">04 / HABLEMOS</span>
          <h2>Cuéntanos qué necesitas.<br /><em>Diseñamos la operativa.</em></h2>
          <p>Indícanos el tipo de negocio y el servicio. Si quieres, añade volumen, frecuencia y fecha de inicio: con esos datos preparamos una propuesta ajustada a tu operativa.</p>
          <div className="contact-direct">
            <a href={`tel:${BUSINESS.phoneE164}`}><small>Teléfono</small><strong>{BUSINESS.phoneDisplay}</strong></a>
            <a href={`mailto:${BUSINESS.email}`}><small>Correo</small><strong>{BUSINESS.email}</strong></a>
            {WHATSAPP_URL ? <a href={WHATSAPP_URL} target="_blank" rel="noopener"><small>WhatsApp</small><strong>Escríbenos</strong></a> : null}
            <div><small>Zona de servicio</small><strong>{BUSINESS.areaServedLabel}</strong></div>
          </div>
        </div>
        <ContactForm variant="general" />
      </section>

      <SiteFooter />
    </main>
  );
}
