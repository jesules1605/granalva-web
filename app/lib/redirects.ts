// Redirecciones 301 desde la web WordPress actual (inventario: docs/MIGRACION-WORDPRESS.md
// y docs/redirecciones-wordpress.csv, 8 nov 2026). Cada URL antigua va a su equivalente;
// nunca se envía todo a portada. Las redirecciones nuevas se crean en el panel (colección
// «redirects»); este mapa fijo cubre las URLs heredadas de WordPress.

export type LegacyRedirect = { from: string; to: string; status: 301; active: boolean; note?: string };

export const legacyRedirects: LegacyRedirect[] = [
  { from: "/servicios-de-limpieza-granada", to: "/servicios", status: 301, active: true },
  { from: "/inicio", to: "/", status: 301, active: true, note: "WordPress ya redirigía /inicio/ a la portada." },
  { from: "/sobre-nosotros", to: "/sobre-nosotros", status: 301, active: true, note: "Mismo slug: la página existe; /sobre-nosotros/ → 301 por la barra final (proxy.ts)." },
  { from: "/contacto", to: "/contacto", status: 301, active: true, note: "Mismo slug: la página existe; /contacto/ → 301 por la barra final (proxy.ts)." },
  { from: "/aviso-legal", to: "/aviso-legal", status: 301, active: true, note: "Mismo slug: la página existe; /aviso-legal/ → 301 por la barra final." },
  { from: "/politica-de-privacidad", to: "/politica-de-privacidad", status: 301, active: true, note: "Mismo slug: la página existe; la barra final se resuelve con 301." },
  { from: "/politica-de-cookies", to: "/politica-de-cookies", status: 301, active: true, note: "Mismo slug: la página existe; la barra final se resuelve con 301." },
  { from: "/declaracion-de-accesibilidad", to: "/declaracion-de-accesibilidad", status: 301, active: true, note: "Mismo slug: la página existe; la barra final se resuelve con 301." },
];

/**
 * Restos de WordPress sin equivalente ni valor (entrada de ejemplo, feeds vacíos):
 * responden 410 Gone para que los buscadores los retiren, en lugar de redirigirlos a portada.
 */
export const goneUrls = new Set(["/hello-world", "/feed", "/comments/feed", "/hello-world/feed", "/referencias"]);
