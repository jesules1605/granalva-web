"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { processSteps } from "../../lib/home-content";

function ScooterMark() {
  return (
    <svg viewBox="0 0 92 58" role="img" aria-label="Moto de recogida y entrega de Granalva">
      <circle cx="22" cy="43" r="9" />
      <circle cx="70" cy="43" r="9" />
      <path d="M21 42h25l11-22h12" />
      <path d="M43 42 34 22h19l9 20" />
      <path d="M61 19h13l4 8" />
      <path d="M34 22h-9" />
      <rect x="36" y="28" width="21" height="10" rx="4" />
      <circle className="scooter-mark__gem" cx="46.5" cy="33" r="3.5" />
    </svg>
  );
}

// Las paradas del mapa son un atajo visual para el ratón: el control accesible es la
// lista de pestañas `.route-steps`, que ofrece las mismas cuatro etapas.
export function RouteProcess() {
  const [activeProcess, setActiveProcess] = useState(0);
  const [processPaused, setProcessPaused] = useState(false);

  useEffect(() => {
    if (processPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setActiveProcess((current) => (current + 1) % processSteps.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [processPaused]);

  return (
    <div
      className="route-experience"
      onMouseEnter={() => setProcessPaused(true)}
      onMouseLeave={() => setProcessPaused(false)}
    >
      <div className="route-map" aria-live="polite">
        <div className="route-map__topline">
          <span>GRANADA · SERVICIO COORDINADO</span>
          <b>{processSteps[activeProcess].number} / 04</b>
        </div>
        <svg className="route-map__line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path className="route-map__shadow" d="M9 70 C18 58 32 29 48 25 S58 54 66 62 S82 34 89 25" />
          <path className="route-map__travelled" d="M9 70 C18 58 32 29 48 25 S58 54 66 62 S82 34 89 25" pathLength="1" style={{ strokeDashoffset: 1 - (activeProcess / 3) }} />
        </svg>
        <div className="route-map__brand" aria-hidden="true"><Image src="/granalva-logo.jpg" alt="" width={800} height={800} sizes="120px" /></div>
        {processSteps.map((step, index) => (
          <button key={step.number} type="button" className={activeProcess === index ? "route-stop active" : "route-stop"} style={{ left: `${step.x}%`, top: `${step.y}%` }} onClick={() => setActiveProcess(index)} tabIndex={-1} aria-hidden="true">
            <span>{step.number}</span><b>{step.label}</b>
          </button>
        ))}
        <div className="route-scooter" style={{ left: `${processSteps[activeProcess].x}%`, top: `${processSteps[activeProcess].y}%` }} aria-hidden="true"><ScooterMark /></div>
        <article className="route-story" key={processSteps[activeProcess].number}>
          <small>{processSteps[activeProcess].label}</small>
          <strong>{processSteps[activeProcess].title}</strong>
          <p>{processSteps[activeProcess].text}</p>
          <span>{processSteps[activeProcess].note}</span>
        </article>
        <div className="route-map__legend" aria-hidden="true"><span><i /> En ruta</span><span>GRANALVA · GRANADA</span></div>
      </div>

      <div className="route-steps" role="tablist" aria-label="Etapas del servicio">
        {processSteps.map((step, index) => (
          <button key={step.number} type="button" role="tab" aria-selected={activeProcess === index} className={activeProcess === index ? "active" : ""} onClick={() => setActiveProcess(index)}>
            <span>{step.number}</span><strong>{step.label}</strong><small>{step.note}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
