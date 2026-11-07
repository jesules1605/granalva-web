import type { Metadata } from "next";
import { preload } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "./components/home/contact-form";
import { HeroVideo } from "./components/home/hero-video";
import { LoadPicker } from "./components/home/load-picker";
import { Reviews } from "./components/home/reviews";
import { RouteProcess } from "./components/home/route-process";
import { ServiceTabs } from "./components/home/service-tabs";
import { LogoSeal } from "./components/logo-seal";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import { faqs, sectors, team } from "./lib/home-content";
import { faqJsonLd, jsonLdString, ORGANIZATION_ID, WEBSITE_ID } from "./lib/seo";
import { IMAGES, servicePages, SITE_URL } from "./lib/services";
import { BUSINESS, ORDER_URL } from "./lib/site";

// Portada: componente de servidor. El H1, la introducción y los enlaces llegan en
// el HTML inicial; solo las zonas interactivas son componentes de cliente.
const TITLE = "Empresa de limpieza y lavandería en Granada | Granalva";
const DESCRIPTION =
  "Empresa de limpieza y lavandería profesional en Granada: empresas, oficinas y apartamentos turísticos, lavandería con recogida y entrega y renting textil.";

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
    images: [{ url: "/og-granalva-limpieza-lavanderia-granada.jpg", width: 1200, height: 630, alt: "Limpieza y lavandería profesional de Granalva en Granada" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-granalva-limpieza-lavanderia-granada.jpg"] },
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
    faqJsonLd(faqs),
  ],
};

