"use client";

import { useState } from "react";
import { loads } from "../../lib/home-content";
import { LogoSeal } from "../logo-seal";

export function LoadPicker() {
  const [load, setLoad] = useState("diario");
  const currentLoad = loads.find((item) => item.id === load) ?? loads[1];

  return (
    <section className="load-picker" id="lavanderia" aria-labelledby="load-title">
      <div className="picker-heading">
        <span className="section-number">03 / LAVANDERÍA A DOMICILIO</span>
        <div><h2 id="load-title">¿Cuánta ropa tienes?</h2><p>Elige el tamaño aproximado de tu colada. Nosotros hacemos el resto.</p></div>
      </div>
      <div className="load-options" role="radiogroup" aria-label="Tamaño aproximado de la colada">
        {loads.map((item) => (
          <button key={item.id} role="radio" aria-checked={load === item.id} className={load === item.id ? "load-card active" : "load-card"} onClick={() => setLoad(item.id)}>
            <span className="bag" style={{ "--bag-scale": item.scale } as React.CSSProperties}><i /><b>G</b></span>
            <span className="load-label"><strong>{item.label}</strong><small>{item.detail}</small></span>
            <span className="load-note">{item.note}</span>
          </button>
        ))}
      </div>
      <div className="picker-result" aria-live="polite">
        <div><LogoSeal small /><span>Has elegido</span><strong>{currentLoad.label} · {currentLoad.detail}</strong></div>
        <a href="#contacto">Solicitar recogida <span>→</span></a>
      </div>
    </section>
  );
}
