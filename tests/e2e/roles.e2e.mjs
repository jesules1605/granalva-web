// Permisos por rol y cierre de sesión: node tests/e2e/roles.e2e.mjs <base>
// Variables: E2E_ADMIN_EMAIL/PASSWORD y E2E_EDITOR_EMAIL/PASSWORD (cuentas de pruebas).
import assert from "node:assert/strict";
const base = process.argv[2] ?? "http://localhost:3000";
const login = async (email, password) => {
  const r = await fetch(`${base}/api/users/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
  assert.equal(r.status, 200, `login ${email}`);
  return (await r.json()).token;
};
const call = (path, token, init = {}) => fetch(`${base}${path}`, { ...init, headers: { ...(init.headers ?? {}), ...(token ? { authorization: `JWT ${token}` } : {}) } });
const admin = await login(process.env.E2E_ADMIN_EMAIL, process.env.E2E_ADMIN_PASSWORD);
const editor = await login(process.env.E2E_EDITOR_EMAIL, process.env.E2E_EDITOR_PASSWORD);

assert.equal((await call("/api/contact-submissions?limit=1", admin)).status, 200, "admin ve solicitudes");
assert.equal((await call("/api/contact-submissions/export.csv", admin)).status, 200, "admin exporta CSV");
assert.equal((await call("/api/contact-submissions?limit=1", editor)).status, 403, "editor NO ve solicitudes");
assert.equal((await call("/api/contact-submissions/export.csv", editor)).status, 403, "editor NO exporta");
assert.equal((await call("/api/pages?limit=1&draft=true", editor)).status, 200, "editor ve páginas");
assert.equal((await call("/api/reviews?limit=1", editor)).status, 200, "editor gestiona reseñas");
const users = await (await call("/api/users?limit=5", editor)).json();
assert.ok((users.docs ?? []).every((u) => u.email === process.env.E2E_EDITOR_EMAIL), "editor solo se ve a sí mismo");
const promote = await call(`/api/users/${users.docs[0].id}`, editor, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ role: "owner" }) });
const after = (await (await call("/api/users/me", editor)).json()).user;
assert.equal(after.role, "editor", `un editor no puede ascenderse (HTTP ${promote.status})`);
console.log("ok - permisos: admin (solicitudes y CSV) / editor (contenido, sin solicitudes ni usuarios)");

await call("/api/users/logout", admin, { method: "POST" });
assert.equal((await call("/api/contact-submissions?limit=1")).status, 403, "sin sesión no hay acceso");
const panel = await fetch(`${base}/admin`, { redirect: "manual" });
const html = await panel.text();
assert.ok(/login|iniciar sesi/i.test(html) || [302, 307].includes(panel.status), "sin sesión, /admin pide iniciar sesión");
assert.match(panel.headers.get("x-robots-tag") ?? "", /noindex/);
console.log("ok - cierre de sesión: /admin pide credenciales y la API privada responde 403");