export default function Home() {
  // Imagen de fondo del hero (elemento LCP): se solicita con prioridad alta.
  preload("/textiles-lavanderia-profesional-granada-poster.webp", { as: "image", fetchPriority: "high" });

  return (
    <main className="site-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      <SiteHeader />

      <section className="hero hero--business" id="inicio">
        <HeroVideo>
          <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><LogoSeal small /> Empresa granadina · Equipo propio</p>
          <h1>Empresa de limpieza y lavandería{" "}<br /><em>profesional en Granada</em></h1>
          <p className="hero-lead">Servicios de limpieza para empresas, hoteles y apartamentos turísticos, lavandería profesional con recogida y entrega, renting textil y soluciones para particulares en Granada.</p>
          <div className="hero-actions">
            <a className="button button--yellow" href="#contacto">Solicitar presupuesto <span>→</span></a>
            <a className="button button--glass" href={ORDER_URL}>Hacer un pedido <span>→</span></a>
          </div>
        </div>

        <div className="hero-stamp" aria-label="Granalva, servicio local en Granada">
          <Image src="/granalva-logo.jpg" alt="Granalva" width={800} height={800} sizes="240px" />
        </div>
        </HeroVideo>
      </section>

      <section className="authority-strip" aria-label="Razones para confiar en Granalva">
        <article><strong>Años de experiencia</strong><span>Especialización real en limpieza turística y profesional.</span></article>
        <article><strong>Equipo propio</strong><span>Coordinación directa, seguimiento y personas con nombre.</span></article>
        <article><strong>Servicio integral</strong><span>Limpieza, lavandería, recogida, entrega y renting textil.</span></article>
        <article><strong>Granada</strong><span>Capital, área metropolitana y rutas profesionales acordadas.</span></article>
      </section>

      <section className="audience-section" id="empresas">
        <div className="audience-heading">
          <span className="section-number">01 / DOS NECESIDADES, UN MISMO EQUIPO</span>
          <h2>Tu empresa no puede parar.{" "}<br /><em>Tu hogar tampoco debería esperar.</em></h2>
        </div>
        <div className="audience-grid">
          <article className="audience-card audience-card--primary">
            <span>PARA EMPRESAS Y ALOJAMIENTOS</span>
            <h3>Un servicio que encaja en tu operativa.</h3>
            <p>Planificamos frecuencias, horarios, recogidas y entregas para que la limpieza y los textiles dejen de ser una preocupación diaria.</p>
            <ul>
              <li><Link href="/servicios/limpieza-apartamentos-turisticos-granada">Limpieza de apartamentos turísticos</Link></li>
              <li><Link href="/servicios/limpieza-oficinas-locales-granada">Limpieza de oficinas, locales y centros</Link></li>
              <li><Link href="/servicios/lavanderia-profesional-granada">Lavandería profesional</Link> y <Link href="/servicios/renting-textil-granada">renting textil</Link></li>
              <li>Atención directa y propuesta a medida</li>
            </ul>
            <a className="button button--yellow" href="#contacto">Pedir propuesta <span>→</span></a>
          </article>
          <article className="audience-card audience-card--secondary">
            <span>PARA PARTICULARES</span>
            <h3>Tu colada vuelve limpia, seca y doblada.</h3>
            <p>Recogemos la ropa en tu puerta, aplicamos el cuidado adecuado y te la devolvemos preparada para guardar.</p>
            <ul>
              <li><Link href="/servicios/lavanderia-domicilio-granada">Lavandería a domicilio con recogida y entrega</Link></li>
              <li>Tres tamaños de colada</li>
              <li>Ropa diaria y textiles del hogar</li>
              <li>Proceso sencillo y comunicación clara</li>
            </ul>
            <a className="button button--outline-dark" href="#lavanderia">Elegir mi colada <span>↓</span></a>
          </article>
        </div>
      </section>

      <section className="services" id="servicios">
        <div className="section-heading">
          <div><span className="section-number">02 / SERVICIOS PROFESIONALES</span><h2>Una respuesta.<br /><em>Todo coordinado.</em></h2></div>
          <p>Granalva reúne limpieza profesional y lavandería en Granada para evitar proveedores dispersos, retrasos y tareas sin supervisión.</p>
        </div>
        <ServiceTabs />
        <nav className="services-index" aria-label="Todos los servicios de Granalva en Granada">
          <span>Todos los servicios</span>
          <ul>
            {servicePages.map((service) => (
              <li key={service.slug}><Link href={`/servicios/${service.slug}`}>{service.h1}</Link></li>
            ))}
          </ul>
        </nav>
      </section>

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

      <LoadPicker />

      <section className="brand-story">
        <div className="brand-story__logo" aria-label="Logotipo de Granalva">
          <Image src="/granalva-logo.jpg" alt="Granalva" width={800} height={800} sizes="(max-width: 760px) 60vw, 320px" />
          <span>IDENTIDAD GRANADINA<br /><b>SERVICIO PROFESIONAL</b></span>
        </div>
        <div className="story-copy">
          <span className="section-number section-number--light">UNA EMPRESA DE GRANADA</span>
          <h2>Procesos profesionales.<br /><em>Trato directo.</em></h2>
          <p>La autoridad no consiste en parecer grande: consiste en responder, coordinar bien y mantener el nivel en cada servicio. Esa es la forma de trabajar de Granalva.</p>
        </div>
        <div className="story-postcard"><span>DESDE<br /><b>GRANADA</b></span><small>limpieza y lavandería</small></div>
      </section>

      <section className="process process--route" id="como-funciona">
        <div className="process-intro">
          <span className="section-number">04 / ASÍ FUNCIONA</span>
          <h2>Nosotros hacemos el recorrido.<br /><em>Tú sigues con lo importante.</em></h2>
          <p>Una operativa clara para empresas y particulares: solicitud, coordinación, cuidado y entrega.</p>
        </div>

        <RouteProcess />
      </section>

      <section className="team" id="experiencia">
        <div className="team-visual">
          <div className="team-gallery team-gallery--main">
            <Image src={IMAGES.cleaning} alt="Preparación de un dormitorio durante la limpieza de un alojamiento" fill sizes="(max-width: 1000px) 100vw, 54vw" quality={70} />
            <span>EN LOS ALOJAMIENTOS</span>
          </div>
          <div className="team-gallery team-gallery--detail">
            <Image src={IMAGES.laundry} alt="Textiles limpios, doblados y preparados para su entrega" fill sizes="(max-width: 760px) 46vw, 22vw" quality={70} />
            <span>EN LA LAVANDERÍA</span>
          </div>
          <div className="team-logo-card" aria-label="Granalva, equipo de Granada">
            <Image src="/granalva-logo.jpg" alt="" width={800} height={800} sizes="160px" />
            <span>EQUIPO PROPIO<br /><b>COORDINACIÓN DIRECTA</b></span>
          </div>
          <div className="team-note"><LogoSeal small /><p>Nos verás llegar,<br /><b>nos tendrás al otro lado.</b></p></div>
        </div>
        <div className="team-copy">
          <span className="section-number">05 / EXPERIENCIA Y EQUIPO</span>
          <h2>Una empresa con procesos.<br /><em>Un equipo con nombre.</em></h2>
          <p>Granalva es una empresa granadina con experiencia específica en limpieza de apartamentos turísticos, espacios profesionales y lavandería. Cada servicio se coordina, ejecuta y revisa por un equipo que trabaja junto.</p>
          <div className="team-list">
            {team.map((member) => (
              <article className="team-member" key={member.name}>
                <span className="team-member__mark" aria-hidden="true"><LogoSeal small /></span>
                <div><small>{member.role}</small><h3>{member.name}</h3><p>{member.text}</p></div>
              </article>
            ))}
          </div>
          <a className="text-link" href="#contacto">Hablar con nuestro equipo <span>→</span></a>
        </div>
      </section>

      <Reviews />

      <section className="faq-section" id="preguntas">
        <div className="faq-heading">
          <span className="section-number">07 / PREGUNTAS FRECUENTES</span>
          <h2>Lo que necesitas saber<br /><em>antes de empezar.</em></h2>
          <p>Respuestas claras sobre nuestros servicios de limpieza y lavandería profesional en Granada.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<b>+</b></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contacto">
        <div className="contact-copy">
          <span className="section-number section-number--light">08 / HABLEMOS</span>
          <h2>Cuéntanos qué necesitas.<br /><em>Diseñamos la operativa.</em></h2>
          <p>Explícanos tu espacio, el volumen de lavandería o la frecuencia que necesitas. Te responderemos con una propuesta adaptada.</p>
          <div className="contact-direct">
            <a href={`tel:${BUSINESS.phoneE164}`}><small>Teléfono</small><strong>{BUSINESS.phoneDisplay}</strong></a>
            <a href={`mailto:${BUSINESS.email}`}><small>Correo</small><strong>{BUSINESS.email}</strong></a>
            <div><small>Zona de servicio</small><strong>{BUSINESS.areaServedLabel}</strong></div>
          </div>
        </div>

        <ContactForm />
      </section>

      <SiteFooter />
    </main>
  );
}
