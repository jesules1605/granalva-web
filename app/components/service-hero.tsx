import { getImageProps } from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { LogoSeal } from "./logo-seal";
import type { Crumb } from "../lib/seo";

type HeroImage = { src: string; width: number; height: number; focal?: string };

export type ServiceHeroProps = {
  crumbs: Crumb[];
  /** Etiqueta superior (p. ej. «SERVICIO DE TEMPORADA · SIERRA NEVADA»). */
  eyebrow: string;
  title: string;
  /** Frase editorial opcional en Granaina. */
  tagline?: string;
  image: string;
  imageAlt: string;
  /** Dimensiones reales de la imagen de escritorio (reservan el espacio y evitan sobreescalado). */
  imageSize?: { width: number; height: number };
  /** Posición focal CSS de la fotografía (object-position), p. ej. "60% 40%". */
  focal?: string;
  /** Variante vertical para móvil (opcional, desde el panel). */
  mobile?: HeroImage;
  /** Oscurecimiento azul 40-100 (por defecto 72: contraste AA sin tapar la foto). */
  overlay?: number;
  cta?: { href: string; label: string };
  /** Acción secundaria (teléfono, enlace…). */
  secondary?: ReactNode;
};

/**
 * Portada común de todas las páginas de servicio (Sierra Nevada incluida). Misma altura,
 * rejilla y posiciones en todas las rutas (tokens --s-hero-*): migas, etiqueta, H1 y CTA
 * ocupan siempre las mismas coordenadas; la entradilla va en el primer bloque de la página.
 * fotografía real con next/image (<picture> con variante móvil, AVIF/WebP,
 * prioridad alta porque es el LCP), capa azul de contraste separada y ajustable,
 * migas, etiqueta, H1 en Granaina y CTA. Todo configurable por servicio en el panel.
 */
export function ServiceHero({ crumbs, eyebrow, title, tagline, image, imageAlt, imageSize, focal = "center", mobile, overlay = 72, cta, secondary }: ServiceHeroProps) {
  const common = { alt: imageAlt, sizes: "100vw", quality: 75, fetchPriority: "high" as const, loading: "eager" as const };
  const desktop = getImageProps({ ...common, src: image, width: imageSize?.width ?? 1920, height: imageSize?.height ?? 1280 }).props;
  const small = mobile ? getImageProps({ ...common, src: mobile.src, width: mobile.width, height: mobile.height }).props : null;
  const style = { "--hero-overlay": String(overlay / 100), "--hero-focal": focal, "--hero-focal-mobile": mobile?.focal ?? focal } as CSSProperties;

  return (
    <section className="s-hero" style={style}>
      <picture className="s-hero__media">
        {small ? <source media="(max-width: 760px)" srcSet={small.srcSet} sizes="100vw" /> : null}
        {/* eslint-disable-next-line jsx-a11y/alt-text -- props de getImageProps (incluye alt) */}
        <img {...desktop} className="s-hero__img" />
      </picture>
      <div className="s-hero__scrim" aria-hidden="true" />
      <div className="s-hero__copy">
        <Breadcrumbs crumbs={crumbs} />
        <p className="s-hero__eyebrow"><LogoSeal small />{eyebrow}</p>
        <h1>{title}</h1>
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
