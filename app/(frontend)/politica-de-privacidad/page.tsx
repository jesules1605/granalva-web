import { draftMode } from "next/headers";
import { CmsPage, cmsPageMetadata } from "../../components/cms-page";
import { getPage } from "../../lib/cms";
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "../../components/legal-page";
import { LEGAL_UPDATED, legalCrumbs, legalMetadata } from "../../lib/legal";
import { BUSINESS } from "../../lib/site";

const defaultMetadata = legalMetadata("/politica-de-privacidad", "Política de privacidad", "Cómo trata Limpiezas Granalva los datos de las solicitudes de presupuesto y contacto: responsable, finalidad, base legal, conservación y derechos.");

function PoliticaPrivacidadDefault() {
  return (
    <LegalPage title="Política de privacidad" crumbs={legalCrumbs("/politica-de-privacidad", "Política de privacidad")} updatedAt={LEGAL_UPDATED}>
      <p>Esta política explica cómo tratamos los datos personales que nos facilitas a través de esta web, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).</p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Responsable:</strong> {BUSINESS.legalOwner} ({BUSINESS.name})</li>
        <li><strong>NIF:</strong> {BUSINESS.legal.nif}</li>
        <li><strong>Domicilio:</strong> {BUSINESS.legal.address}</li>
        <li><strong>Contacto:</strong> <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> · <a href={`tel:${BUSINESS.phoneE164}`}>{BUSINESS.phoneDisplay}</a></li>
      </ul>

      <h2>2. Qué datos tratamos y para qué</h2>
      <table>
        <thead><tr><th>Tratamiento</th><th>Datos</th><th>Finalidad</th><th>Base legal</th></tr></thead>
        <tbody>
          <tr>
            <td>Solicitudes de presupuesto y contacto (formularios)</td>
            <td>Nombre, empresa, teléfono, correo, localidad, tipo de cliente, servicio, volumen, frecuencia, mensaje y página desde la que se envía</td>
            <td>Responder a tu solicitud, estudiar tu caso y preparar el presupuesto</td>
            <td>Tu consentimiento (art. 6.1.a RGPD) y la aplicación de medidas precontractuales a petición tuya (art. 6.1.b)</td>
          </tr>
          <tr>
            <td>Seguridad del formulario</td>
            <td>Dirección IP y datos técnicos del envío</td>
            <td>Evitar envíos automáticos, abusos y duplicados</td>
            <td>Interés legítimo en proteger la web (art. 6.1.f)</td>
          </tr>
          <tr>
            <td>Correo y teléfono</td>
            <td>Los datos que nos facilites al escribirnos o llamarnos</td>
            <td>Atender tu consulta</td>
            <td>Consentimiento y medidas precontractuales</td>
          </tr>
          <tr>
            <td>Analítica web (solo si la aceptas)</td>
            <td>Datos de navegación seudonimizados (cookies de Google Analytics)</td>
            <td>Conocer de forma agregada cómo se usa la web</td>
            <td>Tu consentimiento, revocable en <Link href="/politica-de-cookies">Configurar cookies</Link></td>
          </tr>
        </tbody>
      </table>
      <p>No enviamos comunicaciones comerciales automáticas ni tomamos decisiones automatizadas con tus datos. Los campos obligatorios del formulario están marcados: sin ellos no podemos atender la solicitud.</p>

      <h2>3. Cuánto tiempo conservamos los datos</h2>
      <p>Las solicitudes que no den lugar a una relación comercial se conservan un máximo de 18 meses desde el último contacto, o hasta que pidas su supresión. Si contratas un servicio, los datos se conservan mientras dure la relación y, después, durante los plazos legales de prescripción y obligaciones fiscales. Los envíos identificados como spam se eliminan.</p>

      <h2>4. Destinatarios y encargados del tratamiento</h2>
      <p>No cedemos tus datos a terceros salvo obligación legal. Para que la web funcione, algunos proveedores tratan datos por cuenta de {BUSINESS.name} como encargados del tratamiento, con contrato y garantías adecuadas:</p>
      <ul>
        <li>Alojamiento de la web y de los archivos: Vercel Inc.</li>
        <li>Base de datos donde se registran las solicitudes: proveedor de base de datos en la nube contratado para la web.</li>
        <li>Envío del aviso interno por correo electrónico: proveedor de correo de {BUSINESS.name}.</li>
        <li>Verificación antispam del formulario (cuando está activa): Cloudflare, Inc. (Turnstile).</li>
        <li>Analítica, solo con tu consentimiento: Google Ireland Limited (Google Analytics).</li>
      </ul>
      <p>Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En ese caso, la transferencia se ampara en el Marco de Privacidad de Datos UE-EE. UU. o en las cláusulas contractuales tipo de la Comisión Europea.</p>

      <h2>5. Tus derechos</h2>
      <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, y retirar tu consentimiento en cualquier momento, escribiendo a <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> o al domicilio indicado, con el asunto «Protección de datos». Podemos pedirte que acredites tu identidad. Retirar el consentimiento no afecta a la licitud del tratamiento anterior.</p>
      <p>Si consideras que no hemos atendido correctamente tus derechos, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="noopener" target="_blank">www.aepd.es</a>).</p>

      <h2>6. Seguridad</h2>
      <p>La web funciona solo con conexión cifrada (HTTPS). Las solicitudes solo son accesibles para las personas autorizadas de {BUSINESS.name}, con usuarios personales, roles y bloqueo ante intentos de acceso repetidos.</p>

      <h2>7. Menores</h2>
      <p>Los servicios de la web se dirigen a personas mayores de edad. No tratamos conscientemente datos de menores de 14 años.</p>

      <h2>8. Cambios</h2>
      <p>Podemos actualizar esta política para adaptarla a cambios legales o del servicio. La fecha de la última actualización figura al principio de la página.</p>
    </LegalPage>
  );
}

// Si existe una página publicada «politica-de-privacidad» en el panel, sustituye a este contenido.
const SLUG = "politica-de-privacidad";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG, (await draftMode()).isEnabled);
  return page ? cmsPageMetadata(page) : defaultMetadata;
}

export default async function PoliticaPrivacidad() {
  const page = await getPage(SLUG, (await draftMode()).isEnabled);
  return page ? <CmsPage page={page} /> : <PoliticaPrivacidadDefault />;
}
