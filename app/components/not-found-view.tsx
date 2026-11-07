import Link from "next/link";
import { LogoSeal } from "./logo-seal";
import { SiteFooter, SiteHeader } from "./site-chrome";
import { servicePages } from "../lib/services";
import { BUSINESS } from "../lib/site";

export const notFoundMetadata = {
  title: { absolute: "Página no encontrada | Granalva" },
  description: "La dirección solicitada no existe en la web de Limpiezas Granalva.",
  robots: { index: false, follow: true },
};

/** Contenido de la 404 diseñada (se usa en not-found.tsx y en global-not-found.tsx). */
export function NotFoundView() {
  return (
    <main className="site-shell services-hub not-found">
      <SiteHeader />
      <section className="services-hub__hero">
        <div>
          <p className="eyebrow"><LogoSeal small />ERROR 404</p>
          <h1>Esta página no existe.<br /><em>Te ayudamos a encontrar lo que buscas.</em></h1>
          <p>Es posible que la dirección haya cambiado o que el enlace esté incompleto. Estos son los servicios de limpieza y lavandería de Granalva en Granada:</p>
        </div>
        <LogoSeal className="services-hub__seal" />
      </section>
      <section className="not-found__links" aria-label="Servicios de Granalva">
        <ul>
          {servicePages.map((service) => (
            <li key={service.slug}><Link href={`/servicios/${service.slug}`}>{service.h1}</Link></li>
          ))}
        </ul>
        <div className="not-found__actions">
          <Link className="button button--dark" href="/">Volver al inicio <span>→</span></Link>
          <Link className="button button--outline-dark" href="/contacto#formulario">Solicitar presupuesto <span>→</span></Link>
          <a className="text-link" href={`tel:${BUSINESS.phoneE164}`}>O llámanos al {BUSINESS.phoneDisplay}</a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
