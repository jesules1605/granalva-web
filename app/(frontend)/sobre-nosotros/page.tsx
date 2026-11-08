import { draftMode } from "next/headers";
import { CmsPage, cmsPageMetadata } from "../../components/cms-page";
import { getPage } from "../../lib/cms";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "../../components/breadcrumbs";
import { LogoSeal } from "../../components/logo-seal";
import { SiteFooter, SiteHeader } from "../../components/site-chrome";
import { team } from "../../lib/home-content";
import { PHOTOS } from "../../lib/photos";
import { breadcrumbJsonLd, jsonLdString, ORGANIZATION_ID, WEBSITE_ID, type Crumb } from "../../lib/seo";
import { absoluteUrl, BUSINESS } from "../../lib/site";

// Conserva la URL /sobre-nosotros/ de WordPress (sin barra final por el 301 de proxy.ts).
// Pendiente: fotografías reales del equipo, instalaciones y vehículos (colección `team`).
const TITLE = "Sobre nosotros: equipo de limpieza y lavandería en Granada | Granalva";
const DESCRIPTION =
  "Conoce a Granalva, empresa granadina de limpieza profesional y lavandería: cómo trabajamos, quién coordina cada servicio y a quién atendemos en Granada.";
const URL = absoluteUrl("/sobre-nosotros");
const crumbs: Crumb[] = [
  { name: "Inicio", path: "/" },
  { name: "Sobre nosotros", path: "/sobre-nosotros" },
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

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
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

const principles = [
  { title: "Planificación antes de empezar", text: "Estudiamos espacio, volumen, frecuencia y horarios antes de proponer un servicio." },
  { title: "Interlocutor directo", text: "Cada cliente sabe a quién llamar para cambios, incidencias o picos de trabajo." },
  { title: "Revisión del resultado", text: "Los puntos acordados se comprueban antes de dar por terminado un servicio." },
  { title: "Limpieza y lavandería coordinadas", text: "Un mismo equipo puede encargarse del espacio y de sus textiles." },
];

function AboutPageDefault() {
  return (
    <main className="site-shell services-hub about-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(structuredData) }} />
      <SiteHeader />
      <section className="services-hub__hero">
        <div>
          <Breadcrumbs crumbs={crumbs} />
          <p className="eyebrow"><LogoSeal small />SOBRE GRANALVA</p>
          <h1>Sobre Granalva:{" "}<br /><em>limpieza y lavandería con equipo propio en Granada</em></h1>
          <p>Granalva es una empresa granadina especializada en limpieza de apartamentos turísticos, espacios profesionales y lavandería con recogida y entrega. Trabajamos con empresas, alojamientos, gestores y particulares de Granada y su área metropolitana, y con rutas de lavandería a Sierra Nevada.</p>
        </div>
        <LogoSeal className="services-hub__seal" />
      </section>

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

      <section className="team" id="experiencia">
        <div className="team-visual">
          <div className="team-gallery team-gallery--main">
            <Image src={PHOTOS.apartment.src} alt={PHOTOS.apartment.alt} fill sizes="(max-width: 1000px) 100vw, 54vw" quality={70} />
            <span>EN LOS ALOJAMIENTOS</span>
          </div>
          <div className="team-gallery team-gallery--detail">
            <Image src={PHOTOS.bedLinen.src} alt={PHOTOS.bedLinen.alt} fill sizes="(max-width: 760px) 46vw, 22vw" quality={70} />
            <span>EN LA LAVANDERÍA</span>
          </div>
          <div className="team-logo-card" aria-label="Granalva, equipo de Granada">
            <Image src="/granalva-logo.jpg" alt="" width={800} height={800} sizes="160px" />
            <span>EQUIPO PROPIO<br /><b>COORDINACIÓN DIRECTA</b></span>
          </div>
          <div className="team-note"><LogoSeal small /><p>Nos verás llegar,<br /><b>nos tendrás al otro lado.</b></p></div>
        </div>
        <div className="team-copy">
          <span className="section-number">EXPERIENCIA Y EQUIPO</span>
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
          <Link className="text-link" href="/contacto#formulario">Hablar con el equipo de Granalva <span>→</span></Link>
        </div>
      </section>

      <section className="service-needs" aria-labelledby="principios-title">
        <div className="service-section-heading service-section-heading--dark">
          <span className="section-number">CÓMO TRABAJAMOS</span>
          <h2 id="principios-title">Cuatro principios en cada servicio</h2>
        </div>
        <div className="service-needs__grid service-needs__grid--four">
          {principles.map((item) => (
            <article key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>
          ))}
        </div>
      </section>

      <section className="service-final-cta">
        <LogoSeal />
        <div><span>GRANALVA · GRANADA</span><h2>Hablemos de tu operativa.</h2><p>Cuéntanos qué necesitas y te propondremos un servicio ajustado a tu actividad.</p></div>
        <Link className="button button--yellow" href="/contacto#formulario">Hablar con el equipo de Granalva <span>→</span></Link>
      </section>
      <SiteFooter />
    </main>
  );
}

// Si existe una página publicada «sobre-nosotros» en el panel, sustituye a este contenido.
const SLUG = "sobre-nosotros";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG, (await draftMode()).isEnabled);
  return page ? cmsPageMetadata(page) : defaultMetadata;
}

export default async function AboutPage() {
  const page = await getPage(SLUG, (await draftMode()).isEnabled);
  return page ? <CmsPage page={page} /> : <AboutPageDefault />;
}
