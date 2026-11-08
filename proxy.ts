import { NextResponse, type NextRequest } from "next/server";
import { legacyRedirects } from "./app/lib/redirects";

// Redirecciones permanentes en un solo salto (301), antes de renderizar:
//  1. www → dominio canónico sin www;
//  2. URLs antiguas de WordPress → su página equivalente;
//  3. barra final → sin barra final (WordPress usaba barra final).
// `skipTrailingSlashRedirect` (next.config.ts) evita que Next encadene su propio 308.
//  4. redirecciones creadas en el panel (colección `redirects`), con caché de 60 s.
// Si un destino es a su vez origen de otra regla, se resuelve hasta el final:
// el visitante recibe siempre un único 301/308, sin cadenas ni bucles.
const CANONICAL_HOST = new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://limpiezasgranalva.com").host;
const legacy = new Map(legacyRedirects.filter((r) => r.active && r.from !== r.to).map((r) => [r.from, r.to]));

type CmsRule = { to: string; status: 301 | 308 };
let cmsRules: Map<string, CmsRule> = new Map();
let cmsLoadedAt = 0;
let cmsLoading: Promise<void> | null = null;

/** Carga las redirecciones del panel (sin base de datos no hay ninguna). */
async function loadCmsRules(origin: string) {
  if (!process.env.DATABASE_URL || Date.now() - cmsLoadedAt < 60_000) return;
  cmsLoading ??= (async () => {
    try {
      const response = await fetch(new URL("/api/redirects?limit=1000&depth=0&pagination=false", origin), { headers: { accept: "application/json" }, signal: AbortSignal.timeout(1500) });
      if (response.ok) {
        const data = (await response.json()) as { docs?: { from: string; to: string; type: string }[] };
        cmsRules = new Map((data.docs ?? []).map((doc) => [doc.from.replace(/\/+$/, "") || "/", { to: doc.to, status: doc.type === "308" ? 308 : 301 }]));
      }
    } catch {
      // Panel no disponible: se mantienen las reglas anteriores.
    } finally {
      cmsLoadedAt = Date.now();
      cmsLoading = null;
    }
  })();
  await cmsLoading;
}

/** Resuelve el destino final (máx. 5 saltos internos) para emitir una sola redirección. */
function resolve(path: string): { target: string; status: 301 | 308 } {
  let target = path;
  let status: 301 | 308 = 301;
  for (let hop = 0; hop < 5; hop++) {
    const next = legacy.get(target) ?? cmsRules.get(target)?.to;
    if (!next || next === target) break;
    if (hop === 0 && !legacy.has(target)) status = cmsRules.get(target)?.status ?? 301;
    target = next;
    if (target.startsWith("https://")) break;
  }
  return { target, status };
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  await loadCmsRules(request.nextUrl.origin);
  const { target, status } = resolve(path);

  const wrongHost = host === `www.${CANONICAL_HOST}`;
  if (target === pathname && !wrongHost) return NextResponse.next();

  // URL estándar: NextURL conservaría la barra final del original.
  const destination = new URL(target.startsWith("https://") ? target : `${target}${search}`, wrongHost ? `https://${CANONICAL_HOST}` : request.url);
  return NextResponse.redirect(destination, status);
}

export const config = {
  // Sin recursos internos, API ni panel de administración.
  matcher: ["/((?!_next/|api/|admin|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|mp4|otf|woff2?|txt|xml)$).*)"],
};
