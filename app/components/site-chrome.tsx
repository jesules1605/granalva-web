import Image from "next/image";
import Link from "next/link";

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
        <Link className="brand" href="/" aria-label="Granalva, inicio">
          <Image src="/granalva-logo.jpg" alt="Logotipo de Granalva" width={800} height={800} priority unoptimized />
          <span>
            <strong>GRANALVA</strong>
            <small>SERVICIO DE LIMPIEZA Y LAVANDERÍA PROFESIONAL</small>
          </span>
        </Link>
        <nav aria-label="Navegación principal">
          <Link href="/servicios/empresa-limpieza-granada">Empresas</Link>
          <Link href="/servicios">Servicios</Link>
          <Link href="/servicios/lavanderia-domicilio-granada">Particulares</Link>
          <Link href="/#experiencia">Experiencia</Link>
          <Link href="/#contacto">Contacto</Link>
        </nav>
        <Link className="button button--dark header-cta" href="/#contacto">Solicitar presupuesto <span>↗</span></Link>
      </header>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Image src="/granalva-logo.jpg" alt="Logotipo de Granalva" width={800} height={800} unoptimized />
        <div><b>GRANALVA</b><span>Servicio de limpieza y lavandería profesional.</span></div>
      </div>
      <div>
        <b>Para empresas</b>
        <Link href="/servicios/empresa-limpieza-granada">Empresa de limpieza en Granada</Link>
        <Link href="/servicios/lavanderia-profesional-granada">Lavandería profesional</Link>
        <Link href="/servicios/lavanderia-hoteles-granada">Lavandería para hoteles</Link>
        <Link href="/servicios/limpieza-oficinas-locales-granada">Oficinas y locales</Link>
      </div>
      <div>
        <b>Alojamientos y hogar</b>
        <Link href="/servicios/lavanderia-apartamentos-turisticos-granada">Lavandería para apartamentos</Link>
        <Link href="/servicios/limpieza-apartamentos-turisticos-granada">Limpieza turística</Link>
        <Link href="/servicios/renting-textil-granada">Renting textil</Link>
        <Link href="/servicios/lavanderia-domicilio-granada">Lavandería a domicilio</Link>
      </div>
      <div>
        <b>Contacto</b>
        <a href="tel:+34744488964">744 488 964</a>
        <a href="mailto:info@limpiezasgranalva.com">info@limpiezasgranalva.com</a>
        <span>Granada y área metropolitana</span>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Granalva</span>
        <Link href="/servicios">Todos los servicios</Link>
        <span>Calidad · Compromiso · Confianza</span>
        <a href="https://granadatierrasoñada.es" target="_blank" rel="noreferrer">Tipografía Granaina · Sergio Arredondo</a>
      </div>
    </footer>
  );
}
