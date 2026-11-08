import { NextResponse, type NextRequest } from "next/server";
import { goneUrls, legacyRedirects } from "./app/lib/redirects";

// Redirecciones permanentes en un solo salto (301), antes de renderizar:
//  1. www → dominio canónico sin www;
//  2. URLs antiguas de WordPress → su página equivalente;
//  3. barra final → sin barra final (WordPress usaba barra final).
// `skipTrailingSlashRedirect` (next.config.ts) evita que Next encadene su propio 308.
//  4. restos de WordPress sin valor (entrada de ejemplo, feeds) → 410 Gone;
//  5. redirecciones creadas en el panel (colección `redirects`), con caché de 60 s.
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

// Páginas y artículos publicados en el panel (caché de 60 s). Un slug desconocido se
// reescribe a una ruta inexistente para que responda la 404 diseñada (global-not-found):
// un notFound() lanzado dentro de la página produciría una 404 sin contenido.
const STATIC_ROUTES = new Set(["/", "/servicios", "/contacto", "/sobre-nosotros", "/referencias", "/blog", "/aviso-legal", "/politica-de-privacidad", "/politica-de-cookies", "/declaracion-de-accesibilidad"]);
let published = { pages: new Set<string>(), posts: new Set<string>() };
let publishedAt = 0;
let publishedLoading: Promise<void> | null = null;

async function loadPublished(origin: string) {
  if (!process.env.DATABASE_URL || Date.now() - publishedAt < 60_000) return;
  publishedLoading ??= (async () => {
    try {
      const get = async (collection: string) => {
        const response = await fetch(new URL(`/api/${collection}?limit=1000&depth=0&pagination=false&select[slug]=true&where[_status][equals]=published`, origin), { signal: AbortSignal.timeout(1500) });
        const data = (await response.json()) as { docs?: { slug?: string }[] };
        return new Set((data.docs ?? []).map((doc) => doc.slug ?? "").filter(Boolean));
      };
      const [pages, posts] = await Promise.all([get("pages"), get("posts")]);
      published = { pages, posts };
    } catch {
      // Panel no disponible: se mantiene la última lista.
    } finally {
      publishedAt = Date.now();
      publishedLoading = null;
    }
  })();
  await publishedLoading;
}

/** ¿La ruta corresponde a una página del panel o a un artículo inexistente? */
function isUnknownPanelRoute(path: string, preview: boolean) {
  if (preview || STATIC_ROUTES.has(path)) return false;
  const single = path.match(/^\/([a-z0-9-]+)$/);
  if (single) return !published.pages.has(single[1]);
  const post = path.match(/^\/blog\/([a-z0-9-]+)$/);
  if (post) return !published.posts.has(post[1]);
  return false;
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
  if (goneUrls.has(path)) {
    return new NextResponse('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Contenido retirado · Granalva</title><p>Este contenido ya no existe. <a href="/">Ir a Limpiezas Granalva</a>.</p></html>', {
      status: 410,
      headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }
  await loadCmsRules(request.nextUrl.origin);
  const { target, status } = resolve(path);

  const wrongHost = host === `www.${CANONICAL_HOST}`;
  if (target === pathname && !wrongHost) {
    await loadPublished(request.nextUrl.origin);
    if (isUnknownPanelRoute(path, request.cookies.has("__prerender_bypass"))) {
      return NextResponse.rewrite(new URL(`/_no-existe${path}`, request.url));
    }
    return NextResponse.next();
  }

  // URL estándar: NextURL conservaría la barra final del original.
  const destination = new URL(target.startsWith("https://") ? target : `${target}${search}`, wrongHost ? `https://${CANONICAL_HOST}` : request.url);
  return NextResponse.redirect(destination, status);
}

export const config = {
  // Sin recursos internos, API ni panel de administración.
  matcher: ["/((?!_next/|api/|admin|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|mp4|otf|woff2?|txt|xml)$).*)"],
};
