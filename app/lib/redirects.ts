// Redirecciones 301 desde la web WordPress actual (page-sitemap.xml, 7 nov 2026).
// Cada URL antigua va a su equivalente; nunca se envía todo a portada.
// Se importarán a la colección `redirects` de Payload (fase 8).
// `pendingDestination`: la página nueva aún no existe; se activará al crearla.

export type LegacyRedirect = { from: string; to: string; status: 301; active: boolean; note?: string };

export const legacyRedirects: LegacyRedirect[] = [
  { from: "/servicios-de-limpieza-granada", to: "/servicios", status: 301, active: true },
  { from: "/sobre-nosotros", to: "/sobre-nosotros", status: 301, active: true, note: "Mismo slug: la página existe; /sobre-nosotros/ → 301 por la barra final (proxy.ts)." },
  { from: "/contacto", to: "/contacto", status: 301, active: true, note: "Mismo slug: la página existe; /contacto/ → 301 por la barra final (proxy.ts)." },
  { from: "/aviso-legal", to: "/aviso-legal", status: 301, active: false, note: "Mismo slug: fase 7 (textos legales revisados)." },
  { from: "/politica-de-privacidad", to: "/politica-de-privacidad", status: 301, active: false, note: "Mismo slug: fase 7." },
  { from: "/politica-de-cookies", to: "/politica-de-cookies", status: 301, active: false, note: "Mismo slug: fase 7." },
  { from: "/declaracion-de-accesibilidad", to: "/declaracion-de-accesibilidad", status: 301, active: false, note: "Mismo slug: fase 7." },
];
