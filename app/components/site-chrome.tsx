import Image from "next/image";
import Link from "next/link";
import { CookieSettingsButton } from "./cookie-consent";
import { MobileNav, type NavLink } from "./mobile-nav";
import { RibbonLoop } from "./ribbon-loop";
import { servicePages } from "../lib/services";
import { getBusinessExtras, getChrome, getSiteSettings } from "../lib/cms";
import { BUSINESS } from "../lib/site";

// Navegación principal por defecto. Se puede sustituir desde el panel
// (global «Menú principal», con validación de rutas internas).
const mainLinks: NavLink[] = [
  { href: "/servicios/empresa-limpieza-granada", label: "Empresas" },
  { href: "/servicios", label: "Servicios" },
  { href: "/servicios/lavanderia-sierra-nevada", label: "Sierra Nevada" },
  { href: "/servicios/lavanderia-domicilio-granada", label: "Particulares" },
  { href: "/sobre-nosotros", label: "Sobre nosotros" },
  { href: "/contacto", label: "Contacto" },
];

const ribbonItems = [
  "Limpieza profesional en Granada",
  "Lavandería para empresas",
  "Recogida y entrega",
  "Hoteles y apartamentos turísticos",
  "Servicio profesional Granalva",
];

const serviceLinks: NavLink[] = servicePages.map((service) => ({ href: `/servicios/${service.slug}`, label: service.navLabel }));

export async function SiteHeader() {
  const [chrome, settings] = await Promise.all([getChrome(), getSiteSettings()]);
  const links = chrome.navigation ?? mainLinks;
  return (
    <div className="fixed-navigation">
      <RibbonLoop items={chrome.ribbon ?? ribbonItems} />
      <header className="site-header">
        {/* Sin precarga automática: la precarga de la portada descargaría su póster en cada página. */}
        <Link className="brand" href="/" prefetch={false}>
          <Image src="/granalva-logo.jpg" alt="" width={800} height={800} sizes="64px" loading="eager" />
          <span>
            <strong>GRANALVA</strong>
            <small>SERVICIO DE LIMPIEZA Y LAVANDERÍA PROFESIONAL</small>
          </span>
        </Link>
        <nav aria-label="Navegación principal">
          {links.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link className="button button--dark header-cta" href="/contacto#formulario">Solicitar presupuesto <span>↗</span></Link>
          <MobileNav links={links} services={serviceLinks} phone={{ href: `tel:${settings.phoneE164}`, label: settings.phoneDisplay }} />
        </div>
      </header>
    </div>
  );
}

export async function SiteFooter() {
  const [settings, extras] = await Promise.all([getSiteSettings(), getBusinessExtras()]);
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Image src="/granalva-logo.jpg" alt="Logotipo de Granalva" width={800} height={800} sizes="100px" />
        <div><b>{BUSINESS.name.toUpperCase()}</b><span>{settings.footerTagline ?? "Empresa de limpieza y lavandería profesional en Granada."}</span></div>
      </div>
      <div>
        <b>Para empresas</b>
        <Link href="/servicios/empresa-limpieza-granada">Empresa de limpieza en Granada</Link>
        <Link href="/servicios/lavanderia-profesional-granada">Lavandería profesional</Link>
        <Link href="/servicios/lavanderia-hoteles-granada">Lavandería para hoteles</Link>
        <Link href="/servicios/limpieza-oficinas-locales-granada">Limpieza de oficinas y locales</Link>
        <Link href="/servicios/limpieza-fin-de-obra-granada">Limpieza fin de obra</Link>
        <Link href="/servicios/lavanderia-sierra-nevada">Lavandería en Sierra Nevada</Link>
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
        <a href={`tel:${settings.phoneE164}`}>{settings.phoneDisplay}</a>
        <a href={`mailto:${settings.email}`}>{settings.email}</a>
        <span>{settings.areaServedLabel}</span>
        {extras.openingHours ? <span>{extras.openingHours}</span> : null}
        {extras.orderUrl ? <a href={extras.orderUrl}>Hacer un pedido de lavandería</a> : null}
        <Link href="/contacto">Contacto y presupuestos</Link>
        <Link href="/sobre-nosotros">Sobre nosotros</Link>
        <Link href="/referencias">Referencias y opiniones</Link>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {BUSINESS.name}</span>
        <nav className="footer-legal" aria-label="Información legal">
          <Link href="/aviso-legal">Aviso legal</Link>
          <Link href="/politica-de-privacidad">Privacidad</Link>
          <Link href="/politica-de-cookies">Cookies</Link>
          <CookieSettingsButton />
          <Link href="/declaracion-de-accesibilidad">Accesibilidad</Link>
        </nav>
        <a href="https://granadatierrasoñada.es" target="_blank" rel="noreferrer">Tipografía Granaina · Sergio Arredondo</a>
      </div>
    </footer>
  );
}
