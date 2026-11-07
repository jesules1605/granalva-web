import Image from "next/image";
import Link from "next/link";
import { MobileNav, type NavLink } from "./mobile-nav";
import { servicePages } from "../lib/services";
import { BUSINESS } from "../lib/site";

// Navegación principal. Pasará al global `navigation` de Payload (fase 4) con
// validación de enlaces internos.
const mainLinks: NavLink[] = [
  { href: "/servicios/empresa-limpieza-granada", label: "Empresas" },
  { href: "/servicios", label: "Servicios" },
  { href: "/servicios/lavanderia-domicilio-granada", label: "Particulares" },
  { href: "/#experiencia", label: "Experiencia" },
  { href: "/#contacto", label: "Contacto" },
];

const serviceLinks: NavLink[] = servicePages.map((service) => ({ href: `/servicios/${service.slug}`, label: service.navLabel }));

export function SiteHeader() {
  return (
    <div className="fixed-navigation">
      <div className="top-ribbon" aria-label="Servicios profesionales en Granada">
        <div className="ribbon-track">
          <span>LIMPIEZA PROFESIONAL EN GRANADA</span><b>•</b><span>LAVANDERÍA PARA EMPRESAS</span><b>•</b><span>RECOGIDA Y ENTREGA</span><b>•</b>
          <span>LIMPIEZA PROFESIONAL EN GRANADA</span><b>•</b><span>LAVANDERÍA PARA EMPRESAS</span><b>•</b><span>RECOGIDA Y ENTREGA</span><b>•</b>
        </div>
      </div>
      <header className="site-header">
        <Link className="brand" href="/">
          <Image src="/granalva-logo.jpg" alt="" width={800} height={800} sizes="64px" priority />
          <span>
            <strong>GRANALVA</strong>
            <small>SERVICIO DE LIMPIEZA Y LAVANDERÍA PROFESIONAL</small>
          </span>
        </Link>
        <nav aria-label="Navegación principal">
          {mainLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="button button--dark header-cta" href="/#contacto">Solicitar presupuesto <span>↗</span></Link>
          <MobileNav links={mainLinks} services={serviceLinks} phone={{ href: `tel:${BUSINESS.phoneE164}`, label: BUSINESS.phoneDisplay }} />
        </div>
      </header>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Image src="/granalva-logo.jpg" alt="Logotipo de Granalva" width={800} height={800} sizes="100px" />
        <div><b>{BUSINESS.name.toUpperCase()}</b><span>Empresa de limpieza y lavandería profesional en Granada.</span></div>
      </div>
      <div>
        <b>Para empresas</b>
        <Link href="/servicios/empresa-limpieza-granada">Empresa de limpieza en Granada</Link>
        <Link href="/servicios/lavanderia-profesional-granada">Lavandería profesional</Link>
        <Link href="/servicios/lavanderia-hoteles-granada">Lavandería para hoteles</Link>
        <Link href="/servicios/limpieza-oficinas-locales-granada">Limpieza de oficinas y locales</Link>
        <Link href="/servicios/limpieza-fin-de-obra-granada">Limpieza fin de obra</Link>
      </div>
      <div>
        <b>Alojamientos y hogar</b>
        <Link href="/servicios/lavanderia-apartamentos-turisticos-granada">Lavandería para apartamentos turísticos</Link>
        <Link href="/servicios/limpieza-apartamentos-turisticos-granada">Limpieza de apartamentos turísticos</Link>
        <Link href="/servicios/renting-textil-granada">Renting textil</Link>
        <Link href="/servicios/lavanderia-domicilio-granada">Lavandería a domicilio</Link>
      </div>
      <div>
        <b>Contacto</b>
        <a href={`tel:${BUSINESS.phoneE164}`}>{BUSINESS.phoneDisplay}</a>
        <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
        <span>{BUSINESS.areaServedLabel}</span>
        <Link href="/#contacto">Solicitar presupuesto</Link>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {BUSINESS.name}</span>
        <Link href="/servicios">Todos los servicios</Link>
        <span>Calidad · Compromiso · Confianza</span>
        <a href="https://granadatierrasoñada.es" target="_blank" rel="noreferrer">Tipografía Granaina · Sergio Arredondo</a>
      </div>
    </footer>
  );
}
