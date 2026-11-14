"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { CONSENT_COOKIE, CONSENT_EVENT, CONSENT_VERSION, eventId, isProductionHost, readConsent, type ConsentChoice } from "../lib/analytics/client";

// Consentimiento de cookies (RGPD, LSSI-CE art. 22.2 y guía de la AEPD de 2023):
// - Sin elección no se carga ninguna herramienta opcional (Consent Mode v2 en modo básico:
//   Google Tag Manager, GA4 y Microsoft Clarity no existen en la página hasta aceptar).
// - «Aceptar», «Rechazar» y «Configurar» en la primera capa, con el mismo peso visual.
// - La elección se puede cambiar o retirar en cualquier momento (pie y política de cookies).
// - Cada elección se registra como prueba técnica (identificador aleatorio, versión,
//   fecha y decisión; sin IP ni datos personales) en /api/consentimiento.
// - Publicidad: siempre denegada. Granalva no usa Google Ads ni remarketing.
// - Cloudflare Web Analytics no usa cookies ni identificadores y va aparte (CloudflareBeacon).
const OPEN_EVENT = "granalva:cookie-settings";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "";
const OPTIONAL_TOOLS = [GTM_ID ? "Google Analytics" : "", CLARITY_ID ? "Microsoft Clarity" : ""].filter(Boolean);

function saveChoice(analytics: boolean): ConsentChoice {
  const choice: ConsentChoice = { v: CONSENT_VERSION, id: readConsent()?.id ?? eventId(), analytics, date: new Date().toISOString() };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(choice))}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${secure}`;
  // Prueba técnica del consentimiento (no bloquea la navegación).
  const body = JSON.stringify({ id: choice.id, analytics, version: CONSENT_VERSION, path: location.pathname, tools: OPTIONAL_TOOLS });
  try {
    if (!navigator.sendBeacon?.("/api/consentimiento", new Blob([body], { type: "application/json" }))) {
      void fetch("/api/consentimiento", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
    }
  } catch {
    /* sin red: la cookie sigue siendo válida */
  }
  return choice;
}

/** Borra las cookies de Google Analytics (_ga*) y Microsoft Clarity (_clck, _clsk, CLID). */
function deleteAnalyticsCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of document.cookie.split("; ").map((item) => item.split("=")[0])) {
    if (!/^(_ga|_gid|_gat|_clck|_clsk|CLID)/.test(name)) continue;
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
  }
}

/** Abre el panel de configuración desde cualquier parte (pie, política de cookies). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CookieSettingsButton({ className, children = "Configurar cookies" }: { className?: string; children?: React.ReactNode }) {
  return <button type="button" className={className ?? "link-button"} onClick={openCookieSettings}>{children}</button>;
}

type ToolWindow = Window & { gtag?: (...args: unknown[]) => void; clarity?: (...args: unknown[]) => void };

export function CookieConsent() {
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);
  const [production, setProduction] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [analyticsDraft, setAnalyticsDraft] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    // Lectura única de la cookie y del dominio al montar.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(stored);
    setProduction(isProductionHost());
    setAnalyticsDraft(Boolean(stored?.analytics));
    const open = () => {
      setAnalyticsDraft(Boolean(readConsent()?.analytics));
      setPanelOpen(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const decide = useCallback((analytics: boolean) => {
    const hadAnalytics = Boolean(readConsent()?.analytics);
    const saved = saveChoice(analytics);
    const w = window as ToolWindow;
    if (!analytics) {
      if (typeof w.gtag === "function") w.gtag("consent", "update", { analytics_storage: "denied" });
      if (typeof w.clarity === "function") w.clarity("consentv2", { ad_Storage: "denied", analytics_Storage: "denied" });
      deleteAnalyticsCookies();
    }
    setChoice(saved);
    setPanelOpen(false);
    window.dispatchEvent(new Event(CONSENT_EVENT));
    // Al retirar el consentimiento se recarga para descargar por completo GTM y Clarity.
    if (hadAnalytics && !analytics) location.reload();
  }, []);

  // Sin herramientas opcionales, o fuera del dominio definitivo, no hay nada que consentir.
  if (!OPTIONAL_TOOLS.length || !hydrated || choice === undefined || !production) return null;
  const showBanner = choice === null || panelOpen;
  const load = Boolean(choice?.analytics);

  return (
    <>
      {load && GTM_ID ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted',functionality_storage:'granted',security_storage:'granted'});
gtag('set','ads_data_redaction',true);
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      ) : null}
      {load && CLARITY_ID ? (
        <Script id="ms-clarity-init" strategy="lazyOnload">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");
window.clarity('consentv2',{ad_Storage:'denied',analytics_Storage:'granted'});`}
        </Script>
      ) : null}
      {showBanner ? (
        <section className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-text">
          <h2 id="cookie-title">Cookies en esta web</h2>
          <p id="cookie-text">
            Usamos cookies técnicas necesarias y, solo si lo aceptas, cookies de analítica ({OPTIONAL_TOOLS.join(" y ")}) para saber de forma agregada cómo se usa la web y mejorarla. No usamos publicidad.
            {" "}<Link href="/politica-de-cookies">Política de cookies</Link>.
          </p>
          {panelOpen ? (
            <fieldset className="cookie-banner__options">
              <legend className="visually-hidden">Preferencias de cookies</legend>
              <label><input type="checkbox" checked disabled /> Técnicas necesarias <small>(siempre activas)</small></label>
              <label><input type="checkbox" checked={analyticsDraft} onChange={(event) => setAnalyticsDraft(event.target.checked)} /> Analítica ({OPTIONAL_TOOLS.join(" y ")})</label>
            </fieldset>
          ) : null}
          <div className="cookie-banner__actions">
            <button type="button" className="button button--outline-dark" onClick={() => decide(false)}>Rechazar</button>
            {panelOpen ? (
              <button type="button" className="button button--outline-dark" onClick={() => decide(analyticsDraft)}>Guardar selección</button>
            ) : (
              <button type="button" className="button button--outline-dark" onClick={() => setPanelOpen(true)}>Configurar</button>
            )}
            <button type="button" className="button button--outline-dark" onClick={() => decide(true)}>Aceptar</button>
          </div>
        </section>
      ) : null}
    </>
  );
}

/**
 * Cloudflare Web Analytics: medición agregada sin cookies ni identificadores
 * (visitas, páginas, referentes, país, dispositivo y Core Web Vitals). Solo en el
 * dominio definitivo. Funciona aunque el DNS no esté en Cloudflare (fragmento JS).
 */
export function CloudflareBeacon() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;
  const [production, setProduction] = useState(false);
  // Comprobación única del dominio al montar.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setProduction(isProductionHost()), []);
  if (!token || !production) return null;
  return <Script src="https://static.cloudflareinsights.com/beacon.min.js" strategy="afterInteractive" data-cf-beacon={JSON.stringify({ token, spa: true })} />;
}
