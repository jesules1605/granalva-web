import "server-only";
import config from "@payload-config";
import { cache } from "react";
import { getPayload, type Payload } from "payload";
import type { Media, Page, Post } from "../../payload-types";
import { HOME_SECTIONS } from "../../cms/globals/HomePage";
import { BUSINESS } from "./site";
import { PHOTOS } from "./photos";
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

/** Rutas de medios relativas: válidas en preproducción y en el dominio final (Payload las genera absolutas con serverURL). */
const relativeMediaUrl = (url?: string | null) => (url ? url.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, "") : url);
const mediaOf = (value: unknown): Media | null => {
  if (!value || typeof value !== "object" || !("url" in value)) return null;
  const media = value as Media;
  return { ...media, url: relativeMediaUrl(media.url) ?? null };
};

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
export const getService = cache((slug: string, draft = false) =>
  safe<ServicePage | undefined>(serviceBySlug[slug], async (payload) => {
    const base = serviceBySlug[slug];
    if (!base) return base;
    const result = await payload.find({ collection: "services", where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] }, limit: 1, depth: 1, draft, overrideAccess: draft });
    const doc = result.docs[0];
    if (!doc) return base;
    const hero = mediaOf(doc.heroImage);
    const heroMobile = mediaOf(doc.heroImageMobile);
    return {
      ...base,
      eyebrow: doc.eyebrow || base.eyebrow,
      tagline: doc.tagline || base.tagline,
      ctaLabel: doc.ctaLabel || base.ctaLabel,
      metaTitle: doc.metaTitle ? `${doc.metaTitle} | Granalva` : base.metaTitle,
      metaDescription: doc.metaDescription || base.metaDescription,
      summary: doc.summary || base.summary,
      faqs: doc.faqs && doc.faqs.length > 0 ? doc.faqs.map((faq) => ({ question: faq.question, answer: faq.answer })) : base.faqs,
      ...(hero?.url ? { image: hero.url, imageSize: hero.width && hero.height ? { width: hero.width, height: hero.height } : undefined, imageAlt: doc.heroAlt || hero.alt, imageFocal: focalOf(hero) ?? base.imageFocal } : doc.heroAlt ? { imageAlt: doc.heroAlt } : {}),
      ...(heroMobile?.url && heroMobile.width && heroMobile.height ? { imageMobile: { src: heroMobile.url, width: heroMobile.width, height: heroMobile.height, focal: focalOf(heroMobile) } } : {}),
      heroOverlay: typeof doc.heroOverlay === "number" ? doc.heroOverlay : base.heroOverlay,
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

export type HeroImage = { src: string; width: number; height: number; focal: string };
export type HomeHeroData = {
  desktop: HeroImage;
  mobile: HeroImage;
  alt: string;
  overlay: number;
  zoom: boolean;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

/** Valores revisados para SEO (H1 y entradilla de la portada). */
export const DEFAULT_HOME_HERO: HomeHeroData = {
  desktop: { src: PHOTOS.granalvaBedroom.src, width: PHOTOS.granalvaBedroom.width, height: PHOTOS.granalvaBedroom.height, focal: "62% 45%" },
  mobile: { src: PHOTOS.granalvaBedroomMobile.src, width: PHOTOS.granalvaBedroomMobile.width, height: PHOTOS.granalvaBedroomMobile.height, focal: "50% 40%" },
  alt: PHOTOS.granalvaBedroom.alt,
  overlay: 70,
  zoom: false,
  eyebrow: "Empresa granadina · Equipo propio",
  titleLine1: "Empresa de limpieza y lavandería",
  titleLine2: "profesional en Granada",
  subtitle:
    "Servicios de limpieza para empresas, hoteles y apartamentos turísticos, lavandería profesional con recogida y entrega, renting textil y soluciones para particulares en Granada.",
  primary: { label: "Solicitar presupuesto empresarial", href: "#contacto" },
  secondary: { label: "Contratar lavandería profesional", href: "/servicios/lavanderia-profesional-granada" },
};

const heroImage = (value: unknown, fallback: HeroImage): HeroImage => {
  const media = mediaOf(value);
  return media?.url && media.width && media.height ? { src: media.url, width: media.width, height: media.height, focal: focalOf(media) ?? "50% 50%" } : fallback;
};

/** Portada publicada en el panel sobre los valores por defecto (borrador si hay vista previa). */
export const getHomeHero = cache((draft = false) =>
  safe<HomeHeroData>(DEFAULT_HOME_HERO, async (payload) => {
    const doc = await payload.findGlobal({ slug: "home-page", depth: 1, draft });
    const d = DEFAULT_HOME_HERO;
    const desktop = heroImage(doc.imageDesktop, d.desktop);
    const desktopMedia = mediaOf(doc.imageDesktop);
    return {
      desktop,
      mobile: heroImage(doc.imageMobile, doc.imageDesktop ? desktop : d.mobile),
      alt: doc.imageAlt || desktopMedia?.alt || d.alt,
      overlay: typeof doc.overlay === "number" ? doc.overlay : d.overlay,
      zoom: Boolean(doc.zoom),
      eyebrow: doc.eyebrow || d.eyebrow,
      titleLine1: doc.titleLine1 || d.titleLine1,
      titleLine2: doc.titleLine2 || d.titleLine2,
      subtitle: doc.subtitle || d.subtitle,
      primary: { label: doc.primaryLabel || d.primary.label, href: doc.primaryHref || d.primary.href },
      secondary: { label: doc.secondaryLabel || d.secondary.label, href: doc.secondaryHref || d.secondary.href },
    };
  }),
);

/** Página del panel por slug (solo publicadas; borradores únicamente en vista previa). */
export const getPage = cache((slug: string, draft = false) =>
  safe<Page | null>(null, async (payload) => {
    const result = await payload.find({
      collection: "pages",
      where: draft ? { slug: { equals: slug } } : { and: [{ slug: { equals: slug } }, { _status: { equals: "published" } }] },
      limit: 1,
      depth: 2,
      draft,
      overrideAccess: draft,
    });
    return result.docs[0] ?? null;
  }),
);

/** Páginas publicadas para el sitemap y la generación estática. */
export const getPublishedPages = cache(() =>
  safe<Pick<Page, "slug" | "updatedAt" | "showInSitemap" | "seo">[]>([], async (payload) => {
    const result = await payload.find({ collection: "pages", where: { _status: { equals: "published" } }, limit: 200, depth: 0, select: { slug: true, updatedAt: true, showInSitemap: true, seo: true } });
    return result.docs;
  }),
);

export type SiteSettingsData = {
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  areaServedLabel: string;
  footerTagline: string | null;
  years: number | null;
  figures: { value: string; label: string }[];
};

/** Datos de contacto y autoridad del panel sobre los del código (solo cifras verificadas). */
export const getSiteSettings = cache(() =>
  safe<SiteSettingsData>(
    { phoneDisplay: BUSINESS.phoneDisplay, phoneE164: BUSINESS.phoneE164, email: BUSINESS.email, areaServedLabel: BUSINESS.areaServedLabel, footerTagline: null, years: null, figures: [] },
    async (payload) => {
      const s = await payload.findGlobal({ slug: "site-settings", depth: 0 });
      return {
        phoneDisplay: s.phoneDisplay || BUSINESS.phoneDisplay,
        phoneE164: s.phoneE164 || BUSINESS.phoneE164,
        email: s.email || BUSINESS.email,
        areaServedLabel: s.areaServedLabel || BUSINESS.areaServedLabel,
        footerTagline: s.footerTagline || null,
        years: s.yearsVerified && s.yearsExperience && s.yearsSource ? s.yearsExperience : null,
        figures: (s.figures ?? []).filter((f) => f.verified && f.source).map((f) => ({ value: f.value, label: f.label })),
      };
    },
  ),
);

export type HomeSectionKey = (typeof HOME_SECTIONS)[number]["value"];
export type HomeConfig = {
  sections: { key: HomeSectionKey; heading?: string }[];
  seo: { metaTitle?: string; metaDescription?: string; ogImage?: string; noindex: boolean };
};

/** Orden, visibilidad y titulares de las secciones de la portada, y su SEO. */
export const getHomeConfig = cache((draft = false) =>
  safe<HomeConfig>({ sections: HOME_SECTIONS.map((s) => ({ key: s.value })), seo: { noindex: false } }, async (payload) => {
    const doc = await payload.findGlobal({ slug: "home-page", depth: 1, draft });
    const rows = doc.sections ?? [];
    const sections = rows.length
      ? rows.filter((row) => !row.hidden).map((row) => ({ key: row.section as HomeSectionKey, heading: row.heading || undefined }))
      : HOME_SECTIONS.map((s) => ({ key: s.value }));
    const og = mediaOf(doc.seo?.ogImage);
    return {
      sections,
      seo: {
        metaTitle: doc.seo?.metaTitle || undefined,
        metaDescription: doc.seo?.metaDescription || undefined,
        ogImage: og?.url || undefined,
        noindex: Boolean(doc.seo?.noindex && doc.seo?.noindexConfirm),
      },
    };
  }),
);

export type CampaignBlock = {
  label: string;
  title: string;
  text: string;
  points: { title: string; text: string }[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string } | null;
};

/** Campaña estacional activa (dentro de sus fechas) o null para usar el bloque por defecto. */
export const getActiveCampaign = cache(() =>
  safe<CampaignBlock | null>(null, async (payload) => {
    const now = new Date().toISOString();
    const result = await payload.find({
      collection: "campaigns",
      where: { and: [{ active: { equals: true } }, { _status: { equals: "published" } }, { or: [{ startDate: { exists: false } }, { startDate: { less_than_equal: now } }] }, { or: [{ endDate: { exists: false } }, { endDate: { greater_than_equal: now } }] }] },
      sort: "-priority",
      limit: 1,
      depth: 0,
    });
    const c = result.docs[0];
    if (!c) return null;
    return {
      label: c.label,
      title: c.title,
      text: c.text,
      points: (c.points ?? []).map((p) => ({ title: p.title, text: p.text })),
      primary: { label: c.primaryLabel, href: c.primaryHref },
      secondary: c.secondaryLabel && c.secondaryHref ? { label: c.secondaryLabel, href: c.secondaryHref } : null,
    };
  }),
);

/** Perfiles oficiales, horario y enlace de pedidos del panel. */
export const getBusinessExtras = cache(() =>
  safe<{ sameAs: string[]; openingHours: string | null; orderUrl: string | null }>({ sameAs: [], openingHours: null, orderUrl: null }, async (payload) => {
    const s = await payload.findGlobal({ slug: "site-settings", depth: 0 });
    return { sameAs: (s.social ?? []).map((item) => item.url), openingHours: s.openingHours || null, orderUrl: s.orderUrl || null };
  }),
);
