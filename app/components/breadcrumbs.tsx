import Link from "next/link";
import type { Crumb } from "../lib/seo";

/** Ruta de navegación visible. Su JSON-LD se genera con breadcrumbJsonLd() a partir de los mismos datos. */
export function Breadcrumbs({ crumbs, tone = "light" }: { crumbs: Crumb[]; tone?: "light" | "dark" }) {
  return (
    <nav className={`breadcrumbs breadcrumbs--${tone}`} aria-label="Ruta de navegación">
      <ol>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={crumb.path}>
              {isLast ? <span aria-current="page">{crumb.name}</span> : <Link href={crumb.path}>{crumb.name}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
