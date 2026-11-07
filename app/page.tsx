"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogoSeal } from "./components/logo-seal";
import { SiteFooter, SiteHeader } from "./components/site-chrome";
import { homepageServices } from "./lib/services";

const loads = [
  { id: "poco", label: "Poco", detail: "Hasta 4 kg", note: "Para salir del paso", scale: 0.72 },
  { id: "diario", label: "Diario", detail: "Hasta 8 kg", note: "La colada de la semana", scale: 0.9 },
  { id: "mucho", label: "Mucho", detail: "Hasta 12 kg", note: "Hogar, sábanas y más", scale: 1.1 },
];

const verifiedReviews = [
  ["Maravilloso trabajo. Se les nota el interés y la calidad.", "Noa Merlo"],
  ["Sin duda, la mejor opción de Granada. Son detallistas.", "Pilar Gómez"],
  ["Se nota la experiencia y dedicación de cada trabajador.", "Jesús Muñoz"],
  ["Se nota que son especialistas en apartamentos turísticos.", "José García"],
];

const videoChapters = [
  { number: "01", label: "Lavandería profesional", text: "Textiles preparados y entregas coordinadas", time: 0 },
  { number: "02", label: "Limpieza de empresas", text: "Oficinas, locales y espacios impecables", time: 5.1 },
  { number: "03", label: "Alojamientos", text: "Limpieza, lavandería y renting textil", time: 10.1 },
];

const processSteps = [
  {
    number: "01",
    label: "Solicita",
    title: "Cuéntanos qué necesitas",
    text: "Indica el tipo de servicio, la ubicación, el volumen y la frecuencia que necesita tu empresa o tu hogar.",
    note: "Una propuesta adaptada, sin soluciones genéricas.",
    x: 9,
    y: 70,
  },
  {
    number: "02",
    label: "Recogemos",
    title: "Coordinamos la ruta",
    text: "Acordamos la recogida en la dirección y la franja que mejor encajen con tu operativa.",
    note: "Transporte y comunicación directa.",
    x: 48,
    y: 25,
  },
  {
    number: "03",
    label: "Cuidamos",
    title: "Aplicamos el proceso adecuado",
    text: "Clasificamos, limpiamos, lavamos y revisamos cada servicio con un método definido.",
    note: "Equipo propio y control de calidad.",
    x: 66,
    y: 62,
  },
  {
    number: "04",
    label: "Entregamos",
    title: "Todo vuelve preparado",
    text: "Entregamos los textiles o dejamos el espacio listo dentro de la planificación acordada.",
    note: "Continuidad para tu empresa, tiempo para ti.",
    x: 89,
    y: 25,
  },
];

const team = [
  { initials: "MA", name: "Margarita", role: "Dirección y coordinación", text: "Organiza cada jornada y supervisa que la planificación se cumpla de principio a fin." },
  { initials: "JA", name: "Jesús", role: "Operaciones y clientes", text: "Conecta las necesidades de cada cliente con la operativa y mantiene una comunicación directa." },
  { initials: "GG", name: "Equipo Granalva", role: "Lavandería y limpieza", text: "Profesionales que convierten cada planificación en un resultado cuidado y constante." },
];

const sectors = [
  "APARTAMENTOS TURÍSTICOS",
  "OFICINAS Y DESPACHOS",
  "CENTROS DEPORTIVOS",
  "HOTELES Y ALOJAMIENTOS",
  "COMERCIOS Y LOCALES",
  "COMUNIDADES",
];

