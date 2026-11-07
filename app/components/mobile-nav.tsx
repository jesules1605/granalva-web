"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export type NavLink = { href: string; label: string };

/**
 * Menú para pantallas donde la navegación principal se oculta (<1160 px).
 * Accesible: botón con aria-expanded/aria-controls, cierre con Escape, foco
 * atrapado dentro del panel y devuelto al botón al cerrar.
 */
export function MobileNav({ links, services, phone }: { links: NavLink[]; services: NavLink[]; phone: { href: string; label: string } }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const panelItems = () => Array.from(panel?.querySelectorAll<HTMLElement>("a, button") ?? []);
    // El ciclo de foco incluye el botón de cerrar (fuera del panel) y los enlaces.
    const focusables = () => [buttonRef.current, ...panelItems()].filter((item): item is HTMLElement => Boolean(item));
    panelItems()[0]?.focus();
    document.documentElement.classList.add("nav-open");

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      // Ciclo de foco explícito: el panel vive en un portal, fuera del orden natural del DOM.
      const items = focusables();
      const current = items.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      const next = event.shiftKey ? (current <= 0 ? items.length - 1 : current - 1) : (current + 1) % items.length;
      items[next]?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.classList.remove("nav-open");
    };
  }, [open]);

  const close = () => setOpen(false);
  // El panel se monta en <body>: la cabecera usa filter/backdrop-filter, que
  // convertirían a la cabecera en el contenedor de un elemento position:fixed.
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="mobile-nav__toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      {mounted && createPortal(
        <div ref={panelRef} id={panelId} className="mobile-nav__panel" hidden={!open}>
          <nav aria-label="Menú principal">
            <ul className="mobile-nav__main">
              {links.map((link) => (
                <li key={link.href}><Link href={link.href} onClick={close}>{link.label}</Link></li>
              ))}
            </ul>
            <p className="mobile-nav__label">Servicios en Granada</p>
            <ul className="mobile-nav__services">
              {services.map((link) => (
                <li key={link.href}><Link href={link.href} onClick={close}>{link.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="mobile-nav__actions">
            <Link className="button button--dark" href="/contacto#formulario" onClick={close}>Solicitar presupuesto <span>→</span></Link>
            <a className="mobile-nav__phone" href={phone.href}>Llamar al {phone.label}</a>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
