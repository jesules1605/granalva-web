"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import type { ServiceCategory } from "../../lib/home-content";

/**
 * Selector de líneas de servicio (patrón WAI-ARIA «tabs» con activación manual
 * por flechas). Todos los paneles se renderizan en el servidor: los inactivos
 * llevan `hidden`, pero su texto y sus enlaces están en el HTML inicial.
 */
export function ServiceSelector({ categories }: { categories: ServiceCategory[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = categories.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" || event.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="service-selector">
      <div className="service-selector__tabs" role="tablist" aria-label="Líneas de servicio de Granalva">
        {categories.map((category, index) => (
          <button
            key={category.id}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            id={`servicio-tab-${category.id}`}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`servicio-panel-${category.id}`}
            tabIndex={active === index ? 0 : -1}
            className={`service-selector__tab service-selector__tab--${category.audience}`}
            onClick={() => setActive(index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{category.tab}</strong>
            <small>{category.audience === "empresas" ? "Empresas y alojamientos" : "Hogares"}</small>
          </button>
        ))}
      </div>

      {categories.map((category, index) => (
        <div
          key={category.id}
          id={`servicio-panel-${category.id}`}
          role="tabpanel"
          aria-labelledby={`servicio-tab-${category.id}`}
          className="service-selector__panel"
          hidden={active !== index}
        >
          <div className="service-selector__media">
            <Image src={category.image} alt={category.imageAlt} fill sizes="(max-width: 900px) 100vw, 48vw" quality={70} />
          </div>
          <div className="service-selector__copy">
            <h3>{category.title}</h3>
            <p>{category.description}</p>
            <ul className="service-selector__advantages">
              {category.advantages.map((advantage) => <li key={advantage}>{advantage}</li>)}
            </ul>
            <Link className="button button--dark" href={category.cta.href}>{category.cta.label} <span>→</span></Link>
            <nav className="service-selector__links" aria-label={`Páginas de ${category.tab.toLowerCase()}`}>
              {category.links.map((link) => <Link key={link.href} href={link.href}>{link.label} <span aria-hidden="true">↗</span></Link>)}
            </nav>
          </div>
        </div>
      ))}
    </div>
  );
}
