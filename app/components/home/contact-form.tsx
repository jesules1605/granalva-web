"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [contactStatus, setContactStatus] = useState("");

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
  );
}
