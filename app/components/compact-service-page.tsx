import Link from "next/link";
import { Accordion, type AccordionItem } from "./accordion";
import { ContactForm } from "./contact-form";
import { ServiceHero } from "./service-hero";
import { photoSize } from "../lib/photos";
import { SiteFooter, SiteHeader } from "./site-chrome";
import type { Crumb } from "../lib/seo";
import { serviceBySlug, type ServicePage } from "../lib/services";
import { BUSINESS, WHATSAPP_URL } from "../lib/site";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(iso));

const List = ({ items }: { items: { title: string; text: string }[] }) => (
  <ul className="detail-list">
    {items.map((item) => (
      <li key={item.title}><strong>{item.title}.</strong> {item.text}</li>
    ))}
  </ul>
);

/**
 * Plantilla compacta de servicio (p. ej. Sierra Nevada): presentación, beneficios,
 * funcionamiento, detalle en acordeones accesibles, FAQ, relacionados y formulario.
 * Todo el texto está en el HTML del servidor; los acordeones solo pliegan la vista.
 */
export function CompactServicePage({ service, crumbs }: { service: ServicePage; crumbs: Crumb[] }) {
  const ctaHref = service.embeddedForm ? "#reservar-ruta" : `/contacto?servicio=${service.slug}#formulario`;
  const related = service.related.map((link) => ({ ...link, service: serviceBySlug[link.slug] })).filter((link) => link.service);

  const details: AccordionItem[] = [
    {
      id: "servicio",
      title: service.introTitle,
      content: (
        <>
          {service.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="detail-promise">{service.promise}</p>
        </>
      ),
    },
    { id: "necesidades", title: service.needsTitle, content: <List items={service.needs} /> },
    ...(service.extraSections ?? []).map((section) => ({
      id: section.id,
      title: section.title,
      content: (
        <>
          {section.intro ? <p>{section.intro}</p> : null}
          <List items={section.items} />
        </>
      ),
    })),
    { id: "incluye", title: "Qué incluye el servicio", content: <List items={service.includes} /> },
    {
      id: "zona",
      title: "Zona de servicio y tipos de alojamiento",
      content: (
        <>
          <p><strong>Zona de servicio.</strong> {service.coverage}</p>
          <p>Atendemos: {service.audiences.join(", ").toLowerCase()}.</p>
        </>
      ),
    },
  ];

  return (
    <main className="site-shell service-site service-site--compact">
      <SiteHeader />

      {/* 1. Portada común de servicio: etiqueta, H1, frase editorial y CTA */}
      <ServiceHero
        crumbs={crumbs}
        eyebrow={service.eyebrow}
        title={service.h1}
        tagline={service.tagline}
        image={service.image}
        imageAlt={service.imageAlt}
        focal={service.imageFocal}
        imageSize={service.imageSize ?? photoSize(service.image)}
        mobile={service.imageMobile}
        overlay={service.heroOverlay}
        cta={{ href: ctaHref, label: service.ctaLabel }}
        secondary={<a className="button button--glass" href={`tel:${BUSINESS.phoneE164}`}>Llamar al {BUSINESS.phoneDisplay}</a>}
      />

      {/* 2. Beneficios */}
      {service.highlights ? (
        <section className="compact-highlights" aria-labelledby="beneficios-title">
          <h2 id="beneficios-title" className="compact-section-title">Lo que resolvemos en la temporada</h2>
          <p className="compact-lead">{service.summary}</p>
          <ul>
            {service.highlights.map((item, index) => (
              <li key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* 3. Funcionamiento */}
      <section className="compact-process" aria-labelledby="funcionamiento-title">
        <h2 id="funcionamiento-title" className="compact-section-title">Cómo funciona el servicio</h2>
        <ol>
          {service.process.map((step, index) => (
            <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Detalle ampliado (acordeones accesibles, texto en el HTML) */}
      <section className="compact-details" aria-labelledby="detalle-title">
        <div className="compact-details__intro">
          <h2 id="detalle-title" className="compact-section-title">Lavandería para hoteles, apartamentos y alojamientos de Sierra Nevada</h2>
        </div>
        <Accordion items={details} />
      </section>

      <section className="compact-details compact-details--faq" aria-labelledby="faq-title">
        <div className="compact-details__intro">
          <h2 id="faq-title" className="compact-section-title">Preguntas frecuentes</h2>
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

      {/* 4. Servicios relacionados */}
      <section className="related-services related-services--compact" aria-labelledby={`${service.slug}-related`}>
        <h2 id={`${service.slug}-related`} className="compact-section-title">Servicios relacionados</h2>
        <div className="related-services__grid">
          {related.map((link) => (
            <Link href={`/servicios/${link.slug}`} key={link.slug}>
              <h3>{link.service.navLabel}</h3>
              <p>{link.service.summary}</p>
              <b>{link.anchor.charAt(0).toUpperCase() + link.anchor.slice(1)} →</b>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Solicitud de presupuesto */}
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

      <p className="content-updated">
        Contenido revisado el <time dateTime={service.updatedAt}>{formatDate(service.updatedAt)}</time>.
      </p>
      <SiteFooter />
    </main>
  );
}
