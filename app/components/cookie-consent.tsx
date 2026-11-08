"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

// Consentimiento de cookies (RGPD, LSSI-CE art. 22.2 y guía de la AEPD):
// - Sin elección, no se carga ninguna cookie opcional.
// - «Aceptar» y «Rechazar» tienen el mismo peso; «Configurar» permite elegir.
// - La elección se puede cambiar en cualquier momento (pie y política de cookies).
// - Google Analytics solo se carga tras aceptar la analítica, con Consent Mode v2
//   (anuncios siempre denegados). Al retirar el consentimiento se borran sus cookies.
const COOKIE = "granalva_consent";
const VERSION = 1;
const OPEN_EVENT = "granalva:cookie-settings";

type Choice = { v: number; analytics: boolean; date: string };

function readChoice(): Choice | null {
  const raw = document.cookie.split("; ").find((item) => item.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!raw) return null;
  try {
    const choice = JSON.parse(decodeURIComponent(raw)) as Choice;
    return choice.v === VERSION ? choice : null;
  } catch {
    return null;
  }
}

function saveChoice(analytics: boolean) {
  const value = encodeURIComponent(JSON.stringify({ v: VERSION, analytics, date: new Date().toISOString() }));
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${value}; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax${secure}`;
}

function deleteAnalyticsCookies() {
  const host = location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of document.cookie.split("; ").map((item) => item.split("=")[0])) {
    if (!name.startsWith("_ga")) continue;
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

type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

export function CookieConsent({ gaId }: { gaId?: string }) {
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [choice, setChoice] = useState<Choice | null | undefined>(undefined);
  const [panelOpen, setPanelOpen] = useState(false);
  const [analyticsDraft, setAnalyticsDraft] = useState(false);

  useEffect(() => {
    const stored = readChoice();
    // Lectura única de la cookie al montar (no hay suscripción externa que usar).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(stored);
    setAnalyticsDraft(Boolean(stored?.analytics));
    const open = () => {
      setAnalyticsDraft(Boolean(readChoice()?.analytics));
      setPanelOpen(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const decide = useCallback((analytics: boolean) => {
    saveChoice(analytics);
    const gtag = (window as GtagWindow).gtag;
    if (gtag) gtag("consent", "update", { analytics_storage: analytics ? "granted" : "denied" });
    if (!analytics) deleteAnalyticsCookies();
    setChoice({ v: VERSION, analytics, date: new Date().toISOString() });
    setPanelOpen(false);
  }, []);

  // Sin servicios opcionales no hay nada que consentir: no se muestra el aviso.
  if (!gaId || !hydrated || choice === undefined) return null;
  const showBanner = choice === null || panelOpen;

  return (
    <>
      {choice?.analytics ? (
        <>
          <Script id="ga-consent" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
        </>
      ) : null}
      {showBanner ? (
        <section className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-text">
          <h2 id="cookie-title">Cookies en esta web</h2>
          <p id="cookie-text">
            Usamos cookies técnicas necesarias y, solo si lo aceptas, cookies de analítica (Google Analytics) para saber de forma agregada cómo se usa la web.
            {" "}<Link href="/politica-de-cookies">Política de cookies</Link>.
          </p>
          {panelOpen ? (
            <fieldset className="cookie-banner__options">
              <legend className="visually-hidden">Preferencias de cookies</legend>
              <label><input type="checkbox" checked disabled /> Técnicas necesarias <small>(siempre activas)</small></label>
              <label><input type="checkbox" checked={analyticsDraft} onChange={(event) => setAnalyticsDraft(event.target.checked)} /> Analítica (Google Analytics)</label>
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
