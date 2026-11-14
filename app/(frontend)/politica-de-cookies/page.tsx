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
      <p>Las cookies son pequeños archivos que la web guarda en tu navegador. Esta web usa solo las cookies técnicas imprescindibles y, únicamente si las aceptas, cookies de analítica (Google Analytics y Microsoft Clarity). No usamos cookies publicitarias ni de redes sociales, ni hacemos publicidad personalizada.</p>

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
          <tr><td>_ga, _ga_*</td><td>Google Ireland Limited</td><td>Analítica, <strong>solo con tu consentimiento</strong>. Distingue visitas de forma seudónima para medir el uso de la web (Google Analytics 4, a través de Google Tag Manager).</td><td>Hasta 2 años</td></tr>
          <tr><td>_clck, _clsk, CLID, MUID</td><td>Microsoft Ireland Operations Limited</td><td>Analítica, <strong>solo con tu consentimiento</strong>. Microsoft Clarity: mapas de clics y de desplazamiento y grabaciones anónimas de la navegación para detectar problemas de uso. Los campos de los formularios se ocultan siempre y el panel de gestión no se graba.</td><td>De 1 día a 1 año</td></tr>
          <tr><td>granalva-atribucion (almacenamiento de sesión)</td><td>{BUSINESS.name}</td><td>Analítica propia, <strong>solo con tu consentimiento</strong>. Recuerda durante la visita la página por la que entraste y la campaña de origen, para saber qué canales generan solicitudes. No sale de la web.</td><td>Hasta cerrar el navegador</td></tr>
        </tbody>
      </table>
      <p>Google Analytics y Microsoft Clarity se cargan solo después de que aceptes la analítica (modo de consentimiento de Google en su versión básica). Si la rechazas o la retiras, no se cargan y se borran sus cookies. La publicidad personalizada está siempre desactivada.</p>
      <h2>Medición sin cookies</h2>
      <p>Además, usamos Cloudflare Web Analytics (Cloudflare, Inc.) para contar visitas de forma agregada y medir la velocidad de carga. No usa cookies ni almacena nada en tu navegador, no crea identificadores y no permite reconocerte entre visitas, por eso no requiere consentimiento. Más información en la <Link href="/politica-de-privacidad">política de privacidad</Link>.</p>
      <h2>Prueba de tu elección</h2>
      <p>Para poder demostrar tu decisión, guardamos un registro técnico con un identificador aleatorio (el mismo que contiene la cookie granalva_consent), la opción elegida, la versión del aviso, la página y la fecha. No incluye tu dirección IP ni ningún dato que te identifique. Se conserva 2 años.</p>
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
