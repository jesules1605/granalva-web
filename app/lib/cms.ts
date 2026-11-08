import "server-only";
import config from "@payload-config";
import { cache } from "react";
import { getPayload, type Payload } from "payload";
import type { Media, Post } from "../../payload-types";
import { clientLogos as defaultClientLogos, team as defaultTeam, verifiedReviews, type Review } from "./home-content";
import { serviceBySlug, type ServicePage } from "./services";

// Lectura del contenido gestionado en el panel (Payload) para la web pública.
// Regla: si la base de datos no está configurada o no responde, la web usa los
// valores por defecto revisados del código. Nunca se rompe una página por el CMS.

const TIMEOUT_MS = 4000;

const getClient = cache(async (): Promise<Payload | null> => {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) return null;
  try {
    return await withTimeout(getPayload({ config }));
  } catch (error) {
    console.warn("[cms] Payload no disponible; se usan los valores por defecto.", error instanceof Error ? error.message : "");
    return null;
  }
});

function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([promise, new Promise<T>((_, reject) => setTimeout(() => reject(new Error("tiempo de espera agotado")), TIMEOUT_MS))]);
}

async function safe<T>(fallback: T, run: (payload: Payload) => Promise<T>): Promise<T> {
  const payload = await getClient();
  if (!payload) return fallback;
  try {
    return await withTimeout(run(payload));
  } catch (error) {
    console.warn("[cms] Consulta fallida; se usa el valor por defecto.", error instanceof Error ? error.message : "");
    return fallback;
  }
}

const mediaOf = (value: unknown): Media | null => (value && typeof value === "object" && "url" in value ? (value as Media) : null);

/** Posición focal de Payload (porcentajes) → object-position CSS. */
export const focalOf = (media: Media | null) =>
  media && typeof media.focalX === "number" && typeof media.focalY === "number" ? `${media.focalX}% ${media.focalY}%` : undefined;

/** Reseñas visibles (sin las marcadas como vinculadas a la empresa). Sin datos en el panel: las verificadas del código. */
export const getReviews = cache(() =>
  safe<Review[]>(verifiedReviews, async (payload) => {
    const result = await payload.find({ collection: "reviews", where: { and: [{ visible: { equals: true } }, { relatedToCompany: { not_equals: true } }] }, sort: "-date", limit: 30, depth: 0 });
    if (result.docs.length === 0) return verifiedReviews;
    return result.docs.map((doc) => ({ quote: doc.quote, author: doc.author, date: doc.date.slice(0, 10), platform: doc.platform as Review["platform"] }));
  }),
);

export type TeamMember = { name: string; role: string; text?: string; photo?: { url: string; alt: string; width: number; height: number; focal?: string } };

export const getTeam = cache(() =>
  safe<TeamMember[]>(
    defaultTeam.map(({ name, role, text }) => ({ name, role, text })),
    async (payload) => {
      const result = await payload.find({ collection: "team", where: { visible: { equals: true } }, sort: "order", limit: 30, depth: 1 });
      if (result.docs.length === 0) return defaultTeam.map(({ name, role, text }) => ({ name, role, text }));
      return result.docs.map((doc) => {
        const media = doc.photoConsent ? mediaOf(doc.photo) : null;
        return {
          name: doc.name,
          role: doc.role,
          text: doc.text ?? undefined,
          photo: media?.url ? { url: media.url, alt: media.alt, width: media.width ?? 800, height: media.height ?? 800, focal: focalOf(media) } : undefined,
        };
      });
    },
  ),
);

/** Logotipos con autorización registrada y visibles. */
export const getClientLogos = cache(() =>
  safe(defaultClientLogos, async (payload) => {
    const result = await payload.find({ collection: "client-logos", where: { and: [{ visible: { equals: true } }, { authorized: { equals: true } }] }, sort: "order", limit: 40, depth: 1 });
    return result.docs.flatMap((doc) => {
      const media = mediaOf(doc.logo);
      return media?.url ? [{ name: doc.name, src: media.url, width: media.width ?? 400, height: media.height ?? 160 }] : [];
    });
  }),
);

/** Servicio con los ajustes publicados en el panel aplicados sobre el contenido base. */
export const getService = cache((slug: string) =>
  safe<ServicePage | undefined>(serviceBySlug[slug], async (payload) => {
    const base = serviceBySlug[slug];
    if (!base) return base;
    const result = await payload.find({ collection: "services", where: { slug: { equals: slug } }, limit: 1, depth: 1, draft: false });
    const doc = result.docs[0];
    if (!doc) return base;
    const hero = mediaOf(doc.heroImage);
    return {
      ...base,
      eyebrow: doc.eyebrow || base.eyebrow,
      tagline: doc.tagline || base.tagline,
      ctaLabel: doc.ctaLabel || base.ctaLabel,
      metaTitle: doc.metaTitle ? `${doc.metaTitle} | Granalva` : base.metaTitle,
      metaDescription: doc.metaDescription || base.metaDescription,
      summary: doc.summary || base.summary,
      faqs: doc.faqs && doc.faqs.length > 0 ? doc.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })) : base.faqs,
      ...(hero?.url ? { image: hero.url, imageAlt: hero.alt, imageFocal: focalOf(hero) ?? base.imageFocal } : {}),
      updatedAt: doc.updatedAt > base.updatedAt ? doc.updatedAt.slice(0, 10) : base.updatedAt,
    };
  }),
);

/** Artículos publicados (y no marcados como noindex para el sitemap si se pide). */
export const getPosts = cache((options: { indexableOnly?: boolean } = {}) =>
  safe<Post[]>([], async (payload) => {
    const result = await payload.find({
      collection: "posts",
      where: { and: [{ _status: { equals: "published" } }, ...(options.indexableOnly ? [{ noindex: { not_equals: true } }] : [])] },
      sort: "-publishedAt",
      limit: 100,
      depth: 1,
      draft: false,
    });
    return result.docs;
  }),
);

export const getPost = cache((slug: string, draft = false) =>
  safe<Post | null>(null, async (payload) => {
    const result = await payload.find({
      collection: "posts",
      where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
      limit: 1,
      depth: 1,
      draft,
      overrideAccess: draft,
    });
    return result.docs[0] ?? null;
  }),
);

/** Redirección gestionada en el panel para una ruta que no existe. */
export const getRedirect = cache((path: string) =>
  safe<{ to: string; type: string } | null>(null, async (payload) => {
    const result = await payload.find({ collection: "redirects", where: { from: { equals: path } }, limit: 1, depth: 0 });
    const doc = result.docs[0];
    return doc ? { to: doc.to, type: doc.type } : null;
  }),
);

export type Chrome = { navigation: { href: string; label: string }[] | null; ribbon: string[] | null; whatsapp: string | null };

/** Menú, marquesina y WhatsApp configurados en el panel (null = valor por defecto). */
export const getChrome = cache(() =>
  safe<Chrome>({ navigation: null, ribbon: null, whatsapp: null }, async (payload) => {
    const [navigation, settings] = await Promise.all([payload.findGlobal({ slug: "navigation", depth: 0 }), payload.findGlobal({ slug: "site-settings", depth: 0 })]);
    return {
      navigation: navigation.links && navigation.links.length > 0 ? navigation.links.map((link) => ({ href: link.href, label: link.label })) : null,
      ribbon: settings.ribbon && settings.ribbon.length > 0 ? settings.ribbon.map((item) => item.text) : null,
      whatsapp: settings.whatsapp || null,
    };
  }),
);
