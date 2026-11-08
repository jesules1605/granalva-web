"use client";

import Image from "next/image";
import { useState } from "react";

export type ClientLogo = { name: string; src: string; width: number; height: number };

/**
 * Carrusel continuo de empresas colaboradoras.
 * SOLO se publica con logotipos reales y autorización por escrito de cada empresa
 * (colección «client-logos» de Payload, campo «autorizado»). Sin logotipos, no se
 * renderiza nada: nunca se rellenan huecos con marcas inventadas.
 * - Dos grupos idénticos; el segundo es aria-hidden. La pista se desplaza un 50 %.
 * - Se pausa al pasar el cursor o con el botón; con movimiento reducido queda estático.
 * - Altura óptica uniforme; los logotipos no se deforman (ancho automático).
 */
export function ClientLogos({ logos }: { logos: ClientLogo[] }) {
  const [paused, setPaused] = useState(false);
  if (logos.length === 0) return null;

  return (
    <section className="client-logos" aria-labelledby="clientes-title">
      <div className="client-logos__head">
        <h2 id="clientes-title" className="client-logos__title">Empresas que confían en Granalva</h2>
        <button type="button" className="review-toggle" onClick={() => setPaused((value) => !value)} aria-pressed={paused}>
          {paused ? "Reanudar" : "Pausar"} <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
        </button>
      </div>
      <div className="client-logos__viewport">
        <div className={paused ? "client-logos__track is-paused" : "client-logos__track"}>
          {[0, 1].map((copy) => (
            <ul className="client-logos__group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {logos.map((logo) => (
                <li key={`${copy}-${logo.name}`}>
                  <Image src={logo.src} alt={copy === 0 ? logo.name : ""} width={logo.width} height={logo.height} sizes="200px" loading="lazy" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
