import { NextResponse, type NextRequest } from "next/server";
import { legacyRedirects } from "./app/lib/redirects";

// Redirecciones permanentes en un solo salto (301), antes de renderizar:
//  1. www → dominio canónico sin www;
//  2. URLs antiguas de WordPress → su página equivalente;
//  3. barra final → sin barra final (WordPress usaba barra final).
// `skipTrailingSlashRedirect` (next.config.ts) evita que Next encadene su propio 308.
// En la fase 8 este mapa se leerá también de la colección `redirects` de Payload.
const CANONICAL_HOST = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://limpiezasgranalva.com").host;
const legacy = new Map(legacyRedirects.filter((r) => r.active && r.from !== r.to).map((r) => [r.from, r.to]));

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const target = legacy.get(path) ?? path;

  const wrongHost = host === `www.${CANONICAL_HOST}`;
  if (target === pathname && !wrongHost) return NextResponse.next();

  // URL estándar: NextURL conservaría la barra final del original.
  const destination = new URL(`${target}${search}`, wrongHost ? `https://${CANONICAL_HOST}` : request.url);
  return NextResponse.redirect(destination, 301);
}

export const config = {
  // Sin recursos internos, API ni panel de administración.
  matcher: ["/((?!_next/|api/|admin|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|mp4|otf|woff2?|txt|xml)$).*)"],
};