const faqs = [
  {
    question: "¿Trabajáis con empresas y apartamentos turísticos en Granada?",
    answer: "Sí. Diseñamos servicios recurrentes o puntuales para alojamientos turísticos, oficinas, locales, centros deportivos, comunidades y otros negocios de Granada y su área metropolitana.",
  },
  {
    question: "¿La lavandería incluye recogida y entrega?",
    answer: "Coordinamos la recogida y la entrega según la ubicación, el volumen y la frecuencia del cliente. Para empresas elaboramos una operativa específica que dé continuidad al servicio.",
  },
  {
    question: "¿También atendéis a particulares?",
    answer: "Sí. Ofrecemos lavandería a domicilio para particulares, con diferentes tamaños de colada y un proceso sencillo de recogida, cuidado y entrega.",
  },
  {
    question: "¿Ofrecéis renting textil para alojamientos?",
    answer: "Sí. Podemos estudiar el suministro de ropa de cama y baño junto con la lavandería para reducir inversión, almacenamiento y problemas de rotación.",
  },
  {
    question: "¿Cómo se calcula el presupuesto de limpieza?",
    answer: "Valoramos el tipo y tamaño del espacio, la frecuencia, los horarios disponibles, la ubicación y las tareas necesarias. Así proponemos un servicio ajustado a la operativa real.",
  },
];

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

