import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { LogoSeal } from "./logo-seal";
import type { Crumb } from "../lib/seo";

export type ServiceHeroProps = {
  crumbs: Crumb[];
  /** Etiqueta superior (p. ej. «SERVICIO DE TEMPORADA · SIERRA NEVADA»). */
  eyebrow: string;
  title: string;
  /** Entradilla opcional (resumen del servicio). */
  lead?: string;
  /** Frase editorial opcional en Granaina. */
  tagline?: string;
  image: string;
  imageAlt: string;
  /** Posición focal CSS de la fotografía (object-position), p. ej. "60% 40%". */
  focal?: string;
  cta?: { href: string; label: string };
  /** Acción secundaria (teléfono, enlace…). */
  secondary?: ReactNode;
};

/**
 * Portada común de todas las páginas de servicio (Sierra Nevada incluida):
 * fotografía real con next/image (`fill`, AVIF/WebP, prioridad porque es el LCP),
 * capa azul de contraste separada, migas, etiqueta, H1 en Granaina y CTA opcional.
 * La fotografía, el texto alternativo y la posición focal se configuran por servicio.
 */
export function ServiceHero({ crumbs, eyebrow, title, lead, tagline, image, imageAlt, focal = "center", cta, secondary }: ServiceHeroProps) {
  return (
    <section className="s-hero">
      <div className="s-hero__media">
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" quality={70} style={{ objectPosition: focal }} />
      </div>
      <div className="s-hero__scrim" aria-hidden="true" />
      <div className="s-hero__copy">
        <Breadcrumbs crumbs={crumbs} />
        <p className="s-hero__eyebrow"><LogoSeal small />{eyebrow}</p>
        <h1>{title}</h1>
        {lead ? <p className="s-hero__lead">{lead}</p> : null}
        {tagline ? <p className="s-hero__tagline">{tagline}</p> : null}
        {cta || secondary ? (
          <div className="s-hero__actions">
            {cta ? <Link className="button button--yellow" href={cta.href}>{cta.label} <span>→</span></Link> : null}
            {secondary}
          </div>
        ) : null}
      </div>
    </section>
  );
}
