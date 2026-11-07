"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

export type AccordionItem = { id: string; title: string; content: ReactNode };

/**
 * Acordeón accesible (patrón WAI-ARIA «accordion»), renderizado en el servidor.
 * - Cada cabecera es un <h3> con un <button> real, `aria-expanded` y `aria-controls`.
 * - El servidor entrega todos los paneles ABIERTOS (texto visible y legible sin
 *   JavaScript). Tras la hidratación, los paneles cerrados reciben
 *   `hidden="until-found"` directamente en el DOM (React 19.2 aún no admite ese valor):
 *   el contenido sigue en el DOM y la búsqueda del navegador (Ctrl+F) lo abre.
 */
export function Accordion({ items, defaultOpen = [] }: { items: AccordionItem[]; defaultOpen?: string[] }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(defaultOpen));
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);
  // Antes de hidratar (HTML del servidor) todo se muestra abierto.
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);

  // Aplica «until-found» a los paneles cerrados una vez hidratado.
  useEffect(() => {
    const list = listRef.current;
    if (!list || !hydrated) return;
    for (const panel of list.querySelectorAll<HTMLElement>(".accordion__panel")) {
      if (open.has(panel.dataset.itemId ?? "")) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "until-found");
    }
  }, [open, hydrated]);

  // Si la búsqueda del navegador encuentra texto en un panel cerrado, se abre.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onBeforeMatch = (event: Event) => {
      const id = (event.target as HTMLElement).dataset.itemId;
      if (id) setOpen((current) => new Set(current).add(id));
    };
    list.addEventListener("beforematch", onBeforeMatch, true);
    return () => list.removeEventListener("beforematch", onBeforeMatch, true);
  }, []);

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="accordion" ref={listRef}>
      {items.map((item) => {
        const expanded = !hydrated || open.has(item.id);
        const buttonId = `${baseId}-${item.id}-boton`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div className="accordion__item" key={item.id}>
            <h3 className="accordion__heading">
              <button type="button" id={buttonId} className="accordion__button" aria-expanded={expanded} aria-controls={panelId} onClick={() => toggle(item.id)}>
                <span>{item.title}</span>
                <b className="accordion__icon" aria-hidden="true" />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className="accordion__panel"
              data-item-id={item.id}
            >
              <div className="accordion__content">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