export default function Home() {
  const [load, setLoad] = useState("diario");
  const [activeService, setActiveService] = useState(0);
  const [activeChapter, setActiveChapter] = useState(0);
  const [activeProcess, setActiveProcess] = useState(0);
  const [processPaused, setProcessPaused] = useState(false);
  const [reviewsPaused, setReviewsPaused] = useState(false);
  const [contactStatus, setContactStatus] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentLoad = loads.find((item) => item.id === load) ?? loads[1];

  useEffect(() => {
    if (processPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setActiveProcess((current) => (current + 1) % processSteps.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [processPaused]);

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

  const handleContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const company = String(form.get("company") ?? "");
    const email = String(form.get("email") ?? "");
    const phone = String(form.get("phone") ?? "");
    const profile = String(form.get("profile") ?? "");
    const service = String(form.get("service") ?? "");
    const message = String(form.get("message") ?? "");
    const subject = encodeURIComponent(`Solicitud web Granalva · ${service || "Información"}`);
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmpresa: ${company || "No indicada"}\nEmail: ${email}\nTeléfono: ${phone || "No indicado"}\nPerfil: ${profile}\nServicio: ${service}\n\nMensaje:\n${message}`,
    );

    setContactStatus("Hemos preparado tu solicitud. Revisa tu aplicación de correo para enviarla.");
    window.location.href = `mailto:info@limpiezasgranalva.com?subject=${subject}&body=${body}`;
  };

  return (
    <main className="site-shell">
      <SiteHeader />

      <section className="hero hero--business" id="inicio">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-laundry.png"
          onTimeUpdate={syncVideoChapter}
          aria-hidden="true"
        >
          <source src="/granalva-intro.mp4" type="video/mp4" />
        </video>
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><LogoSeal small /> Empresa granadina · Equipo propio</p>
          <h1>Limpieza y lavandería<br /><em>profesional en Granada.</em></h1>
          <p className="hero-lead">Una solución integral para empresas, apartamentos turísticos, oficinas y alojamientos. También recogemos la colada de particulares y la devolvemos lista para usar.</p>
          <div className="hero-actions">
            <a className="button button--yellow" href="#contacto">Solicitar presupuesto <span>→</span></a>
            <a className="button button--glass" href="#lavanderia">Lavandería a domicilio <span>↓</span></a>
          </div>
        </div>

        <div className="hero-stamp" aria-label="Granalva, servicio local en Granada">
          <Image src="/granalva-logo.jpg" alt="Granalva" width={800} height={800} unoptimized />
        </div>

        <div className="hero-chapters" aria-label="Servicios principales de Granalva">
          {videoChapters.map((chapter, index) => (
            <button
              key={chapter.number}
              type="button"
              className={activeChapter === index ? "active" : ""}
              onClick={() => jumpToChapter(index)}
              aria-label={`Ver escena: ${chapter.label}`}
            >
              <span>{chapter.number}</span>
              <strong>{chapter.label}</strong>
              <small>{chapter.text}</small>
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="authority-strip" aria-label="Razones para confiar en Granalva">
        <article><strong>Años de experiencia</strong><span>Especialización real en limpieza turística y profesional.</span></article>
        <article><strong>Equipo propio</strong><span>Coordinación directa, seguimiento y personas con nombre.</span></article>
        <article><strong>Servicio integral</strong><span>Limpieza, lavandería, recogida, entrega y renting textil.</span></article>
        <article><strong>Granada</strong><span>Capital, área metropolitana y rutas profesionales acordadas.</span></article>
      </section>

      <section className="audience-section" id="empresas">
        <div className="audience-heading">
          <span className="section-number">01 / DOS NECESIDADES, UN MISMO EQUIPO</span>
          <h2>Tu empresa no puede parar.<br /><em>Tu hogar tampoco debería tener que esperar.</em></h2>
        </div>
        <div className="audience-grid">
          <article className="audience-card audience-card--primary">
            <span>PARA EMPRESAS Y ALOJAMIENTOS</span>
            <h3>Un servicio que encaja en tu operativa.</h3>
            <p>Planificamos frecuencias, horarios, recogidas y entregas para que la limpieza y los textiles dejen de ser una preocupación diaria.</p>
            <ul>
              <li>Limpieza de apartamentos turísticos</li>
              <li>Limpieza de oficinas, locales y centros</li>
              <li>Lavandería profesional y renting textil</li>
              <li>Atención directa y propuesta a medida</li>
            </ul>
            <a className="button button--yellow" href="#contacto">Pedir propuesta <span>→</span></a>
          </article>
          <article className="audience-card audience-card--secondary">
            <span>PARA PARTICULARES</span>
            <h3>Tu colada vuelve limpia, seca y doblada.</h3>
            <p>Recogemos la ropa en tu puerta, aplicamos el cuidado adecuado y te la devolvemos preparada para guardar.</p>
            <ul>
              <li>Recogida y entrega en Granada</li>
              <li>Tres tamaños de colada</li>
              <li>Ropa diaria y textiles del hogar</li>
              <li>Proceso sencillo y comunicación clara</li>
            </ul>
            <a className="button button--outline-dark" href="#lavanderia">Elegir mi colada <span>↓</span></a>
          </article>
        </div>
      </section>

      <section className="services" id="servicios">
        <div className="section-heading">
          <div><span className="section-number">02 / SERVICIOS PROFESIONALES</span><h2>Una respuesta.<br /><em>Todo coordinado.</em></h2></div>
          <p>Granalva reúne limpieza profesional y lavandería en Granada para evitar proveedores dispersos, retrasos y tareas sin supervisión.</p>
        </div>
        <div className="services-layout">
          <div className="service-list" role="tablist" aria-label="Servicios de limpieza y lavandería de Granalva">
            {homepageServices.map((service, index) => (
              <button key={service.slug} role="tab" aria-selected={activeService === index} onClick={() => setActiveService(index)} className={activeService === index ? "service-row active" : "service-row"}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{service.navLabel}</strong><i>↗</i>
              </button>
            ))}
          </div>
          <article className="service-feature" role="tabpanel">
            <Image src={homepageServices[activeService].image} alt={homepageServices[activeService].imageAlt} fill sizes="(max-width: 1000px) 100vw, 56vw" unoptimized />
            <div className="feature-overlay"><span>{homepageServices[activeService].eyebrow}</span><h3>{homepageServices[activeService].navLabel}</h3><p>{homepageServices[activeService].summary}</p><Link href={`/servicios/${homepageServices[activeService].slug}`}>Conocer el servicio →</Link></div>
          </article>
        </div>
      </section>

      <section className="sector-authority" id="clientes">
        <div className="sector-authority__heading">
          <span className="section-number">EXPERIENCIA MULTISECTORIAL</span>
          <h2>Preparados para espacios<br /><em>que tienen que estar siempre listos.</em></h2>
          <p>Trabajamos con negocios que dependen de una operación impecable, puntual y discreta, incluso en los días de mayor actividad.</p>
        </div>
        <div className="sector-marquee" aria-label="Sectores atendidos por Granalva">
          {[0, 1].map((copy) => (
            <div className="sector-track" key={copy} aria-hidden={copy === 1}>
              {sectors.map((sector, index) => (
                <div className="sector-logo" key={`${copy}-${sector}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{sector}</strong>
                  <LogoSeal small />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

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

      <section className="brand-story">
        <div className="brand-story__logo" aria-label="Logotipo de Granalva">
          <Image src="/granalva-logo.jpg" alt="Granalva" width={800} height={800} unoptimized />
          <span>IDENTIDAD GRANADINA<br /><b>SERVICIO PROFESIONAL</b></span>
        </div>
        <div className="story-copy">
          <span className="section-number section-number--light">UNA EMPRESA DE GRANADA</span>
          <h2>Procesos profesionales.<br /><em>Trato directo.</em></h2>
          <p>La autoridad no consiste en parecer grande: consiste en responder, coordinar bien y mantener el nivel en cada servicio. Esa es la forma de trabajar de Granalva.</p>
        </div>
        <div className="story-postcard"><span>DESDE<br /><b>GRANADA</b></span><small>limpieza y lavandería</small></div>
      </section>

      <section className="process process--route" id="como-funciona">
        <div className="process-intro">
          <span className="section-number">04 / ASÍ FUNCIONA</span>
          <h2>Nosotros hacemos el recorrido.<br /><em>Tú sigues con lo importante.</em></h2>
          <p>Una operativa clara para empresas y particulares: solicitud, coordinación, cuidado y entrega.</p>
        </div>

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
            <div className="route-map__brand" aria-hidden="true"><Image src="/granalva-logo.jpg" alt="" width={800} height={800} unoptimized /></div>
            {processSteps.map((step, index) => (
              <button key={step.number} type="button" className={activeProcess === index ? "route-stop active" : "route-stop"} style={{ left: `${step.x}%`, top: `${step.y}%` }} onClick={() => setActiveProcess(index)} aria-label={`${step.number}. ${step.label}: ${step.title}`}>
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
      </section>

      <section className="team" id="experiencia">
        <div className="team-visual">
          <div className="team-gallery team-gallery--main">
            <Image src="/service-cleaning.png" alt="Equipo de limpieza profesional trabajando en un alojamiento" fill sizes="(max-width: 1000px) 100vw, 54vw" unoptimized />
            <span>EN LOS ALOJAMIENTOS</span>
          </div>
          <div className="team-gallery team-gallery--detail">
            <Image src="/hero-laundry.png" alt="Textiles preparados por la lavandería de Granalva" fill sizes="(max-width: 760px) 46vw, 22vw" unoptimized />
            <span>EN LA LAVANDERÍA</span>
          </div>
          <div className="team-logo-card" aria-label="Granalva, equipo de Granada">
            <Image src="/granalva-logo.jpg" alt="" width={800} height={800} unoptimized />
            <span>EQUIPO PROPIO<br /><b>COORDINACIÓN DIRECTA</b></span>
          </div>
          <div className="team-note"><LogoSeal small /><p>Nos verás llegar,<br /><b>nos tendrás al otro lado.</b></p></div>
        </div>
        <div className="team-copy">
          <span className="section-number">05 / EXPERIENCIA Y EQUIPO</span>
          <h2>Una empresa con procesos.<br /><em>Un equipo con nombre.</em></h2>
          <p>Granalva es una empresa granadina con experiencia específica en limpieza de apartamentos turísticos, espacios profesionales y lavandería. Cada servicio se coordina, ejecuta y revisa por un equipo que trabaja junto.</p>
          <div className="team-list">
            {team.map((member) => (
              <article className="team-member" key={member.name}>
                <span>{member.initials}</span>
                <div><small>{member.role}</small><h3>{member.name}</h3><p>{member.text}</p></div>
              </article>
            ))}
          </div>
          <a className="text-link" href="#contacto">Hablar con nuestro equipo <span>→</span></a>
        </div>
      </section>

      <section className="reviews" aria-labelledby="reviews-title">
        <div className="review-heading">
          <span className="section-number">06 / REFERENCIAS REALES</span>
          <h2 id="reviews-title">La experiencia<br /><em>también se demuestra.</em></h2>
          <button type="button" className="review-toggle" onClick={() => setReviewsPaused((paused) => !paused)} aria-pressed={reviewsPaused}>
            {reviewsPaused ? "Reanudar" : "Pausar"} <span aria-hidden="true">{reviewsPaused ? "▶" : "Ⅱ"}</span>
          </button>
        </div>
        <div className="review-viewport">
          <div className={reviewsPaused ? "review-marquee is-paused" : "review-marquee"}>
            {[0, 1].map((copy) => (
              <div className="review-track" key={copy} aria-hidden={copy === 1}>
                {verifiedReviews.map(([quote, author], index) => (
                  <blockquote key={`${copy}-${author}`} className={`review-card review-${(index % 3) + 1}`}>
                    <span>★★★★★</span><p>“{quote}”</p><footer>{author}<LogoSeal small /></footer>
                  </blockquote>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section" id="preguntas">
        <div className="faq-heading">
          <span className="section-number">07 / PREGUNTAS FRECUENTES</span>
          <h2>Lo que necesitas saber<br /><em>antes de empezar.</em></h2>
          <p>Respuestas claras sobre nuestros servicios de limpieza y lavandería profesional en Granada.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}<b>+</b></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contacto">
        <div className="contact-copy">
          <span className="section-number section-number--light">08 / HABLEMOS</span>
          <h2>Cuéntanos qué necesitas.<br /><em>Diseñamos la operativa.</em></h2>
          <p>Explícanos tu espacio, el volumen de lavandería o la frecuencia que necesitas. Te responderemos con una propuesta adaptada.</p>
          <div className="contact-direct">
            <a href="tel:+34744488964"><small>Teléfono</small><strong>744 488 964</strong></a>
            <a href="mailto:info@limpiezasgranalva.com"><small>Correo</small><strong>info@limpiezasgranalva.com</strong></a>
            <div><small>Zona de servicio</small><strong>Granada y área metropolitana</strong></div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleContact}>
          <div className="form-heading"><span>SOLICITUD DE INFORMACIÓN</span><b>GRANALVA</b></div>
          <div className="form-grid">
            <label>Nombre y apellidos<input name="name" type="text" autoComplete="name" required /></label>
            <label>Empresa o alojamiento<input name="company" type="text" autoComplete="organization" /></label>
            <label>Correo electrónico<input name="email" type="email" autoComplete="email" required /></label>
            <label>Teléfono<input name="phone" type="tel" autoComplete="tel" /></label>
            <label>¿Quién eres?
              <select name="profile" required defaultValue="">
                <option value="" disabled>Selecciona una opción</option>
                <option>Empresa o comercio</option>
                <option>Alojamiento turístico u hotel</option>
                <option>Comunidad de propietarios</option>
                <option>Particular</option>
                <option>Otro</option>
              </select>
            </label>
            <label>Servicio de interés
              <select name="service" required defaultValue="">
                <option value="" disabled>Selecciona un servicio</option>
                <option>Lavandería profesional</option>
                <option>Limpieza de apartamentos turísticos</option>
                <option>Limpieza de oficinas o locales</option>
                <option>Renting textil</option>
                <option>Limpieza fin de obra</option>
                <option>Lavandería para particulares</option>
              </select>
            </label>
            <label className="form-message">Cuéntanos brevemente qué necesitas<textarea name="message" rows={5} required /></label>
          </div>
          <label className="form-consent"><input type="checkbox" required /><span>Acepto que Granalva utilice estos datos únicamente para responder a mi solicitud.</span></label>
          <button className="button button--dark form-submit" type="submit">Enviar solicitud <span>→</span></button>
          <p className="form-note">Al enviar, se abrirá tu aplicación de correo con la solicitud preparada. Granalva no almacena estos datos en la web.</p>
          <p className="form-status" aria-live="polite">{contactStatus}</p>
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}
