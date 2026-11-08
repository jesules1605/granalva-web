import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * Autorización de las tareas de puesta en marcha (carga inicial y cuenta de pruebas)
 * con la clave SETUP_TOKEN guardada como secreta en el alojamiento. Sin esa variable,
 * o con una clave corta, estas rutas quedan desactivadas. Retírala al terminar.
 */
export function hasSetupToken(request: Request) {
  const expected = process.env.SETUP_TOKEN ?? "";
  if (expected.length < 32) return false;
  const given = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
