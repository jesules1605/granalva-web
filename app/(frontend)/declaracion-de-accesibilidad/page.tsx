import { LegalPage } from "../../components/legal-page";
import { LEGAL_UPDATED, legalCrumbs, legalMetadata } from "../../lib/legal";
import { BUSINESS } from "../../lib/site";

export const metadata = legalMetadata("/declaracion-de-accesibilidad", "Declaración de accesibilidad", "Compromiso de accesibilidad de la web de Limpiezas Granalva, nivel de conformidad con WCAG 2.2 y cómo comunicar cualquier barrera.");

export default function DeclaracionAccesibilidad() {
  return (
    <LegalPage title="Declaración de accesibilidad" crumbs={legalCrumbs("/declaracion-de-accesibilidad", "Accesibilidad")} updatedAt={LEGAL_UPDATED}>
      <p>{BUSINESS.name} quiere que cualquier persona pueda informarse y pedir presupuesto en esta web, con independencia de sus capacidades o del dispositivo que use.</p>
      <h2>Nivel de conformidad</h2>
      <p>La web se ha diseñado con el objetivo de cumplir el nivel AA de las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2. Entre otras medidas:</p>
      <ul>
        <li>Estructura de encabezados, migas de navegación y enlaces descriptivos.</li>
        <li>Navegación completa con teclado, foco visible y menú móvil accesible.</li>
        <li>Contraste de color revisado y textos alternativos en las imágenes.</li>
        <li>Formularios con etiquetas, mensajes de error asociados y confirmación anunciada a los lectores de pantalla.</li>
        <li>Respeto de la preferencia de movimiento reducido: el vídeo y los carruseles se detienen o pueden pausarse.</li>
      </ul>
      <p>La accesibilidad se comprueba con revisiones automáticas (Lighthouse y axe) y manuales en cada cambio relevante.</p>
      <h2>Comunicar una barrera</h2>
      <p>Si encuentras algún problema para acceder a un contenido, escríbenos a <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a> o llámanos al <a href={`tel:${BUSINESS.phoneE164}`}>{BUSINESS.phoneDisplay}</a>. Te daremos la información por otro medio y corregiremos el problema.</p>
    </LegalPage>
  );
}
