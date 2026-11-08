// Prueba de extremo a extremo de la gestión de contenido en el panel (Payload).
// Uso: node tests/e2e/panel.e2e.mjs http://localhost:3000 (con base de datos y carga inicial hecha).
// Credenciales: E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD (por defecto, el usuario local de pruebas).
// Deja la web como estaba: restaura y borra todo lo que crea. NO ejecutar contra producción.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const base = process.argv[2] ?? "http://localhost:3000";
const email = process.env.E2E_ADMIN_EMAIL ?? "e2e-propietario@example.com";
const password = process.env.E2E_ADMIN_PASSWORD ?? "E2e-Granalva-solo-local-2026!";
const ok = (message) => console.log(`ok - ${message}`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const cleanup = [];

const login = await (await fetch(`${base}/api/users/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) })).json();
assert.ok(login.token, "inicio de sesión");
const auth = { authorization: `JWT ${login.token}` };
const api = async (path, method = "GET", body) => {
  const response = await fetch(`${base}${path}`, { method, headers: { ...auth, ...(body ? { "content-type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { status: response.status, json: await response.json().catch(() => ({})) };
};
const html = async (path, headers = {}) => (await fetch(`${base}${path}`, { headers })).text();
ok("inicio de sesión del propietario");

try {
  // 1. Subir una imagen y usarla en Sierra Nevada; después restaurar la versión anterior.
  const form = new FormData();
  form.append("file", new Blob([readFileSync("public/fotos/sala-reformada-fin-de-obra.jpg")], { type: "image/jpeg" }), "prueba-e2e-sierra.jpg");
  form.append("_payload", JSON.stringify({ alt: "Imagen de prueba E2E para Sierra Nevada", credit: "Prueba automática", category: "sierra-nevada" }));
  const upload = await fetch(`${base}/api/media`, { method: "POST", headers: auth, body: form });
  const media = (await upload.json()).doc;
  assert.equal(upload.status, 201, "subida de imagen");
  cleanup.push(`/api/media/${media.id}`);
  ok(`imagen subida a la biblioteca (${media.filename})`);

  const sierra = (await api("/api/services?where[slug][equals]=lavanderia-sierra-nevada&depth=0")).json.docs[0];
  assert.ok(sierra, "documento de Sierra Nevada (ejecuta antes la carga inicial)");
  const originalImage = sierra.heroImage;
  assert.equal((await api(`/api/services/${sierra.id}`, "PATCH", { heroImage: media.id, heroOverlay: 70, _status: "published" })).status, 200);
  await sleep(800);
  assert.ok((await html("/servicios/lavanderia-sierra-nevada")).includes(encodeURIComponent(`/api/media/file/${media.filename}`)), "Sierra Nevada muestra la imagen nueva");
  ok("sustitución de la fotografía de Sierra Nevada");

  const versions = (await api(`/api/services/versions?where[parent][equals]=${sierra.id}&sort=-createdAt&limit=10&depth=0`)).json.docs;
  const previous = versions.find((version) => version.version.heroImage === originalImage && version.version._status === "published");
  assert.ok(previous, "existe una versión anterior");
  assert.equal((await api(`/api/services/versions/${previous.id}`, "POST")).status, 200, "restaurar versión");
  await api(`/api/services/${sierra.id}`, "PATCH", { _status: "published" });
  await sleep(800);
  assert.ok(!(await html("/servicios/lavanderia-sierra-nevada")).includes(media.filename), "restaurada la imagen original");
  ok("restauración de una versión anterior");

  // 2. Portada: borrador visible solo en vista previa; publicación.
  const homeBefore = (await api("/api/globals/home-page?depth=0")).json;
  assert.equal((await api("/api/globals/home-page?draft=true", "POST", { subtitle: "Subtítulo en borrador de la prueba E2E." })).status, 200);
  assert.ok(!(await html("/")).includes("Subtítulo en borrador de la prueba E2E."), "el borrador no es público");
  const preview = await fetch(`${base}/api/preview?path=/servicios/lavanderia-sierra-nevada`, { headers: auth, redirect: "manual" });
  const bypass = (preview.headers.get("set-cookie") ?? "").match(/__prerender_bypass=[^;]+/)?.[0];
  assert.ok(bypass, "vista previa activada para un usuario con sesión");
  assert.equal((await fetch(`${base}/api/preview?path=/servicios/lavanderia-sierra-nevada`, { redirect: "manual" })).status, 401, "sin sesión no hay vista previa");
  ok("borrador de la portada oculto al público y vista previa protegida");
  assert.equal((await api("/api/globals/home-page", "POST", { subtitle: "Subtítulo publicado de la prueba E2E.", _status: "published" })).status, 200);
  await sleep(800);
  assert.ok((await html("/")).includes("Subtítulo publicado de la prueba E2E."), "portada publicada");
  await api("/api/globals/home-page", "POST", { subtitle: homeBefore.subtitle ?? null, _status: "published" });
  ok("edición y publicación de la portada");

  // 3. Páginas: salvaguardas SEO.
  const twoHeroes = await api("/api/pages", "POST", { title: "Dos portadas", slug: "dos-portadas-e2e", _status: "published", layout: [{ blockType: "hero" }, { blockType: "hero" }] });
  assert.equal(twoHeroes.status, 400, "dos H1 rechazados");
  assert.equal((await api("/api/pages", "POST", { title: "Reservada", slug: "servicios", _status: "published" })).status, 400, "slug reservado rechazado");
  assert.equal((await api("/api/pages", "POST", { title: "Sin confirmar", slug: "sin-confirmar-e2e", _status: "published", seo: { noindex: true } })).status, 400, "noindex sin confirmación rechazado");
  assert.equal((await api("/api/pages", "POST", { title: "Canonical", slug: "canonical-e2e", _status: "published", seo: { canonical: "https://granalva.vercel.app/x" } })).status, 400, "canonical de Vercel rechazado");
  ok("salvaguardas: un H1, slug reservado, noindex confirmado y canonical del dominio");

  const created = await api("/api/pages", "POST", {
    title: "Página de prueba E2E",
    slug: "prueba-e2e",
    _status: "published",
    layout: [{ blockType: "cards", heading: "Tarjetas de prueba", items: [{ title: "Uno", text: "Texto uno" }] }, { blockType: "cta", heading: "Llamada de prueba", hidden: true }],
  });
  assert.equal(created.status, 201, JSON.stringify(created.json).slice(0, 300));
  const pageId = created.json.doc.id;
  cleanup.push(`/api/pages/${pageId}`);
  await sleep(61_000); // caché de páginas publicadas del proxy
  const page = await html("/prueba-e2e");
  assert.match(page, /<h1[^>]*>Página de prueba E2E<\/h1>/, "página nueva publicada");
  assert.equal((page.match(/<h1/g) ?? []).length, 1, "un solo H1");
  assert.ok(page.includes("Tarjetas de prueba") && !page.includes("Llamada de prueba"), "sección oculta no se muestra");
  assert.match(page, /<link rel="canonical" href="https:\/\/limpiezasgranalva\.com\/prueba-e2e"/);
  ok("creación de página con secciones y sección oculta");

  assert.equal((await api(`/api/pages/${pageId}`, "PATCH", { slug: "prueba-e2e-nueva", _status: "published" })).status, 200);
  const redirect = (await api("/api/redirects?where[from][equals]=/prueba-e2e&depth=0")).json.docs[0];
  assert.equal(redirect?.to, "/prueba-e2e-nueva", "redirección automática creada");
  cleanup.push(`/api/redirects/${redirect.id}`);
  await sleep(61_000);
  const hop = await fetch(`${base}/prueba-e2e`, { redirect: "manual" });
  assert.equal(hop.status, 301);
  assert.equal(new URL(hop.headers.get("location"), base).pathname, "/prueba-e2e-nueva");
  ok("cambio de slug con 301 automático y sin cadenas");

  const draft = await api("/api/pages?draft=true", "POST", { title: "Borrador E2E", slug: "borrador-e2e", _status: "draft" });
  cleanup.push(`/api/pages/${draft.json.doc.id}`);
  await sleep(61_000);
  assert.equal((await fetch(`${base}/borrador-e2e`)).status, 404, "borrador no público");
  const previewHtml = await html("/borrador-e2e", { cookie: bypass });
  assert.match(previewHtml, /Borrador E2E/, "borrador visible en vista previa");
  ok("borrador privado visible solo en vista previa");
} finally {
  for (const path of cleanup.reverse()) await api(path, "DELETE");
}
ok("limpieza de datos de prueba");
