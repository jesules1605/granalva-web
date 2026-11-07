// Datos globales de empresa y de indexación.
// Se trasladarán al global `site-settings` de Payload (fase 4). Deben coincidir
// exactamente con Google Business Profile y con el aviso legal (coherencia NAP).
import { SITE_URL } from "./services";

export const BUSINESS = {
  /** Nombre comercial. Debe ser idéntico al de Google Business Profile. */
  name: "Limpiezas Granalva",
  shortName: "Granalva",
  descriptor: "Servicio de limpieza y lavandería profesional",
  description:
    "Empresa granadina de limpieza profesional, lavandería con recogida y entrega y renting textil para empresas, alojamientos turísticos y particulares en Granada.",
  phoneDisplay: "744 488 964",
  phoneE164: "+34744488964",
  email: "info@limpiezasgranalva.com",
  /** Área de servicio real confirmada. No añadir municipios ni zonas sin confirmación. */
  areaServedLabel: "Granada y área metropolitana",
  areaServed: [
    { "@type": "City", name: "Granada" },
    { "@type": "AdministrativeArea", name: "Área metropolitana de Granada" },
  ],
  logo: "/granalva-logo.jpg",
  /**
   * Perfiles oficiales (Google Business Profile, redes sociales). Solo URLs reales
   * y verificadas; se publican en `sameAs`. Vacío hasta que el propietario las facilite.
   */
  sameAs: [] as string[],
} as const;

/**
 * URL del flujo de pedidos de lavandería. Mientras no exista un sistema de pedidos
 * real, el CTA «Hacer un pedido» lleva al selector de colada, que termina en el
 * formulario de solicitud de recogida (no simula compras ni pagos).
 */
export const ORDER_URL = process.env.NEXT_PUBLIC_ORDER_URL || "/#lavanderia";

/**
 * Indexación. Solo producción se indexa: cualquier preproducción debe definir
 * NEXT_PUBLIC_NOINDEX=true, y las previsualizaciones de Vercel se excluyen siempre.
 */
export const INDEXABLE = process.env.NEXT_PUBLIC_NOINDEX !== "true" && process.env.VERCEL_ENV !== "preview";

export const absoluteUrl = (path = "/") => (path === "/" ? SITE_URL : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);
