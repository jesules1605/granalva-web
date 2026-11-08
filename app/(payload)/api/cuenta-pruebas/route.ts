import config from "@payload-config";
import { getPayload } from "payload";
import { hasSetupToken } from "../../../lib/setup-token";

// Cuenta temporal para las pruebas automáticas en la preproducción real (rol admin,
// nunca propietario). Solo con SETUP_TOKEN. POST crea o actualiza; DELETE la borra.
// La contraseña la genera quien ejecuta las pruebas y no se guarda en ningún archivo.
const EMAIL = "pruebas-automaticas@limpiezasgranalva.com";

export async function POST(request: Request) {
  if (!hasSetupToken(request)) return Response.json({ error: "No autorizado" }, { status: 403 });
  const { password, role = "admin" } = (await request.json()) as { password?: string; role?: "admin" | "editor" };
  if (!password || password.length < 20 || !["admin", "editor"].includes(role)) return Response.json({ error: "Datos no válidos" }, { status: 400 });
  const payload = await getPayload({ config });
  const email = role === "editor" ? EMAIL.replace("pruebas-", "pruebas-editor-") : EMAIL;
  const existing = await payload.find({ collection: "users", where: { email: { equals: email } }, limit: 1, depth: 0, overrideAccess: true });
  const data = { email, password, name: `Pruebas automáticas (${role}, borrar al terminar)`, role, active: true };
  const doc = existing.docs[0]
    ? await payload.update({ collection: "users", id: existing.docs[0].id, data, overrideAccess: true })
    : await payload.create({ collection: "users", data, overrideAccess: true });
  return Response.json({ ok: true, email: doc.email, role: doc.role });
}

export async function DELETE(request: Request) {
  if (!hasSetupToken(request)) return Response.json({ error: "No autorizado" }, { status: 403 });
  const payload = await getPayload({ config });
  const result = await payload.delete({ collection: "users", where: { email: { like: "pruebas-" } }, overrideAccess: true });
  return Response.json({ ok: true, borradas: result.docs.map((doc) => doc.email) });
}
