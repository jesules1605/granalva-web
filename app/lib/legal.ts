import type { Metadata } from "next";
import type { Crumb } from "./seo";
import { absoluteUrl } from "./site";

/** Fecha de la última revisión de los textos legales de la nueva web. */
export const LEGAL_UPDATED = "2026-11-08";

/** Metadatos de las páginas legales: canónicas, accesibles, sin indexar (no aportan búsqueda). */
export const legalMetadata = (path: string, title: string, description: string): Metadata => ({
  title: { absolute: `${title} | Limpiezas Granalva` },
  description,
  alternates: { canonical: absoluteUrl(path) },
  robots: { index: false, follow: true },
});

export const legalCrumbs = (path: string, name: string): Crumb[] => [
  { name: "Inicio", path: "/" },
  { name, path },
];
