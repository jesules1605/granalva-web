import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "../components/contact-form";
import { ClientLogos } from "../components/home/client-logos";
import { HeroVideo } from "../components/home/hero-video";
import { Reviews } from "../components/home/reviews";
import { RouteProcess } from "../components/home/route-process";
import { ServiceSelector } from "../components/home/service-selector";
import { LogoSeal } from "../components/logo-seal";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { getClientLogos, getReviews, getTeam } from "../lib/cms";
import { journeys, sectors, serviceCategories, sierraNevadaBlock } from "../lib/home-content";
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

// Servicios para empresas: limpieza primero; la lavandería tiene además su propio bloque.
const businessOrder = ["limpieza", "lavanderia", "renting"];
const businessCategories = serviceCategories
  .filter((category) => category.audience === "empresas")
  .sort((a, b) => businessOrder.indexOf(a.id) - businessOrder.indexOf(b.id));

const laundryLinks = [
  { label: "Lavandería para hoteles", text: "Ropa de cama y baño por habitaciones", href: "/servicios/lavanderia-hoteles-granada" },
  { label: "Lavandería para apartamentos turísticos", text: "Juegos preparados para cada entrada", href: "/servicios/lavanderia-apartamentos-turisticos-granada" },
  { label: "Lavandería en Sierra Nevada", text: "Rutas de temporada a la estación", href: "/servicios/lavanderia-sierra-nevada" },
  { label: "Lavandería a domicilio", text: "Para particulares: recogemos en tu puerta", href: "/servicios/lavanderia-domicilio-granada" },
];

