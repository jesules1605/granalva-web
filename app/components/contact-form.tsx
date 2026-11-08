"use client";

import Link from "next/link";
import Script from "next/script";
import { startTransition, useActionState, useEffect, useRef, type FormEvent } from "react";
import { submitContactRequest } from "../actions/contact";
import { BUSINESS_TYPES, FREQUENCIES, SERVICE_OPTIONS, type ContactFormState, type FieldName } from "../lib/contact-schema";
import { BUSINESS } from "../lib/site";

type Variant = "general" | "sierra-nevada";

const COPY: Record<Variant, { eyebrow: string; title: string; submit: string }> = {
  general: { eyebrow: "SOLICITUD DE PRESUPUESTO", title: "Cuéntanos qué necesitas", submit: "Solicitar presupuesto" },
  "sierra-nevada": { eyebrow: "TEMPORADA 2026/27 · SIERRA NEVADA", title: "Reserva tu ruta de temporada", submit: "Reservar ruta de temporada" },
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const INITIAL: ContactFormState = { status: "idle", message: "" };

/**
 * Formulario de solicitudes B2B con ampliación progresiva. Funciona sin
 * JavaScript (server action + <details> nativo); con JavaScript añade la
 * atribución de campaña, el tiempo de rellenado y la preselección por URL.
 */
export function ContactForm({ variant = "general", defaultService = "", headingLevel = 3 }: { variant?: Variant; defaultService?: string; headingLevel?: 2 | 3 }) {
  const [state, action, pending] = useActionState(submitContactRequest, INITIAL);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const copy = COPY[variant];
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const turnstileKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Preselección desde la URL (?servicio=…&colada=…) y atribución de primera visita.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const set = (name: string, value: string) => {
      const input = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
      if (input) input.value = value;
    };
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("servicio");
    if (fromUrl && SERVICE_OPTIONS.some((option) => option.value === fromUrl)) set("servicio", fromUrl);
    if (fromUrl === "lavanderia-domicilio-granada") set("tipoCliente", "Particular");
    const colada = params.get("colada");
    const sizes: Record<string, string> = { poco: "hasta 4 kg", diario: "hasta 8 kg", mucho: "hasta 12 kg" };
    if (colada && sizes[colada]) set("volumen", `Colada ${colada} (${sizes[colada]})`);

    let firstTouch: Record<string, string> = {};
    try {
      firstTouch = JSON.parse(sessionStorage.getItem("granalva-atribucion") ?? "{}");
      if (!firstTouch.paginaEntrada) {
        firstTouch = { paginaEntrada: window.location.pathname, referrer: document.referrer };
        for (const key of UTM_KEYS) if (params.get(key)) firstTouch[key] = params.get(key) ?? "";
        sessionStorage.setItem("granalva-atribucion", JSON.stringify(firstTouch));
      }
    } catch {
      firstTouch = { paginaEntrada: window.location.pathname, referrer: document.referrer };
    }
    set("pagina", window.location.pathname + window.location.search);
    set("paginaEntrada", firstTouch.paginaEntrada ?? "");
    set("referrer", firstTouch.referrer ?? "");
    for (const key of UTM_KEYS) set(key, firstTouch[key] ?? params.get(key) ?? "");
    set("startedAt", String(Date.now()));
    // Clave única por formulario: un doble clic o un reenvío devuelve la misma solicitud.
    set("submissionKey", crypto.randomUUID());
  }, []);

  // Tras enviar, el foco va al mensaje de estado para lectores de pantalla.
  useEffect(() => {
    if (state.status !== "idle") statusRef.current?.focus();
  }, [state]);

  // Con JavaScript, el envío se hace en una transición propia para que React no
  // vacíe el formulario (comportamiento por defecto de `action`) si hay errores.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => action(data));
  };

  const error = (name: FieldName) =>
    state.fieldErrors?.[name] ? <span className="field-error" id={`${variant}-${name}-error`}>{state.fieldErrors[name]}</span> : null;
  const describedBy = (name: FieldName) => (state.fieldErrors?.[name] ? `${variant}-${name}-error` : undefined);

  if (state.status === "ok") {
    return (
      <div className="contact-form contact-form--done" ref={statusRef} tabIndex={-1} role="status">
        <div className="form-heading"><span>{copy.eyebrow}</span><b>GRANALVA</b></div>
        <Heading>Solicitud recibida</Heading>
        <p>{state.message}</p>
        <p>Si es urgente, llámanos al <a href="tel:+34744488964">744 488 964</a>.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} className="contact-form" action={action} onSubmit={onSubmit} aria-describedby={`${variant}-form-note`}>
      <div className="form-heading"><span>{copy.eyebrow}</span><b>GRANALVA</b></div>
      <Heading className="contact-form__title">{copy.title}</Heading>

      <div className="form-grid">
        <label>Tipo de cliente
          <select name="tipoCliente" required defaultValue={variant === "sierra-nevada" ? "Apartamentos turísticos o gestor" : ""} aria-invalid={Boolean(state.fieldErrors?.tipoCliente)} aria-describedby={describedBy("tipoCliente")}>
            <option value="" disabled>Selecciona una opción</option>
            {BUSINESS_TYPES.map((type) => <option key={type}>{type}</option>)}
          </select>
          {error("tipoCliente")}
        </label>
        <label>Servicio
          <select name="servicio" required defaultValue={defaultService} aria-invalid={Boolean(state.fieldErrors?.servicio)} aria-describedby={describedBy("servicio")}>
            <option value="" disabled>Selecciona un servicio</option>
            {SERVICE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          {error("servicio")}
        </label>
        <label>Nombre comercial <small>(si es una empresa)</small>
          <input name="empresa" type="text" autoComplete="organization" maxLength={160} />
        </label>
        <label>Persona de contacto
          <input name="contacto" type="text" autoComplete="name" required maxLength={120} aria-invalid={Boolean(state.fieldErrors?.contacto)} aria-describedby={describedBy("contacto")} />
          {error("contacto")}
        </label>
        <label>Teléfono
          <input name="telefono" type="tel" autoComplete="tel" inputMode="tel" maxLength={30} aria-invalid={Boolean(state.fieldErrors?.telefono)} aria-describedby={describedBy("telefono")} />
          {error("telefono")}
        </label>
        <label>Correo electrónico
          <input name="email" type="email" autoComplete="email" required maxLength={160} aria-invalid={Boolean(state.fieldErrors?.email)} aria-describedby={describedBy("email")} />
          {error("email")}
        </label>
      </div>

      <details className="form-more" open={variant === "sierra-nevada"}>
        <summary>Añadir datos operativos <small>(opcional, nos ayuda a preparar la propuesta)</small></summary>
        <div className="form-grid">
          <label>Ubicación
            <input name="ubicacion" type="text" maxLength={160} placeholder={variant === "sierra-nevada" ? "p. ej. Pradollano" : "Municipio o zona"} />
          </label>
          <label>Nº de alojamientos o espacios
            <input name="unidades" type="text" inputMode="numeric" maxLength={60} placeholder="p. ej. 6 apartamentos" />
          </label>
          <label>Volumen aproximado de ropa
            <input name="volumen" type="text" maxLength={120} placeholder="p. ej. 40 juegos por semana" />
          </label>
          <label>Frecuencia
            <select name="frecuencia" defaultValue="" aria-invalid={Boolean(state.fieldErrors?.frecuencia)} aria-describedby={describedBy("frecuencia")}>
              <option value="">Sin indicar</option>
              {FREQUENCIES.map((frequency) => <option key={frequency}>{frequency}</option>)}
            </select>
            {error("frecuencia")}
          </label>
          <label>Temporada o fecha de inicio
            <input name="inicio" type="text" maxLength={120} defaultValue={variant === "sierra-nevada" ? "Temporada 2026/27" : ""} />
          </label>
          <label className="form-message">Información adicional
            <textarea name="mensaje" rows={4} maxLength={3000} />
          </label>
        </div>
      </details>

      {/* Campo trampa antispam: oculto para personas y lectores de pantalla. */}
      <div className="form-trap" aria-hidden="true">
        <label>No rellenes este campo<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input type="hidden" name="formulario" value={variant} />
      <input type="hidden" name="startedAt" />
      <input type="hidden" name="submissionKey" />
      <input type="hidden" name="pagina" />
      <input type="hidden" name="paginaEntrada" />
      <input type="hidden" name="referrer" />
      {UTM_KEYS.map((key) => <input key={key} type="hidden" name={key} />)}

      {turnstileKey ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="lazyOnload" />
          <div className="cf-turnstile" data-sitekey={turnstileKey} data-language="es" />
        </>
      ) : null}

      <label className="form-consent">
        <input type="checkbox" name="consentimiento" required aria-invalid={Boolean(state.fieldErrors?.consentimiento)} aria-describedby={describedBy("consentimiento")} />
        <span>He leído la <Link href="/politica-de-privacidad">política de privacidad</Link> y acepto que Limpiezas Granalva trate estos datos para responder a mi solicitud y preparar el presupuesto, según el <Link href="/aviso-legal">aviso legal</Link>.</span>
      </label>
      {error("consentimiento")}
      <p className="form-privacy" id={`${variant}-form-note`}>
        <b>Información básica sobre protección de datos.</b> Responsable: {BUSINESS.legalOwner} ({BUSINESS.name}). Finalidad: responder a tu solicitud.
        Legitimación: tu consentimiento. No se ceden datos a terceros salvo obligación legal. Puedes ejercer tus derechos escribiendo a
        {" "}<a href="mailto:info@limpiezasgranalva.com">info@limpiezasgranalva.com</a>. No enviamos comunicaciones comerciales automáticas.
        {" "}<Link href="/politica-de-privacidad">Política de privacidad completa</Link>.
      </p>

      <button className="button button--dark form-submit" type="submit" disabled={pending}>
        {pending ? "Enviando…" : copy.submit} <span>→</span>
      </button>
      <div className={`form-status form-status--${state.status}`} ref={statusRef} tabIndex={-1} role={state.status === "error" ? "alert" : "status"} aria-live="polite">
        {state.message}
      </div>
    </form>
  );
}
