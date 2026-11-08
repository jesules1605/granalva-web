import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import { Breadcrumbs } from "../../components/breadcrumbs";
import { CmsPage, cmsPageMetadata } from "../../components/cms-page";
import { ClientLogos } from "../../components/home/client-logos";
import { LogoSeal } from "../../components/logo-seal";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import { getClientLogos, getPage, getReviews, getSiteSettings } from "../../lib/cms";
import { sectors } from "../../lib/home-content";
import { breadcrumbJsonLd, jsonLdString, ORGANIZATION_ID, WEBSITE_ID, type Crumb } from "../../lib/seo";
import { absoluteUrl, BUSINESS } from "../../lib/site";

// Conserva la URL /referencias de WordPress (opiniones, experiencia y confianza).
// Reseñas reales con plataforma y fecha; sin valoraciones en datos estructurados.
const SLUG = "referencias";
const TITLE = "Referencias y opiniones de clientes en Granada | Granalva";
const DESCRIPTION =
  "Opiniones reales de clientes de Granalva en Google: limpieza de apartamentos turísticos, empresas y lavandería en Granada. Sectores, experiencia y forma de trabajar.";
const URL = absoluteUrl("/referencias");
const crumbs: Crumb[] = [
  { name: "Inicio", path: "/" },
  { name: "Referencias", path: "/referencias" },
];

const formatMonth = (iso: string) => new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(iso));

const quality = [
  { title: "Planificación previa", text: "Antes de empezar acordamos espacios, frecuencias, horarios y puntos críticos de cada cliente." },
  { title: "Protocolo por espacio", text: "Cada apartamento, oficina o local tiene su lista de tareas y su nivel de acabado definido." },
  { title: "Revisión del resultado", text: "El trabajo se revisa al terminar: camas, baños, cocina, textiles y detalles que nota el huésped o el cliente." },
  { title: "Comunicación directa", text: "Un interlocutor de Granalva para incidencias, cambios de última hora y picos de ocupación." },
];

const related = [
  { href: "/servicios/limpieza-apartamentos-turisticos-granada", label: "Limpieza de apartamentos turísticos" },
  { href: "/servicios/empresa-limpieza-granada", label: "Empresa de limpieza en Granada" },
  { href: "/servicios/lavanderia-profesional-granada", label: "Lavandería profesional" },
  { href: "/servicios/lavanderia-apartamentos-turisticos-granada", label: "Lavandería para apartamentos turísticos" },
];

const defaultMetadata: Metadata = {
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

async function ReferenciasDefault() {
  const [reviews, logos, settings] = await Promise.all([getReviews(), getClientLogos(), getSiteSettings()]);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", "@id": `${URL}#webpage`, url: URL, name: TITLE, description: DESCRIPTION, inLanguage: "es-ES", isPartOf: { "@id": WEBSITE_ID }, about: { "@id": ORGANIZATION_ID }, breadcrumb: { "@id": `${URL}#breadcrumb` } },
      { ...breadcrumbJsonLd(crumbs), "@id": `${URL}#breadcrumb` },
    ],
  };

  return (
    <main className="site-shell cms-site referencias">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      <SiteHeader />
      <section className="cms-head">
        <Breadcrumbs crumbs={crumbs} tone="dark" />
        <h1 className="wide-title">Referencias y opiniones de nuestros clientes</h1>
        <p className="cms-head__lead">
          Lo que dicen de Granalva quienes ya trabajan con nosotros: propietarios de apartamentos turísticos, empresas y particulares de Granada.
          {settings.years ? ` Más de ${settings.years} años de experiencia en limpieza y lavandería profesional.` : ""}
        </p>
      </section>

      <section className="cms-block cms-reviews" aria-labelledby="opiniones-title">
        <span className="section-number">RESEÑAS VERIFICADAS EN GOOGLE</span>
        <h2 id="opiniones-title" className="wide-title">Opiniones reales, sin editar</h2>
        <ul className="cms-reviews__grid">
          {reviews.map((review) => (
            <li key={review.author}>
              <figure className="review-card">
                <span role="img" aria-label="Valoración: 5 de 5 estrellas">★★★★★</span>
                <blockquote><p>“{review.quote}”</p></blockquote>
                <figcaption><b>{review.author}</b><small>Reseña en {review.platform} · <time dateTime={review.date}>{formatMonth(review.date)}</time></small></figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section className="sectors" aria-labelledby="sectores-ref-title">
        <span className="section-number section-number--light">SECTORES CON LOS QUE TRABAJAMOS</span>
        <h2 id="sectores-ref-title" className="sectors__title">Experiencia en espacios{" "}<br /><em>que tienen que estar siempre listos.</em></h2>
        <ul className="sectors__grid">
          {sectors.map((sector, index) => (
            <li className="sector-card" key={sector.label}><span className="sector-card__number">{String(index + 1).padStart(2, "0")}</span><Link className="sector-card__link" href={sector.href}>{sector.label}</Link><LogoSeal small /></li>
          ))}
        </ul>
      </section>

      <section className="cms-block cms-process" aria-labelledby="calidad-title">
        <span className="section-number">CÓMO CUIDAMOS LA CALIDAD</span>
        <h2 id="calidad-title" className="wide-title">Un proceso que se repite en cada servicio</h2>
        <ol>{quality.map((step, i) => <li key={step.title}><span>{String(i + 1).padStart(2, "0")}</span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
      </section>

      <ClientLogos logos={logos} />

      <section className="related-services related-services--compact" aria-labelledby="ref-servicios-title">
        <h2 id="ref-servicios-title" className="compact-section-title">Servicios que valoran nuestros clientes</h2>
        <div className="related-services__grid">
          {related.map((link) => <Link key={link.href} href={link.href}><h3>{link.label}</h3><b>Ver el servicio →</b></Link>)}
        </div>
      </section>

      <section className="home-final-cta" aria-labelledby="ref-cta-title">
        <h2 id="ref-cta-title">¿Quieres ser nuestra próxima referencia?</h2>
        <div>
          <Link className="button button--yellow" href="/contacto#formulario">Solicitar presupuesto <span>→</span></Link>
          <a className="button button--glass" href={`tel:${settings.phoneE164}`}>Llamar al {settings.phoneDisplay}</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG, (await draftMode()).isEnabled);
  return page ? cmsPageMetadata(page) : defaultMetadata;
}

export default async function Referencias() {
  const page = await getPage(SLUG, (await draftMode()).isEnabled);
  return page ? <CmsPage page={page} /> : <ReferenciasDefault />;
}
