import { getImageProps } from "next/image";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { LogoSeal } from "../logo-seal";
import type { HomeHeroData } from "../../lib/cms";

const link = (href: string, className: string, label: string) =>
  href.startsWith("/") ? <Link className={className} href={href}>{label} <span>→</span></Link> : <a className={className} href={href}>{label} <span>→</span></a>;

/**
 * Primer bloque de la portada: fotografía (elemento LCP) sin JavaScript.
 * <picture> con una variante móvil y otra de escritorio generadas por next/image
 * (AVIF/WebP), prioridad alta, dimensiones reservadas por el contenedor (sin CLS).
 * Zoom opcional solo con CSS (scale 1 → 1,03, sin traslación), anulado con
 * prefers-reduced-motion.
 */
export function HomeHero({ hero }: { hero: HomeHeroData }) {
  const common = { alt: hero.alt, sizes: "100vw", quality: 80, fetchPriority: "high" as const, loading: "eager" as const };
  const desktop = getImageProps({ ...common, src: hero.desktop.src, width: hero.desktop.width, height: hero.desktop.height }).props;
  const mobile = getImageProps({ ...common, src: hero.mobile.src, width: hero.mobile.width, height: hero.mobile.height }).props;
  const style = { "--hero-overlay": String(hero.overlay / 100), "--hero-focal": hero.desktop.focal, "--hero-focal-mobile": hero.mobile.focal } as CSSProperties;

  return (
    <section className={hero.zoom ? "hero hero--business hero--zoom" : "hero hero--business"} id="inicio" style={style}>
      <picture className="hero-photo">
        <source media="(max-width: 760px)" srcSet={mobile.srcSet} sizes="100vw" />
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- props de getImageProps (incluye alt) */}
        <img {...desktop} className="hero-photo__img" />
      </picture>
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow"><LogoSeal small /> {hero.eyebrow}</p>
        <h1>{hero.titleLine1}{" "}<br /><em>{hero.titleLine2}</em></h1>
        <p className="hero-lead">{hero.subtitle}</p>
        <div className="hero-actions">
          {link(hero.primary.href, "button button--yellow", hero.primary.label)}
          {link(hero.secondary.href, "button button--glass", hero.secondary.label)}
        </div>
        <ul className="hero-quicklinks" aria-label="Accesos directos">
          <li><Link href="/servicios/empresa-limpieza-granada">Limpieza para empresas</Link></li>
          <li><a href="#sierra-nevada">Temporada en Sierra Nevada</a></li>
          <li><Link href="/servicios/lavanderia-domicilio-granada#colada">Hacer un pedido particular</Link></li>
        </ul>
      </div>
      <div className="hero-stamp" aria-label="Granalva, servicio local en Granada">
        <Image src="/granalva-logo.jpg" alt="Granalva" width={800} height={800} sizes="240px" />
      </div>
    </section>
  );
}