export default async function Home() {
  const [reviews, teamMembers, logos] = await Promise.all([getReviews(), getTeam(), getClientLogos()]);

  return (
    <main className="site-shell home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      {/* 1. Cabecera fija y cinta superior */}
      <SiteHeader />

      {/* 2. Hero: H1 SEO, propuesta de valor y CTA por prioridad comercial */}
      <section className="hero hero--business" id="inicio">
        <HeroVideo>
          {/* Póster como imagen real del HTML (elemento LCP, descubierta al analizar el HTML). No se usa
              preload(); los enlaces a «/» no se precargan (site-chrome, breadcrumbs) para no descargarlo en otras páginas. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-poster" src="/video/granalva-hero-poster-1280.webp" alt="" width={1280} height={800} fetchPriority="high" decoding="async" aria-hidden="true" />
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

      {/* 3. Propuesta de valor y 4. recorridos principales */}
      <section className="value-section" id="empresas" aria-labelledby="propuesta-title">
        <span className="section-number">01 / DOS NECESIDADES, UN MISMO EQUIPO</span>
        <h2 id="propuesta-title" className="wide-title">Tu empresa no puede parar.{" "}<br /><em>Tu hogar tampoco debería esperar.</em></h2>
        <ul className="journeys" aria-label="Recorridos principales">
          {journeys.map((journey, index) => (
            <li key={journey.label} className={index === 0 ? "journey journey--primary" : "journey"}>
              <Link href={journey.href}>
                <strong>{journey.label}</strong>
                <small>{journey.text}</small>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. Servicios para empresas */}
      <section className="services" id="servicios" aria-labelledby="servicios-title">
        <span className="section-number">02 / SERVICIOS PARA EMPRESAS</span>
        <h2 id="servicios-title" className="wide-title">Una respuesta.{" "}<em>Todo coordinado.</em></h2>
        <ServiceSelector categories={businessCategories} />
        <p className="services__more">Limpieza, lavandería con recogida y entrega y renting textil con un solo interlocutor. <Link className="inline-link" href="/servicios">Ver todos los servicios</Link></p>
      </section>

      {/* 6. Lavandería: recorridos por tipo de cliente y campaña de Sierra Nevada */}
      <section className="laundry-section" id="lavanderia" aria-labelledby="lavanderia-title">
        <span className="section-number">03 / LAVANDERÍA CON RECOGIDA Y ENTREGA</span>
        <h2 id="lavanderia-title" className="wide-title">Textiles listos{" "}<em>cuando los necesitas.</em></h2>
        <ul className="laundry-links">
          {laundryLinks.map((link) => (
            <li key={link.href}><Link href={link.href}><strong>{link.label}</strong><small>{link.text}</small><span aria-hidden="true">→</span></Link></li>
          ))}
        </ul>
      </section>
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

      {/* 7. Sectores atendidos (cada tarjeta enlaza a su página) */}
      <section className="sectors" id="clientes" aria-labelledby="sectores-title">
        <span className="section-number section-number--light">EXPERIENCIA MULTISECTORIAL</span>
        <h2 id="sectores-title" className="sectors__title">Preparados para espacios{" "}<br /><em>que tienen que estar siempre listos.</em></h2>
        <ul className="sectors__grid" aria-label="Sectores atendidos por Granalva">
          {sectors.map((sector, index) => (
            <li className="sector-card" key={sector.label}>
              <span className="sector-card__number">{String(index + 1).padStart(2, "0")}</span>
              <Link className="sector-card__link" href={sector.href}>{sector.label}</Link>
              <LogoSeal small />
            </li>
          ))}
        </ul>
      </section>

      {/* 8. Proceso de recogida y entrega */}
      <section className="process process--route" id="como-funciona" aria-labelledby="proceso-title">
        <div className="process-intro">
          <span className="section-number">04 / ASÍ FUNCIONA</span>
          <h2 id="proceso-title" className="wide-title">Nosotros hacemos el recorrido.{" "}<em>Tú sigues con lo importante.</em></h2>
        </div>
        <RouteProcess />
      </section>

      {/* 9. Autoridad y experiencia (solo afirmaciones verificables) */}
      <section className="authority-strip" aria-label="Razones para confiar en Granalva">
        <article><strong>Especialistas en alojamientos</strong><span>Limpieza turística y profesional con protocolos por espacio.</span></article>
        <article><strong>Equipo propio</strong><span>Coordinación directa, seguimiento y personas con nombre. <Link href="/sobre-nosotros">Conoce al equipo</Link></span></article>
        <article><strong>Servicio integral</strong><span>Limpieza, lavandería, recogida, entrega y renting textil.</span></article>
        <article><strong>Granada y Sierra Nevada</strong><span>Capital, área metropolitana y rutas de lavandería a la estación.</span></article>
      </section>

      {/* 10. Empresas colaboradoras (solo con logotipos autorizados; vacío = no se muestra) */}
      <ClientLogos logos={logos} />

      {/* 11. Reseñas reales de Google */}
      <Reviews reviews={reviews} />

      {/* 12. Equipo (composición provisional hasta tener fotografías reales) */}
      <section className="home-team" aria-labelledby="equipo-title">
        <span className="section-number">05 / EQUIPO GRANALVA</span>
        <h2 id="equipo-title" className="wide-title">Una empresa con procesos.{" "}<em>Un equipo con nombre.</em></h2>
        <ul className="home-team__list">
          {teamMembers.map((member) => (
            <li key={member.name}>
              {member.photo ? (
                <Image className="home-team__photo" src={member.photo.url} alt={member.photo.alt} width={112} height={112} sizes="56px" style={{ objectPosition: member.photo.focal }} />
              ) : (
                <span className="home-team__mark" aria-hidden="true"><LogoSeal small /></span>
              )}
              <small>{member.role}</small>
              <strong>{member.name}</strong>
            </li>
          ))}
        </ul>
        <Link className="text-link" href="/sobre-nosotros">Conoce cómo trabajamos <span>→</span></Link>
      </section>

      {/* 13. CTA final */}
      <section className="home-final-cta" aria-labelledby="cta-final-title">
        <h2 id="cta-final-title">¿Preparamos una propuesta para tu negocio?</h2>
        <div>
          <a className="button button--yellow" href="#contacto">Solicitar presupuesto empresarial <span>→</span></a>
          <a className="button button--glass" href={`tel:${BUSINESS.phoneE164}`}>Llamar al {BUSINESS.phoneDisplay}</a>
        </div>
      </section>

      {/* 14. Contacto y formulario empresarial */}
      <section className="contact-section" id="contacto">
        <div className="contact-copy">
          <span className="section-number section-number--light">06 / HABLEMOS</span>
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
