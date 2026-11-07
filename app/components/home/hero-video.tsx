"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { videoChapters } from "../../lib/home-content";

/** Vídeo de fondo del hero y capítulos. El texto del hero llega como children (render de servidor). */
export function HeroVideo({ children }: { children: ReactNode }) {
  const [activeChapter, setActiveChapter] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // El vídeo (≈2 MB) no compite con el contenido principal: empieza a descargarse
  // cuando la página ha terminado de cargar. Mientras tanto se ve el póster, que es
  // la misma imagen de fondo del hero. Con movimiento reducido o ahorro de datos,
  // se mantiene el póster y el usuario puede iniciar el vídeo con los capítulos.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData) return;
    const start = () => {
      video.preload = "auto";
      void video.play().catch(() => {
        // Reproducción automática bloqueada: se mantiene el póster.
      });
    };
    if (document.readyState === "complete") {
      const timer = window.setTimeout(start, 200);
      return () => window.clearTimeout(timer);
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, []);

  const syncVideoChapter = () => {
    const time = videoRef.current?.currentTime ?? 0;
    setActiveChapter(time >= 10 ? 2 : time >= 5 ? 1 : 0);
  };

  const jumpToChapter = (index: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = videoChapters[index].time;
      void video.play();
    }
    setActiveChapter(index);
  };

  return (
    <>
      <video
        ref={videoRef}
        className="hero-video"
        muted
        loop
        playsInline
        preload="none"
        poster="/textiles-lavanderia-profesional-granada-poster.webp"
        onTimeUpdate={syncVideoChapter}
        aria-hidden="true"
      >
        <source src="/granalva-intro.mp4" type="video/mp4" />
      </video>
      {children}
      <div className="hero-chapters" aria-label="Servicios principales de Granalva">
        {videoChapters.map((chapter, index) => (
          <button
            key={chapter.number}
            type="button"
            className={activeChapter === index ? "active" : ""}
            onClick={() => jumpToChapter(index)}
          >
            <span>{chapter.number}</span>
            <strong>{chapter.label}</strong>
            <small>{chapter.text}</small>
            <i aria-hidden="true" />
          </button>
        ))}
      </div>
    </>
  );
}
