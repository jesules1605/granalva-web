import "server-only";
import config from "@payload-config";
import { getPayload } from "payload";
import type { ContactSubmission as SubmissionDoc } from "../../payload-types";
import type { ContactSubmission } from "./contact-schema";
import { SERVICE_OPTIONS } from "./contact-schema";
import { SITE_URL } from "./services";

/** Referencia legible para el cliente: GRN-AAAAMMDD-XXXX. */
function newReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GRN-${date}-${random}`;
}

/**
 * Registra la solicitud en Payload (colección `contact-submissions`) y avisa por
 * correo a Granalva. Si el correo falla, la solicitud no se pierde: queda
 * registrada con `emailStatus` = error para reintentarla desde el panel.
 * No se envía ninguna respuesta automática al cliente.
 */
export async function storeSubmission(data: ContactSubmission, submissionKey?: string): Promise<{ reference: string; emailSent: boolean; duplicate?: boolean }> {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
    throw new Error("Payload no está configurado (DATABASE_URL / PAYLOAD_SECRET).");
  }
  const payload = await getPayload({ config });

  // Envíos duplicados: misma clave de formulario (doble clic, reenvío del navegador)
  // o mismo correo, servicio y mensaje en los últimos 10 minutos. Se devuelve la
  // solicitud ya registrada, sin crear otra ni repetir el aviso por correo.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const existing = await payload.find({
    collection: "contact-submissions",
    overrideAccess: true,
    limit: 1,
    depth: 0,
    where: {
      or: [
        ...(submissionKey ? [{ submissionKey: { equals: submissionKey } }] : []),
        { and: [{ email: { equals: data.email } }, { servicio: { equals: data.servicio } }, { mensaje: { equals: data.mensaje } }, { createdAt: { greater_than: since } }] },
      ],
    },
  });
  if (existing.docs[0]) return { reference: existing.docs[0].reference, emailSent: existing.docs[0].emailStatus === "enviado", duplicate: true };

  const reference = newReference();
  const doc = await payload.create({
    collection: "contact-submissions",
    overrideAccess: true,
    // `servicio` ya está validado contra SERVICE_OPTIONS en parseSubmission().
    data: { ...data, servicio: data.servicio as SubmissionDoc["servicio"], reference, status: "nuevo", emailStatus: "pendiente", submissionKey },
  });

  if (!process.env.SMTP_HOST) return { reference, emailSent: false };

  const serviceLabel = SERVICE_OPTIONS.find((option) => option.value === data.servicio)?.label ?? data.servicio;
  try {
    await payload.sendEmail({
      to: process.env.CONTACT_TO_EMAIL || "info@limpiezasgranalva.com",
      replyTo: data.email,
      subject: `Nueva solicitud ${reference} · ${serviceLabel}${data.empresa ? ` · ${data.empresa}` : ""}`,
      text: [
        `Referencia: ${reference}`,
        `Servicio: ${serviceLabel}`,
        `Tipo de cliente: ${data.tipoCliente}`,
        `Empresa: ${data.empresa || "—"}`,
        `Contacto: ${data.contacto}`,
        `Teléfono: ${data.telefono || "—"}`,
        `Correo: ${data.email}`,
        data.ubicacion && `Ubicación: ${data.ubicacion}`,
        data.unidades && `Alojamientos/espacios: ${data.unidades}`,
        data.volumen && `Volumen: ${data.volumen}`,
        data.frecuencia && `Frecuencia: ${data.frecuencia}`,
        data.inicio && `Inicio: ${data.inicio}`,
        data.mensaje && `\n${data.mensaje}`,
        `\nVer en el panel: ${process.env.PAYLOAD_SERVER_URL || SITE_URL}/admin/collections/contact-submissions/${doc.id}`,
      ].filter(Boolean).join("\n"),
    });
    await payload.update({ collection: "contact-submissions", id: doc.id, overrideAccess: true, data: { emailStatus: "enviado" } });
    return { reference, emailSent: true };
  } catch (error) {
    await payload.update({
      collection: "contact-submissions",
      id: doc.id,
      overrideAccess: true,
      data: { emailStatus: "error", emailError: error instanceof Error ? error.message.slice(0, 250) : "Error desconocido" },
    });
    return { reference, emailSent: false };
  }
}
