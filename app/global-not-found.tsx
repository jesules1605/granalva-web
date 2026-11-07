import type { Metadata } from "next";
import "./globals.css";
import { NotFoundView, notFoundMetadata } from "./components/not-found-view";

// La app tiene dos layouts raíz (web pública y panel de Payload), así que las URLs
// que no coinciden con ninguna ruta usan esta 404 global (documentación de Next:
// file-conventions/not-found, «global-not-found.js»). Debe devolver <html> completo.
export const metadata: Metadata = notFoundMetadata;

export default function GlobalNotFound() {
  return (
    <html lang="es">
      <body className="antialiased">
        <NotFoundView />
      </body>
    </html>
  );
}
