"use client";

import { useMemo, useState } from "react";

// Generador de enlaces con UTM: normaliza los valores (minúsculas, sin tildes ni espacios)
// para que las campañas no se dupliquen en los informes por escribirlas de dos maneras.
const clean = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
const SOURCES = ["email", "whatsapp", "instagram", "facebook", "linkedin", "google_business", "dossier", "qr", "otro"];
const MEDIUMS = ["outreach", "newsletter", "social", "organic_social", "cpc", "print", "referral", "qr"];

export function UtmBuilder() {
  const [page, setPage] = useState("https://limpiezasgranalva.com/servicios/lavanderia-sierra-nevada");
  const [source, setSource] = useState("email");
  const [medium, setMedium] = useState("outreach");
  const [campaign, setCampaign] = useState("sierra_nevada_2026");
  const [content, setContent] = useState("");
  const [term, setTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const url = useMemo(() => {
    try {
      const target = new URL(page.trim());
      if (target.hostname !== "limpiezasgranalva.com") return { error: "El enlace debe ser de https://limpiezasgranalva.com" };
      const values: [string, string][] = [["utm_source", clean(source)], ["utm_medium", clean(medium)], ["utm_campaign", clean(campaign)], ["utm_content", clean(content)], ["utm_term", clean(term)]];
      if (!values[0][1] || !values[1][1] || !values[2][1]) return { error: "utm_source, utm_medium y utm_campaign son obligatorios" };
      for (const [key, value] of values) if (value) target.searchParams.set(key, value);
      return { value: target.toString() };
    } catch {
      return { error: "Escribe una dirección completa, empezando por https://" };
    }
  }, [page, source, medium, campaign, content, term]);
  const field = (label: string, value: string, set: (v: string) => void, list?: string[], hint?: string) => (
    <label style={{ display: "grid", gap: 4, fontSize: 13 }}>
      {label}
      <input value={value} onChange={(e) => set(e.target.value)} list={list ? `${label}-list` : undefined} style={{ padding: "8px 10px", border: "1px solid var(--theme-elevation-200)", borderRadius: 4, background: "var(--theme-input-bg)", color: "inherit" }} />
      {list ? <datalist id={`${label}-list`}>{list.map((item) => <option key={item} value={item} />)}</datalist> : null}
      {hint ? <small style={{ color: "var(--theme-elevation-500)" }}>{hint}</small> : null}
    </label>
  );
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {field("Página de destino", page, setPage)}
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {field("utm_source (origen)", source, setSource, SOURCES, "Dónde se publica el enlace")}
        {field("utm_medium (medio)", medium, setMedium, MEDIUMS, "Tipo de canal")}
        {field("utm_campaign (campaña)", campaign, setCampaign, undefined, "Nombre_año, p. ej. sierra_nevada_2026")}
        {field("utm_content (opcional)", content, setContent, undefined, "Qué botón o pieza, p. ej. boton_dossier")}
        {field("utm_term (opcional)", term, setTerm, undefined, "Palabra clave, si aplica")}
      </div>
      {"error" in url ? <p style={{ color: "var(--theme-error-500)" }}>{url.error}</p> : (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <code style={{ wordBreak: "break-all", padding: 8, background: "var(--theme-elevation-50)", borderRadius: 4, flex: "1 1 400px" }}>{url.value}</code>
          <button type="button" className="btn btn--style-primary btn--size-small" onClick={() => { void navigator.clipboard.writeText(url.value ?? ""); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>{copied ? "Copiado" : "Copiar enlace"}</button>
        </div>
      )}
    </div>
  );
}
