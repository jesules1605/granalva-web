import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import { draftMode } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "../components/contact-form";
import { ClientLogos } from "../components/home/client-logos";
import { HomeHero } from "../components/home/home-hero";
import { Reviews } from "../components/home/reviews";
import { RouteProcess } from "../components/home/route-process";
import { ServiceSelector } from "../components/home/service-selector";
import { LogoSeal } from "../components/logo-seal";
import { SiteFooter, SiteHeader } from "../components/site-chrome";
import { getActiveCampaign, getClientLogos, getHomeConfig, getHomeHero, getReviews, getSiteSettings, getTeam, type HomeSectionKey } from "../lib/cms";
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

const defaultMetadata: Metadata = {
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

/** SEO de la portada: valores revisados, sustituibles desde el panel (Portada → SEO). */
export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getHomeConfig();
  const title = seo.metaTitle ?? TITLE;
  const description = seo.metaDescription ?? DESCRIPTION;
  const image = seo.ogImage ?? OG_IMAGE;
  return {
    ...defaultMetadata,
    title: { absolute: title },
    description,
    ...(seo.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: { ...defaultMetadata.openGraph, title, description, images: [{ url: image, width: 1200, height: 630, alt: "Limpieza y lavandería profesional de Granalva en Granada" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

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
  const { isEnabled: draft } = await draftMode();
  const [hero, config, settings, reviews, teamMembers, logos, campaign] = await Promise.all([getHomeHero(draft), getHomeConfig(draft), getSiteSettings(), getReviews(), getTeam(), getClientLogos(), getActiveCampaign()]);
  // Campaña estacional del panel; sin campaña activa, el bloque revisado de Sierra Nevada.
  const season = campaign ?? { ...sierraNevadaBlock, secondary: sierraNevadaBlock.secondary as { label: string; href: string } | null };

  const headings = Object.fromEntries(config.sections.filter((section) => section.heading).map((section) => [section.key, section.heading]));
  const h = (key: HomeSectionKey, fallback: ReactNode): ReactNode => headings[key] ?? fallback;
  const sections: Record<HomeSectionKey, ReactNode> = {
    propuesta: (
      <>
      {/* 3. Propuesta de valor y 4. recorridos principales */}
            <section className="value-section" id="empresas" aria-labelledby="propuesta-title">
              <span className="section-number">01 / DOS NECESIDADES, UN MISMO EQUIPO</span>
              <h2 id="propuesta-title" className="wide-title">{h("propuesta", <>Tu empresa no puede parar.{" "}<br /><em>Tu hogar tampoco debería esperar.</em></>)}</h2>
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
      </>
    ),
    servicios: (
      <>
      {/* 5. Servicios para empresas */}
            <section className="services" id="servicios" aria-labelledby="servicios-title">
              <span className="section-number">02 / SERVICIOS PARA EMPRESAS</span>
              <h2 id="servicios-title" className="wide-title">{h("servicios", <>Una respuesta.{" "}<em>Todo coordinado.</em></>)}</h2>
              <ServiceSelector categories={businessCategories} />
              <p className="services__more">Limpieza, lavandería con recogida y entrega y renting textil con un solo interlocutor. <Link className="inline-link" href="/servicios">Ver todos los servicios</Link></p>
            </section>
      </>
    ),
    lavanderia: (
      <>
      {/* 6. Lavandería: recorridos por tipo de cliente y campaña de Sierra Nevada */}
            <section className="laundry-section" id="lavanderia" aria-labelledby="lavanderia-title">
              <span className="section-number">03 / LAVANDERÍA CON RECOGIDA Y ENTREGA</span>
              <h2 id="lavanderia-title" className="wide-title">{h("lavanderia", <>Textiles listos{" "}<em>cuando los necesitas.</em></>)}</h2>
              <ul className="laundry-links">
                {laundryLinks.map((link) => (
                  <li key={link.href}><Link href={link.href}><strong>{link.label}</strong><small>{link.text}</small><span aria-hidden="true">→</span></Link></li>
                ))}
              </ul>
            </section>
      </>
    ),
    sierra: (
      <>
      <section className="sierra-block" id="sierra-nevada" aria-labelledby="sierra-title">
              <div className="sierra-block__head">
                <span className="sierra-block__label">{season.label}</span>
                <h2 id="sierra-title">{h("sierra", <>{season.title}</>)}</h2>
                <p>{season.text}</p>
                <div className="sierra-block__actions">
                  <Link className="button button--yellow" href={season.primary.href}>{season.primary.label} <span>→</span></Link>
                  {season.secondary ? <Link className="text-link text-link--light" href={season.secondary.href}>{season.secondary.label} <span>→</span></Link> : null}
                </div>
              </div>
              <ul className="sierra-block__points">
                {season.points.map((point, index) => (
                  <li key={point.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{point.title}</strong>
                    <small>{point.text}</small>
                  </li>
                ))}
              </ul>
            </section>
      </>
    ),
    sectores: (
      <>
      {/* 7. Sectores atendidos (cada tarjeta enlaza a su página) */}
            <section className="sectors" id="clientes" aria-labelledby="sectores-title">
              <span className="section-number section-number--light">EXPERIENCIA MULTISECTORIAL</span>
              <h2 id="sectores-title" className="sectors__title">{h("sectores", <>Preparados para espacios{" "}<br /><em>que tienen que estar siempre listos.</em></>)}</h2>
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
      </>
    ),
    proceso: (
      <>
      {/* 8. Proceso de recogida y entrega */}
            <section className="process process--route" id="como-funciona" aria-labelledby="proceso-title">
              <div className="process-intro">
                <span className="section-number">04 / ASÍ FUNCIONA</span>
                <h2 id="proceso-title" className="wide-title">{h("proceso", <>Nosotros hacemos el recorrido.{" "}<em>Tú sigues con lo importante.</em></>)}</h2>
              </div>
              <RouteProcess />
            </section>
      </>
    ),
    autoridad: (
      <>
      {/* 9. Autoridad y experiencia (solo afirmaciones verificables) */}
            <section className="authority-strip" aria-label="Razones para confiar en Granalva">
              {settings.years ? <article><strong>{settings.years} años de experiencia</strong><span>Limpieza turística y profesional con protocolos por espacio.</span></article> : <article><strong>Especialistas en alojamientos</strong><span>Limpieza turística y profesional con protocolos por espacio.</span></article>}
              <article><strong>Equipo propio</strong><span>Coordinación directa, seguimiento y personas con nombre. <Link href="/sobre-nosotros">Conoce al equipo</Link></span></article>
              <article><strong>Servicio integral</strong><span>Limpieza, lavandería, recogida, entrega y renting textil.</span></article>
              {settings.figures.map((figure) => <article key={figure.label}><strong>{figure.value}</strong><span>{figure.label}</span></article>)}
              <article><strong>Granada y Sierra Nevada</strong><span>Capital, área metropolitana y rutas de lavandería a la estación.</span></article>
            </section>
      </>
    ),
    empresas: (
      <>
      {/* 10. Empresas colaboradoras (solo con logotipos autorizados; vacío = no se muestra) */}
            <ClientLogos logos={logos} />
      </>
    ),
    resenas: (
      <>
      {/* 11. Reseñas reales de Google */}
            <Reviews reviews={reviews.slice(0, 4)} />
      </>
    ),
    equipo: (
      <>
      {/* 12. Equipo (composición provisional hasta tener fotografías reales) */}
            <section className="home-team" aria-labelledby="equipo-title">
              <span className="section-number">05 / EQUIPO GRANALVA</span>
              <h2 id="equipo-title" className="wide-title">{h("equipo", <>Una empresa con procesos.{" "}<em>Un equipo con nombre.</em></>)}</h2>
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
      </>
    ),
    cta: (
      <>
      {/* 13. CTA final */}
            <section className="home-final-cta" aria-labelledby="cta-final-title">
              <h2 id="cta-final-title">{h("cta", <>¿Preparamos una propuesta para tu negocio?</>)}</h2>
              <div>
                <a className="button button--yellow" href="#contacto">Solicitar presupuesto empresarial <span>→</span></a>
                <a className="button button--glass" href={`tel:${settings.phoneE164}`}>Llamar al {settings.phoneDisplay}</a>
              </div>
            </section>
      </>
    ),
    contacto: (
      <>
      {/* 14. Contacto y formulario empresarial */}
            <section className="contact-section" id="contacto">
              <div className="contact-copy">
                <span className="section-number section-number--light">06 / HABLEMOS</span>
                <h2>{h("contacto", <>Cuéntanos qué necesitas.<br /><em>Diseñamos la operativa.</em></>)}</h2>
                <p>Indícanos el tipo de negocio y el servicio. Si quieres, añade volumen, frecuencia y fecha de inicio: con esos datos preparamos una propuesta ajustada a tu operativa.</p>
                <div className="contact-direct">
                  <a href={`tel:${settings.phoneE164}`}><small>Teléfono</small><strong>{settings.phoneDisplay}</strong></a>
                  <a href={`mailto:${settings.email}`}><small>Correo</small><strong>{settings.email}</strong></a>
                  {WHATSAPP_URL ? <a href={WHATSAPP_URL} target="_blank" rel="noopener"><small>WhatsApp</small><strong>Escríbenos</strong></a> : null}
                  <div><small>Zona de servicio</small><strong>{settings.areaServedLabel}</strong></div>
                </div>
              </div>
              <ContactForm variant="general" />
            </section>
      </>
    ),
  };

  return (
    <main className="site-shell home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      {/* 1. Cabecera fija y cinta superior */}
      <SiteHeader />

      {/* 2. Hero: fotografía administrable (LCP), H1 SEO y CTA por prioridad comercial */}
      <HomeHero hero={hero} />

      {/* 3-14. Secciones en el orden y con la visibilidad configurados en el panel (Portada → Secciones). */}
      {config.sections.map(({ key }) => <Fragment key={key}>{sections[key]}</Fragment>)}

      <SiteFooter />
    </main>
  );
}
