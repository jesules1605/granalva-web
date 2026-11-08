"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { videoChapters } from "../../lib/home-content";

/** Vídeo de fondo del hero y capítulos. El texto del hero llega como children (render de servidor). */
export function HeroVideo({ children }: { children: ReactNode }) {
  const [activeChapter, setActiveChapter] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // El vídeo no compite con el contenido principal: empieza a descargarse cuando la
  // página ha terminado de cargar (720 px en móvil ≈0,7 MB; 1280 px ≈1,9 MB; 1440 px,
  // resolución nativa del máster, ≈2,3 MB en pantallas anchas). 25 fps constantes:
  // el máster tenía cadencia irregular y producía vibración (docs/VIDEO-HERO.md). Mientras
  // tanto se ve el póster, que es su primer fotograma (sin salto al empezar). No se
  // reproduce solo con movimiento reducido, ahorro de datos o conexiones 2G; el usuario
  // puede iniciarlo con los capítulos. Fuera de pantalla se pausa.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const lowData = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? "");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || lowData) return;

    let visible = true;
    let started = false;
    const play = () => {
      if (!visible) return;
      started = true;
      void video.play().catch(() => {
        // Reproducción automática bloqueada: se mantiene el póster.
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) video.pause();
      else if (started) play();
    });
    observer.observe(video);

    const start = () => {
      video.preload = "auto";
      play();
    };
    let timer: number | undefined;
    if (document.readyState === "complete") timer = window.setTimeout(start, 150);
    else window.addEventListener("load", start, { once: true });
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("load", start);
    };
  }, []);

  const syncVideoChapter = () => {
    const time = videoRef.current?.currentTime ?? 0;
    setActiveChapter(time >= 10 ? 2 : time >= 5 ? 1 : 0);
  };

  const jumpToChapter = (index: number) => {
    const video = videoRef.current;
    // Con movimiento reducido el vídeo está oculto: solo se marca el capítulo (sin descargarlo).
    if (video && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
        poster="/video/granalva-hero-poster-1280.webp"
        width={1280}
        height={800}
        onTimeUpdate={syncVideoChapter}
        aria-hidden="true"
      >
        <source src="/video/granalva-hero-720.mp4" type="video/mp4" media="(max-width: 760px)" />
        <source src="/video/granalva-hero-1280.mp4" type="video/mp4" media="(max-width: 1280px)" />
        <source src="/video/granalva-hero-1440.mp4" type="video/mp4" />
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
