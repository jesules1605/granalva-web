"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { pageInfo, SIERRA_NEVADA_SLUG, type AnalyticsEvent } from "../../lib/analytics/events";
import { CONSENT_EVENT, hasAnalyticsConsent, syncInternalFlag, track } from "../../lib/analytics/client";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export const ATTRIBUTION_KEY = "granalva-atribucion";

/**
 * Primera página y origen de la sesión, para la atribución interna de las solicitudes.
 * Se guarda en sessionStorage solo con consentimiento de analítica; sin él, el
 * formulario usa únicamente la página y la URL actuales.
 */
function captureFirstTouch() {
  if (!hasAnalyticsConsent()) return;
  try {
    if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;
    const params = new URLSearchParams(location.search);
    const touch: Record<string, string> = { paginaEntrada: location.pathname, referrer: document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer : "" };
    for (const key of UTM_KEYS) if (params.get(key)) touch[key] = params.get(key) ?? "";
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(touch));
  } catch {
    /* almacenamiento bloqueado */
  }
}

/** Ubicación del botón: atributo explícito o zona de la página. */
function ctaLocation(element: Element) {
  const explicit = element.closest("[data-cta-location]")?.getAttribute("data-cta-location");
  if (explicit) return explicit;
  if (element.closest(".mobile-nav, [data-mobile-nav]")) return "mobile_menu";
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  const section = element.closest("section[id], section[class]");
  return section?.id || section?.className.toString().split(/\s+/)[0] || "content";
}

type Classified = { event: AnalyticsEvent; params: Record<string, unknown> } | null;

/** Decide qué evento corresponde a un clic (atributos estables primero, después el tipo de enlace). */
export function classifyClick(element: Element, path: string): Classified {
  const target = element.closest("[data-analytics-event], a[href], button");
  if (!target) return null;
  const info = pageInfo(path);
  const href = target.getAttribute("href") ?? "";
  const params: Record<string, unknown> = {
    cta_location: ctaLocation(target),
    service_slug: target.closest("[data-service]")?.getAttribute("data-service") ?? info.service_slug,
    audience_type: target.closest("[data-audience]")?.getAttribute("data-audience") ?? info.audience_type,
    campaign_name: target.closest("[data-campaign]")?.getAttribute("data-campaign") ?? undefined,
    page_type: info.page_type,
  };
  const explicit = target.getAttribute("data-analytics-event") as AnalyticsEvent | null;
  if (explicit) return { event: explicit, params: { ...params, conversion_type: explicit === "app_order_click" ? "app_order" : undefined } };
  if (target.tagName !== "A") return null;
  if (href.startsWith("tel:")) return { event: "phone_click", params: { ...params, conversion_type: "call" } };
  if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) return { event: "whatsapp_click", params: { ...params, conversion_type: "whatsapp" } };
  if (href.startsWith("mailto:")) return { event: "email_click", params };
  if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(href)) return { event: "map_click", params };
  if (/#colada\b/.test(href)) return { event: "order_cta_click", params: { ...params, audience_type: "particular", service_slug: "lavanderia-domicilio-granada" } };
  let url: URL | null = null;
  try {
    url = new URL(href, location.origin);
  } catch {
    return null;
  }
  if (url.origin !== location.origin) return null;
  const requestedService = url.searchParams.get("servicio");
  if (url.pathname.replace(/\/$/, "") === "/contacto" || url.hash === "#contacto" || url.hash === "#presupuesto" || requestedService) {
    const service = requestedService ?? params.service_slug;
    return { event: "quote_cta_click", params: { ...params, service_slug: service, audience_type: service === "lavanderia-domicilio-granada" ? "particular" : params.audience_type ?? "empresa" } };
  }
  return null;
}

/** Escucha global: vistas de página, desplazamiento, clics y campañas. Se monta una sola vez. */
export function AnalyticsListener({ pageType }: { pageType?: "not_found" } = {}) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  // Clics (un único manejador para toda la web, en fase de captura).
  useEffect(() => {
    syncInternalFlag();
    captureFirstTouch();
    const onClick = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      if (!element) return;
      const result = classifyClick(element, location.pathname);
      if (!result) return;
      track(result.event, result.params);
      if (result.event === "quote_cta_click" && (result.params.service_slug === SIERRA_NEVADA_SLUG || pageInfo(location.pathname).page_type === "sierra_nevada")) {
        track("sierra_nevada_quote_click", result.params);
      }
      if (result.params.campaign_name && result.event !== "campaign_cta_click" && (result.event === "quote_cta_click" || result.event === "order_cta_click")) {
        track("campaign_cta_click", result.params);
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Vista de página: una por ruta. Si el consentimiento llega después, se envía en ese momento.
  useEffect(() => {
    const send = () => {
      if (!hasAnalyticsConsent() || lastPath.current === pathname) return;
      lastPath.current = pathname;
      captureFirstTouch();
      const info = pageType ? { page_type: pageType } : pageInfo(pathname);
      track("page_view", { ...info, page_path: pathname });
      if (info.page_type === "service" || info.page_type === "sierra_nevada") {
        track("service_view", info);
        track(info.audience_type === "particular" ? "private_service_view" : "business_service_view", info);
      }
      if (info.page_type === "sierra_nevada") track("sierra_nevada_view", info);
      if (info.page_type === "blog_article") track("blog_article_view", info);
    };
    send();
    window.addEventListener(CONSENT_EVENT, send);
    return () => window.removeEventListener(CONSENT_EVENT, send);
  }, [pathname, pageType]);

  // Desplazamiento (50 % y 90 %) y campañas visibles, una vez por ruta.
  useEffect(() => {
    const fired = new Set<string>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const ratio = window.scrollY / max;
      for (const [threshold, event] of [[0.5, "scroll_50"], [0.9, "scroll_90"]] as const) {
        if (ratio >= threshold && !fired.has(event) && track(event, pageInfo(pathname))) fired.add(event);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const name = entry.target.getAttribute("data-campaign");
        if (entry.isIntersecting && name && !fired.has(`campaign:${name}`) && track("campaign_view", { campaign_name: name, cta_location: ctaLocation(entry.target), page_type: pageInfo(pathname).page_type })) fired.add(`campaign:${name}`);
      }
    }, { threshold: 0.5 });
    document.querySelectorAll("[data-campaign]").forEach((element) => observer.observe(element));
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
