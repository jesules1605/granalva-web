// Prueba de extremo a extremo del panel (Payload) contra la web en marcha y su base de datos.
// Uso: node tests/e2e/cms.e2e.mjs http://localhost:3000
// Con una base de datos vacía crea el primer usuario (propietario). Si ya hay usuarios,
// usa E2E_ADMIN_EMAIL y E2E_ADMIN_PASSWORD. Todo lo que crea lo borra al terminar.
// NO ejecutar contra producción.
import assert from "node:assert/strict";

const base = process.argv[2] ?? "http://localhost:3000";
const email = process.env.E2E_ADMIN_EMAIL ?? "e2e-propietario@example.com";
const password = process.env.E2E_ADMIN_PASSWORD ?? "E2e-Granalva-solo-local-2026!";
const cleanup = [];
const cleanupPatch = [];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ok = (message) => console.log(`ok - ${message}`);

async function api(path, { method = "GET", body, token } = {}) {
  const response = await fetch(`${base}${path}`, {
    method,
    redirect: "manual",
    headers: { "content-type": "application/json", ...(token ? { authorization: `JWT ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { json = undefined; }
  return { status: response.status, headers: response.headers, text, json };
}

// 1. Acceso: primer usuario o credenciales indicadas.
let token;
const init = await api("/api/users/init");
if (init.json?.initialized === false) {
  const created = await api("/api/users/first-register", { method: "POST", body: { email, password, name: "Prueba E2E" } });
  assert.equal(created.status, 200, `first-register: ${created.text}`);
  token = created.json.token;
  ok("primer usuario creado como propietario");
} else {
  const login = await api("/api/users/login", { method: "POST", body: { email, password } });
  assert.equal(login.status, 200, "login (define E2E_ADMIN_EMAIL y E2E_ADMIN_PASSWORD)");
  token = login.json.token;
}
const me = await api("/api/users/me", { token });
assert.equal(me.json.user.role, "owner");
ok("sesión de propietario");

try {
  // 2. Panel y API no indexables; las solicitudes no son públicas.
  const admin = await fetch(`${base}/admin`);
  assert.equal(admin.status, 200);
  assert.match(admin.headers.get("x-robots-tag") ?? "", /noindex/);
  assert.equal((await api("/api/contact-submissions")).status, 403, "solicitudes sin sesión → 403");
  assert.equal((await api("/api/contact-submissions/export.csv")).status, 403, "CSV sin sesión → 403");
  ok("panel noindex y solicitudes privadas");

  // 3. Estados del embudo y exportación CSV.
  const list = await api("/api/contact-submissions?limit=1&sort=-createdAt", { token });
  const submission = list.json.docs[0];
  assert.ok(submission, "hay al menos una solicitud (ejecuta antes tests/e2e/contact-form.e2e.mjs)");
  const original = submission.status;
  for (const status of ["contactado", "presupuesto-enviado", "ganado", "perdido", "nuevo"]) {
    const updated = await api(`/api/contact-submissions/${submission.id}`, { method: "PATCH", token, body: { status } });
    assert.equal(updated.status, 200, `estado ${status}`);
  }
  assert.equal((await api(`/api/contact-submissions/${submission.id}`, { method: "PATCH", token, body: { status: "nueva" } })).status, 400, "estado antiguo rechazado");
  await api(`/api/contact-submissions/${submission.id}`, { method: "PATCH", token, body: { status: original } });
  const csv = await api("/api/contact-submissions/export.csv", { token });
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get("content-type"), /text\/csv/);
  // fetch elimina el BOM al decodificar: se comprueba sobre los bytes.
  const bytes = new Uint8Array(await (await fetch(`${base}/api/contact-submissions/export.csv`, { headers: { authorization: `JWT ${token}` } })).arrayBuffer());
  assert.deepEqual([...bytes.slice(0, 3)], [0xef, 0xbb, 0xbf], "BOM UTF-8 para Excel");
  assert.ok(csv.text.startsWith("Referencia;Fecha;Estado"), "cabecera del CSV");
  assert.ok(csv.text.includes(submission.reference), "la solicitud aparece en el CSV");
  ok("estados nuevo/contactado/presupuesto enviado/ganado/perdido y exportación CSV");

  // 4. Redirecciones del panel: protegen páginas reales y responden con un único 301.
  assert.equal((await api("/api/redirects", { method: "POST", token, body: { from: "/servicios", to: "/contacto", type: "301" } })).status, 400, "no se puede redirigir una página real");
  const redirect = await api("/api/redirects", { method: "POST", token, body: { from: "/pagina-antigua-e2e", to: "/servicios/renting-textil-granada", type: "301", note: "prueba" } });
  assert.equal(redirect.status, 201);
  cleanup.push(`/api/redirects/${redirect.json.doc.id}`);
  await sleep(61_000); // caché de reglas del proxy
  const hop = await fetch(`${base}/pagina-antigua-e2e/`, { redirect: "manual" });
  assert.equal(hop.status, 301);
  assert.equal(new URL(hop.headers.get("location"), base).pathname, "/servicios/renting-textil-granada");
  ok("redirección del panel en un solo 301 (incluida la barra final)");

  // 5. Ajustes de servicio publicados → la página se regenera con ellos.
  const description = "Renting textil para hoteles y apartamentos en Granada: sábanas y toallas con lavandería, recogida y entrega incluidas. Prueba E2E.";
  const existing = (await api("/api/services?where[slug][equals]=renting-textil-granada&depth=0", { token })).json.docs[0];
  let serviceId;
  if (existing) {
    serviceId = existing.id;
    const previousDescription = existing.metaDescription ?? null;
    assert.equal((await api(`/api/services/${serviceId}`, { method: "PATCH", token, body: { metaDescription: description, _status: "published" } })).status, 200);
    cleanupPatch.push([`/api/services/${serviceId}`, { metaDescription: previousDescription, _status: "published" }]);
  } else {
    const service = await api("/api/services", { method: "POST", token, body: { slug: "renting-textil-granada", metaDescription: description, _status: "published" } });
    assert.equal(service.status, 201, service.text);
    cleanup.push(`/api/services/${service.json.doc.id}`);
  }
  await fetch(`${base}/servicios/renting-textil-granada`);
  await sleep(1500);
  const page = await (await fetch(`${base}/servicios/renting-textil-granada`)).text();
  assert.ok(page.includes(description.replace(/:/g, ":")), "la meta description del panel se aplica");
  ok("ajustes de servicio del panel aplicados (revalidación bajo demanda)");

  // 6. Blog: artículo publicado con Article JSON-LD y en el sitemap; borrador invisible.
  const content = { root: { type: "root", version: 1, direction: "ltr", format: "", indent: 0, children: [{ type: "paragraph", version: 1, direction: "ltr", format: "", indent: 0, textFormat: 0, children: [{ type: "text", version: 1, text: "Contenido de prueba.", format: 0, detail: 0, mode: "normal", style: "" }] }] } };
  const post = await api("/api/posts", { method: "POST", token, body: { title: "Artículo de prueba E2E", excerpt: "Entradilla de prueba para comprobar el blog.", content, publishedAt: new Date().toISOString(), _status: "published" } });
  assert.equal(post.status, 201, post.text);
  cleanup.push(`/api/posts/${post.json.doc.id}`);
  const slug = post.json.doc.slug;
  assert.equal(slug, "articulo-de-prueba-e2e");
  await sleep(61_000); // caché de artículos publicados del proxy
  const article = await fetch(`${base}/blog/${slug}`);
  assert.equal(article.status, 200);
  const articleHtml = await article.text();
  assert.match(articleHtml, /"@type":"Article"/);
  assert.match(articleHtml, /<h1>Artículo de prueba E2E<\/h1>/);
  assert.ok((await (await fetch(`${base}/sitemaps/blog.xml`)).text()).includes(`/blog/${slug}`), "artículo en el sitemap del blog");
  assert.ok((await (await fetch(`${base}/blog/rss.xml`)).text()).includes(`/blog/${slug}`), "artículo en el RSS");
  const draft = await api("/api/posts?draft=true", { method: "POST", token, body: { title: "Borrador E2E", excerpt: "No debe verse.", content, _status: "draft" } });
  cleanup.push(`/api/posts/${draft.json.doc.id}`);
  assert.equal((await fetch(`${base}/blog/${draft.json.doc.slug}`)).status, 404, "un borrador no es público");
  ok("blog: publicado visible con Article y sitemap; borrador oculto");

  // 7. Logotipos: sin autorización no se publican.
  assert.equal((await api("/api/client-logos")).json.docs.length, 0, "API pública sin logotipos no autorizados");
  ok("logotipos de clientes solo con autorización");
} finally {
  for (const [path, body] of cleanupPatch) await api(path, { method: "PATCH", token, body });
  for (const path of cleanup.reverse()) await api(path, { method: "DELETE", token });
  await fetch(`${base}/servicios/renting-textil-granada`);
}
console.log("ok - limpieza de datos de prueba");
