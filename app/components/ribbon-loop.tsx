"use client";

import { useEffect, useRef } from "react";

/**
 * Marquesina superior en bucle continuo (animación 100 % CSS).
 * Dos grupos idénticos; la pista se desplaza exactamente el ancho de uno (−50 %).
 * Este componente solo redondea el ancho de los grupos a píxeles enteros para que
 * el punto de reinicio caiga en un píxel exacto y no se perciba ningún tirón.
 * Se recalcula al cargar la fuente y al cambiar el tamaño de la ventana.
 */
export function RibbonLoop({ items }: { items: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const groups = [...track.querySelectorAll<HTMLElement>(".ribbon-group")];
    const fit = () => {
      for (const group of groups) group.style.width = "";
      const width = Math.ceil(groups[0].getBoundingClientRect().width);
      for (const group of groups) group.style.width = `${width}px`;
    };
    fit();
    void document.fonts?.ready.then(fit);
    let frame = 0;
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="top-ribbon">
      <div className="ribbon-track" ref={trackRef}>
        {[0, 1].map((copy) => (
          <ul className="ribbon-group" key={copy} aria-hidden={copy === 1 ? true : undefined} aria-label={copy === 0 ? "Servicios de Granalva" : undefined}>
            {items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        ))}
      </div>
    </div>
  );
}
