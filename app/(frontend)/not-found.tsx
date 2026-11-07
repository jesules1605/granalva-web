import type { Metadata } from "next";
import { NotFoundView, notFoundMetadata } from "../components/not-found-view";

export const metadata: Metadata = notFoundMetadata;

/** 404 dentro del sitio público (p. ej. /servicios/slug-inexistente). */
export default function NotFound() {
  return <NotFoundView />;
}
