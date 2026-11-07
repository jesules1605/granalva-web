import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "../../components/breadcrumbs";
import { ContactForm } from "../../components/contact-form";
import { LogoSeal } from "../../components/logo-seal";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import { breadcrumbJsonLd, jsonLdString, ORGANIZATION_ID, WEBSITE_ID, type Crumb } from "../../lib/seo";
import { absoluteUrl, BUSINESS, WHATSAPP_URL } from "../../lib/site";

// Conserva la URL /contacto/ de WordPress. Los parámetros ?servicio= y ?colada=
// solo preseleccionan el formulario: la canonical es siempre /contacto.
const TITLE = "Contacto y presupuestos de limpieza y lavandería | Granalva";
const DESCRIPTION =
  "Pide presupuesto de limpieza profesional, lavandería con recogida y entrega o renting textil en Granada y Sierra Nevada. Teléfono 744 488 964.";
const URL = absoluteUrl("/contacto");
const crumbs: Crumb[] = [
  { name: "Inicio", path: "/" },
  { name: "Contacto", path: "/contacto" },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: BUSINESS.name,
    url: URL,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og-granalva-limpieza-lavanderia-granada.jpg", width: 1200, height: 630, alt: "Limpieza y lavandería profesional de Granalva en Granada" }],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${URL}#webpage`,
      url: URL,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "es-ES",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": ORGANIZATION_ID },
      breadcrumb: { "@id": `${URL}#breadcrumb` },
    },
    { ...breadcrumbJsonLd(crumbs), "@id": `${URL}#breadcrumb` },
  ],
};

const nextSteps = [
  { title: "Recibimos tu solicitud", text: "Queda registrada con una referencia y la revisa el equipo de Granalva." },
  { title: "Estudiamos la operativa", text: "Si hace falta, te llamamos para completar volumen, frecuencia, accesos o fechas." },
  { title: "Te enviamos la propuesta", text: "Una propuesta ajustada al servicio real, sin tarifas genéricas." },
];

export default function ContactPage() {
  return (
    <main className="site-shell services-hub contact-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      <SiteHeader />
      <section className="services-hub__hero services-hub__hero--compact">
        <div>
          <Breadcrumbs crumbs={crumbs} />
          <p className="eyebrow"><LogoSeal small />CONTACTO</p>
          <h1>Contacto y presupuestos{" "}<br /><em>de limpieza y lavandería</em></h1>
          <p>Cuéntanos qué necesita tu empresa, tu alojamiento o tu hogar. Para empresas preparamos propuestas según volumen, frecuencia y operativa; para particulares, organizamos la recogida de la colada.</p>
        </div>
        <LogoSeal className="services-hub__seal" />
      </section>

      <section className="contact-section" id="formulario">
        <div className="contact-copy">
          <span className="section-number section-number--light">ATENCIÓN DIRECTA</span>
          <h2>Hablemos de tu operativa.</h2>
          <p>Solo necesitamos unos datos básicos. Si quieres, añade los datos operativos para que la primera propuesta sea más precisa. Responde el <Link href="/sobre-nosotros">equipo de Granalva</Link>, sin intermediarios.</p>
          <div className="contact-direct">
            <a href={`tel:${BUSINESS.phoneE164}`}><small>Teléfono</small><strong>{BUSINESS.phoneDisplay}</strong></a>
            <a href={`mailto:${BUSINESS.email}`}><small>Correo</small><strong>{BUSINESS.email}</strong></a>
            {WHATSAPP_URL ? <a href={WHATSAPP_URL} target="_blank" rel="noopener"><small>WhatsApp</small><strong>Escríbenos</strong></a> : null}
            <div><small>Zona de servicio</small><strong>{BUSINESS.areaServedLabel}; lavandería también en Sierra Nevada</strong></div>
          </div>
        </div>
        <ContactForm variant="general" headingLevel={2} />
      </section>

      <section className="service-needs" aria-labelledby="pasos-title">
        <div className="service-section-heading service-section-heading--dark">
          <span className="section-number">DESPUÉS DE ENVIAR</span>
          <h2 id="pasos-title">Qué ocurre con tu solicitud</h2>
        </div>
        <div className="service-needs__grid">
          {nextSteps.map((step) => <article key={step.title}><h3>{step.title}</h3><p>{step.text}</p></article>)}
        </div>
      </section>

      <section className="not-found__links" aria-label="Servicios más solicitados">
        <ul>
          <li><Link href="/servicios/lavanderia-profesional-granada">Lavandería profesional para empresas</Link></li>
          <li><Link href="/servicios/empresa-limpieza-granada">Empresa de limpieza profesional</Link></li>
          <li><Link href="/servicios/lavanderia-sierra-nevada">Lavandería en Sierra Nevada</Link></li>
        </ul>
      </section>
      <SiteFooter />
    </main>
  );
}
