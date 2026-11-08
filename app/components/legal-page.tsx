import type { ReactNode } from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { SiteFooter, SiteHeader } from "./site-chrome";
import type { Crumb } from "../lib/seo";

const formatDate = (iso: string) => new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Madrid" }).format(new Date(iso));

/** Plantilla de textos legales: legible, sin decoración, con fecha de revisión. */
export function LegalPage({ title, crumbs, updatedAt, children }: { title: string; crumbs: Crumb[]; updatedAt: string; children: ReactNode }) {
  return (
    <main className="site-shell legal-site">
      <SiteHeader />
      <article className="legal">
        <Breadcrumbs crumbs={crumbs} tone="dark" />
        <h1>{title}</h1>
        <p className="legal__updated">Última actualización: <time dateTime={updatedAt}>{formatDate(updatedAt)}</time></p>
        {children}
      </article>
      <SiteFooter />
    </main>
  );
}
