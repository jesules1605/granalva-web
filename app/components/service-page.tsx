import Link from "next/link";
import { ContactForm } from "./contact-form";
import { LoadPicker } from "./home/load-picker";
import { LogoSeal } from "./logo-seal";
import { ServiceHero } from "./service-hero";
import { SiteFooter, SiteHeader } from "./site-chrome";
import type { Crumb } from "../lib/seo";
import { serviceBySlug, type ServicePage } from "../lib/services";
import { BUSINESS, WHATSAPP_URL } from "../lib/site";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(iso));

export function ServicePageView({ service, crumbs }: { service: ServicePage; crumbs: Crumb[] }) {
  // CTA principal: la propia página si incluye formulario; si no, /contacto con el servicio preseleccionado.
  const ctaHref = service.embeddedForm ? "#reservar-ruta" : `/contacto?servicio=${service.slug}#formulario`;
  const related = service.related
    .map((link) => ({ ...link, service: serviceBySlug[link.slug] }))
    .filter((link) => link.service);

  return (
    <main className="site-shell service-site">
      <SiteHeader />

      <ServiceHero
        crumbs={crumbs}
        eyebrow={service.eyebrow}
        title={service.h1}
        lead={service.summary}
        image={service.image}
        imageAlt={service.imageAlt}
        focal={service.imageFocal}
        cta={{ href: ctaHref, label: service.ctaLabel }}
        secondary={<a className="button button--glass" href={`tel:${BUSINESS.phoneE164}`}>Llamar al {BUSINESS.phoneDisplay}</a>}
      />

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

      <section className="service-needs" aria-labelledby={`${service.slug}-needs`}>
        <div className="service-section-heading service-section-heading--dark">
          <span className="section-number">02 / QUÉ RESUELVE</span>
          <h2 id={`${service.slug}-needs`}>{service.needsTitle}</h2>
        </div>
        <div className="service-needs__grid">
          {service.needs.map((need) => (
            <article key={need.title}>
              <h3>{need.title}</h3>
              <p>{need.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-includes">
        <div className="service-section-heading">
          <span className="section-number section-number--light">03 / QUÉ INCLUYE</span>
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
          <span className="section-number">04 / CÓMO TRABAJAMOS</span>
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

      {service.showLoadPicker ? <LoadPicker /> : null}

      {service.extraSections?.map((section, sectionIndex) => (
        <section key={section.id} id={section.id} className={`service-extra ${sectionIndex % 2 ? "service-extra--alt" : ""}`} aria-labelledby={`${section.id}-title`}>
          <div className="service-extra__head">
            <span className="section-number">{section.eyebrow}</span>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            {section.intro ? <p>{section.intro}</p> : null}
          </div>
          <div className="service-extra__grid">
            {section.items.map((item) => (
              <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>
            ))}
          </div>
        </section>
      ))}

      <section className="service-audiences">
        <div>
          <span className="section-number">05 / PARA QUIÉN Y DÓNDE</span>
          <h2>Diseñado para necesidades reales de Granada.</h2>
          <p className="service-coverage"><strong>Zona de servicio.</strong> {service.coverage}</p>
        </div>
        <ul>
          {service.audiences.map((audience) => <li key={audience}><LogoSeal small />{audience}</li>)}
        </ul>
      </section>

      <section className="service-faq">
        <div className="service-section-heading service-section-heading--dark">
          <span className="section-number">06 / PREGUNTAS FRECUENTES</span>
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

      <section className="related-services" aria-labelledby={`${service.slug}-related`}>
        <div className="service-section-heading service-section-heading--dark">
          <span className="section-number">SERVICIOS RELACIONADOS</span>
          <h2 id={`${service.slug}-related`}>Una solución puede<br /><em>conectar con la siguiente.</em></h2>
        </div>
        <div className="related-services__grid">
          {related.map((link, index) => (
            <Link href={`/servicios/${link.slug}`} key={link.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{link.service.navLabel}</h3>
              <p>{link.service.summary}</p>
              <b>{link.anchor.charAt(0).toUpperCase() + link.anchor.slice(1)} →</b>
            </Link>
          ))}
        </div>
      </section>

      {service.embeddedForm ? (
        <section className="contact-section contact-section--embedded" id="reservar-ruta" aria-labelledby="reservar-ruta-title">
          <div className="contact-copy">
            <span className="section-number section-number--light">{service.eyebrow}</span>
            <h2 id="reservar-ruta-title">{service.ctaTitle}</h2>
            <p>{service.ctaText}</p>
            <div className="contact-direct">
              <a href={`tel:${BUSINESS.phoneE164}`}><small>Teléfono</small><strong>{BUSINESS.phoneDisplay}</strong></a>
              <a href={`mailto:${BUSINESS.email}`}><small>Correo</small><strong>{BUSINESS.email}</strong></a>
              {WHATSAPP_URL ? <a href={WHATSAPP_URL} target="_blank" rel="noopener"><small>WhatsApp</small><strong>Escríbenos</strong></a> : null}
            </div>
          </div>
          <ContactForm variant={service.embeddedForm} defaultService={service.slug} />
        </section>
      ) : null}

      <section className="service-final-cta">
        <LogoSeal />
        <div>
          <span>GRANALVA · {BUSINESS.areaServedLabel.toUpperCase()}</span>
          <h2>{service.ctaTitle}</h2>
          <p>{service.ctaText}</p>
          <p className="service-final-cta__contact">
            <a href={`tel:${BUSINESS.phoneE164}`}>{BUSINESS.phoneDisplay}</a>
            <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
          </p>
        </div>
        <Link className="button button--yellow" href={ctaHref}>{service.ctaLabel} <span>→</span></Link>
      </section>

      <p className="content-updated">
        Contenido revisado el <time dateTime={service.updatedAt}>{formatDate(service.updatedAt)}</time>.
      </p>

      <SiteFooter />
    </main>
  );
}
