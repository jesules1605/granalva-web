import Link from "next/link";
import { LegalPage } from "../../components/legal-page";
import { LEGAL_UPDATED, legalCrumbs, legalMetadata } from "../../lib/legal";
import { BUSINESS, SITE_DOMAIN } from "../../lib/site";

export const metadata = legalMetadata("/aviso-legal", "Aviso legal", "Aviso legal y condiciones de uso de la web de Limpiezas Granalva: titular, condiciones, responsabilidad y propiedad intelectual.");

export default function AvisoLegal() {
  return (
    <LegalPage title="Aviso legal y condiciones de uso" crumbs={legalCrumbs("/aviso-legal", "Aviso legal")} updatedAt={LEGAL_UPDATED}>
      <h2>1. Información general</h2>
      <p>En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que la titular de este sitio web ({SITE_DOMAIN}) es:</p>
      <ul>
        <li><strong>Titular:</strong> {BUSINESS.legalOwner}, que opera con el nombre comercial «{BUSINESS.name}».</li>
        <li><strong>NIF:</strong> {BUSINESS.legal.nif}</li>
        <li><strong>Domicilio:</strong> {BUSINESS.legal.address}</li>
        <li><strong>Teléfono:</strong> <a href={`tel:${BUSINESS.phoneE164}`}>{BUSINESS.phoneDisplay}</a></li>
        <li><strong>Correo electrónico:</strong> <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></li>
      </ul>

      <h2>2. Objeto y condiciones de uso</h2>
      <p>Este aviso regula el acceso y el uso de la web, que informa sobre los servicios de limpieza profesional, lavandería con recogida y entrega y renting textil de {BUSINESS.name} y permite solicitar presupuesto. El acceso es libre y gratuito. Quien navega por la web (en adelante, el usuario) acepta estas condiciones y se compromete a usar la web y sus contenidos de forma lícita, sin perjudicar a {BUSINESS.name} ni a terceros.</p>
      <p>El usuario es responsable de la veracidad de los datos que facilita en los formularios. {BUSINESS.name} puede modificar en cualquier momento la presentación, la configuración y los contenidos de la web.</p>
      <p>La información de la web tiene carácter orientativo. Las condiciones de cada servicio (alcance, frecuencia, plazos y precio) se fijan en la propuesta o el contrato correspondiente.</p>

      <h2>3. Responsabilidad</h2>
      <p>{BUSINESS.name} procura que la web funcione correctamente y que su información sea exacta y esté actualizada, pero no garantiza la ausencia de interrupciones o errores ni responde de los daños derivados de un uso indebido de la web, de fallos técnicos ajenos o de la introducción de programas maliciosos por terceros.</p>

      <h2>4. Enlaces</h2>
      <p>Los enlaces a sitios de terceros se ofrecen solo como referencia. {BUSINESS.name} no controla ni responde de sus contenidos. Quien quiera enlazar a esta web puede hacerlo a la portada o a cualquier página, sin reproducir sus contenidos ni dar a entender una relación que no exista.</p>

      <h2>5. Propiedad intelectual e industrial</h2>
      <p>Los textos, el diseño, el logotipo, las fotografías y los vídeos de la web pertenecen a {BUSINESS.name} o se usan con autorización de sus titulares. Queda prohibida su reproducción, distribución o comunicación pública con fines comerciales sin autorización. La tipografía Granaina es obra de Sergio Arredondo y se utiliza conforme a su licencia. Los logotipos del programa Kit Digital, del Plan de Recuperación, Transformación y Resiliencia y de la Unión Europea (NextGenerationEU) se muestran por la obligación de publicidad de la ayuda recibida.</p>

      <h2>6. Protección de datos y cookies</h2>
      <p>El tratamiento de los datos personales se explica en la <Link href="/politica-de-privacidad">política de privacidad</Link> y el uso de cookies en la <Link href="/politica-de-cookies">política de cookies</Link>.</p>

      <h2>7. Legislación aplicable y jurisdicción</h2>
      <p>Estas condiciones se rigen por la legislación española. Cualquier controversia se someterá a los juzgados y tribunales que correspondan conforme a derecho; cuando el usuario sea consumidor, los de su domicilio.</p>
    </LegalPage>
  );
}
