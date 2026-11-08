import { draftMode } from "next/headers";
import { CmsPage, cmsPageMetadata } from "../../components/cms-page";
import { getPage } from "../../lib/cms";
import type { Metadata } from "next";
import Link from "next/link";
import { CookieSettingsButton } from "../../components/cookie-consent";
import { LegalPage } from "../../components/legal-page";
import { LEGAL_UPDATED, legalCrumbs, legalMetadata } from "../../lib/legal";
import { BUSINESS } from "../../lib/site";

const defaultMetadata = legalMetadata("/politica-de-cookies", "Política de cookies", "Qué cookies utiliza la web de Limpiezas Granalva, para qué sirven, cuánto duran y cómo aceptarlas, rechazarlas o cambiarlas.");

function PoliticaCookiesDefault() {
  return (
    <LegalPage title="Política de cookies" crumbs={legalCrumbs("/politica-de-cookies", "Política de cookies")} updatedAt={LEGAL_UPDATED}>
      <p>Las cookies son pequeños archivos que la web guarda en tu navegador. Esta web usa solo las cookies técnicas imprescindibles y, únicamente si las aceptas, cookies de analítica. No usamos cookies publicitarias ni de redes sociales.</p>

      <h2>Cambiar tu elección</h2>
      <p>Puedes aceptar, rechazar o cambiar tu elección cuando quieras: <CookieSettingsButton className="button button--outline-dark">Configurar cookies</CookieSettingsButton></p>
      <p>También puedes borrar las cookies desde la configuración de tu navegador. Si no se ha configurado la analítica en la web, no se muestra ningún aviso porque no hay cookies opcionales.</p>

      <h2>Cookies que utiliza esta web</h2>
      <table>
        <thead><tr><th>Cookie</th><th>Titular</th><th>Tipo y finalidad</th><th>Duración</th></tr></thead>
        <tbody>
          <tr><td>granalva_consent</td><td>{BUSINESS.name}</td><td>Técnica. Guarda tu elección sobre las cookies.</td><td>12 meses</td></tr>
          <tr><td>payload-token</td><td>{BUSINESS.name}</td><td>Técnica. Solo para el personal que inicia sesión en el panel de gestión.</td><td>Sesión (máx. 8 horas)</td></tr>
          <tr><td>Verificación antispam (Turnstile)</td><td>Cloudflare, Inc.</td><td>Técnica de seguridad. Comprueba que el formulario lo envía una persona, cuando está activa.</td><td>Durante el envío</td></tr>
          <tr><td>_ga, _ga_*</td><td>Google Ireland Limited</td><td>Analítica, <strong>solo con tu consentimiento</strong>. Distingue visitas de forma seudónima para medir el uso de la web.</td><td>Hasta 2 años</td></tr>
        </tbody>
      </table>
      <p>Google Analytics se configura con el modo de consentimiento: sin tu permiso no se carga, y la publicidad personalizada está siempre desactivada. Más información sobre el tratamiento de datos en la <Link href="/politica-de-privacidad">política de privacidad</Link>.</p>
    </LegalPage>
  );
}

// Si existe una página publicada «politica-de-cookies» en el panel, sustituye a este contenido.
const SLUG = "politica-de-cookies";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG, (await draftMode()).isEnabled);
  return page ? cmsPageMetadata(page) : defaultMetadata;
}

export default async function PoliticaCookies() {
  const page = await getPage(SLUG, (await draftMode()).isEnabled);
  return page ? <CmsPage page={page} /> : <PoliticaCookiesDefault />;
}
