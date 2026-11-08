"use client";

import { useFormFields } from "@payloadcms/ui";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://limpiezasgranalva.com";

/**
 * Vista previa aproximada del resultado en Google mientras se edita el SEO.
 * Lee el title/description del grupo SEO (o el título y el slug del documento).
 */
export function SerpPreview({ path }: { path?: string }) {
  const fields = useFormFields(([state]) => state);
  const value = (name: string) => (fields[name]?.value as string | undefined) ?? "";
  const slug = value("slug");
  const key = (name: string) => (path ? `${path}.${name}` : name);
  const title = value(key("metaTitle")) || value("title");
  const description = value(key("metaDescription")) || value("excerpt") || "(sin meta description: Google elegirá un fragmento del texto)";
  const url = `${SITE.replace(/^https?:\/\//, "")}${slug ? ` › ${slug}` : ""}`;
  const fullTitle = title ? (title.includes("Granalva") ? title : `${title} | Granalva`) : "(sin title)";
  const long = fullTitle.length > 62;
  return (
    <div style={{ margin: "8px 0 24px", padding: 16, border: "1px solid var(--theme-elevation-150)", borderRadius: 6, background: "var(--theme-elevation-0)", maxWidth: 640 }}>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8, opacity: 0.7 }}>Vista previa en Google (aproximada)</div>
      <div style={{ fontSize: 13, color: "#4d5156" }}>{url}</div>
      <div style={{ fontSize: 19, color: "#1a0dab", lineHeight: 1.3, margin: "2px 0" }}>{long ? `${fullTitle.slice(0, 60)}…` : fullTitle}</div>
      <div style={{ fontSize: 14, color: "#4d5156", lineHeight: 1.5 }}>{description.length > 160 ? `${description.slice(0, 157)}…` : description}</div>
      {long ? <div style={{ fontSize: 12, color: "#b3261e", marginTop: 6 }}>El title supera ~62 caracteres y Google lo recortará.</div> : null}
    </div>
  );
}
