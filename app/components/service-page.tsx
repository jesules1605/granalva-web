import Image from "next/image";
import Link from "next/link";
import { LogoSeal } from "./logo-seal";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { serviceBySlug, type ServicePage } from "../lib/services";

export function ServicePageView({ service }: { service: ServicePage }) {
  const related = service.related.map((slug) => serviceBySlug[slug]).filter(Boolean);

  return (
    <main className="site-shell service-site">
      <SiteHeader />

      <section className="service-hero">
        <div className="service-hero__media">
          <Image src={service.image} alt={service.imageAlt} fill priority sizes="100vw" unoptimized />
          <div className="service-hero__scrim" />
        </div>
        <div className="service-hero__copy">
          <p className="eyebrow"><LogoSeal small />{service.eyebrow}</p>
          <h1>{service.title}</h1>
          <p>{service.summary}</p>
          <div className="hero-actions">
            <Link className="button button--yellow" href="/#contacto">Solicitar presupuesto <span>→</span></Link>
            <a className="button button--glass" href="tel:+34744488964">Llamar al 744 488 964</a>
          </div>
        </div>
        <div className="service-hero__seal"><LogoSeal /></div>
      </section>

      <div className="service-proof" aria-label="Ventajas del servicio">
        <span>GRANADA Y ÁREA METROPOLITANA</span>
        <span>COORDINACIÓN DIRECTA</span>
        <span>PROPUESTA A MEDIDA</span>
        <span>EQUIPO GRANALVA</span>
      </div>

      <section className="service-introduction">
        <div>
          <span className="section-number">01 / EL SERVICIO</span>
          <h2>{service.introTitle}</h2>
        </div>
        <div className="service-introduction__copy">
          {service.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <blockquote>{service.promise}</blockquote>
        </div>
      </section>

      <section className="service-includes">
        <div className="service-section-heading">
          <span className="section-number section-number--light">02 / QUÉ INCLUYE</span>
          <h2>Todo lo necesario.<br /><em>Bien coordinado.</em></h2>
        </div>
        <div className="service-includes__grid">
          {service.includes.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-process">
        <div className="service-section-heading service-section-heading--dark">
          <span className="section-number">03 / CÓMO TRABAJAMOS</span>
          <h2>Una operativa clara,<br /><em>de principio a fin.</em></h2>
        </div>
        <ol>
          {service.process.map((item, index) => (
            <li key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{item.title}</h3><p>{item.text}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="service-audiences">
        <div>
          <span className="section-number">04 / PARA QUIÉN</span>
          <h2>Diseñado para necesidades reales de Granada.</h2>
        </div>
        <ul>
          {service.audiences.map((audience) => <li key={audience}><LogoSeal small />{audience}</li>)}
        </ul>
      </section>

      <section className="service-faq">
        <div className="service-section-heading service-section-heading--dark">
          <span className="section-number">05 / PREGUNTAS FRECUENTES</span>
          <h2>Antes de empezar,<br /><em>todo claro.</em></h2>
        </div>
        <div className="faq-list">
          {service.faqs.map((faq, index) => (
            <details key={faq.question}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<b>+</b></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="related-services">
        <div className="service-section-heading service-section-heading--dark">
          <span className="section-number">SERVICIOS RELACIONADOS</span>
          <h2>Una solución puede<br /><em>conectar con la siguiente.</em></h2>
        </div>
        <div className="related-services__grid">
          {related.map((item, index) => (
            <Link href={`/servicios/${item.slug}`} key={item.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.navLabel}</h3>
              <p>{item.summary}</p>
              <b>Conocer el servicio →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="service-final-cta">
        <LogoSeal />
        <div><span>GRANALVA · GRANADA</span><h2>Cuéntanos qué necesita tu empresa.</h2><p>Estudiaremos la operativa, la frecuencia y el servicio adecuado para preparar una propuesta clara.</p></div>
        <Link className="button button--yellow" href="/#contacto">Solicitar presupuesto <span>→</span></Link>
      </section>

      <SiteFooter />
    </main>
  );
}
