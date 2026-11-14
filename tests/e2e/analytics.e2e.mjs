// Prueba de extremo a extremo de la analítica (consentimiento, capa de datos y conversiones).
// Uso: web compilada con identificadores de prueba y el dominio de pruebas permitido:
//   NEXT_PUBLIC_GTM_ID=GTM-PRUEBA1 NEXT_PUBLIC_CLARITY_ID=prueba123 \
//   NEXT_PUBLIC_ANALYTICS_EXTRA_HOSTS=localhost npm run build && npm start
//   node tests/e2e/analytics.e2e.mjs http://localhost:3000
// Opcional (comprueba la atribución guardada): E2E_ADMIN_EMAIL y E2E_ADMIN_PASSWORD.
// En producción, solo con ?granalva_interno=1 para no ensuciar los datos reales.
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const PII = [/e2e@example\.com/i, /600 ?000 ?000/, /Persona de prueba/i, /Prueba automática/i];

async function newVisitor() {
  const context = await browser.newContext();
  const page = await context.newPage();
  const requests = [];
  const errors = [];
  page.on("request", (request) => {
    if (/googletagmanager\.com|google-analytics\.com|clarity\.ms/.test(request.url())) requests.push(request.url());
  });
  // Bloquea la red de terceros: la prueba mide si se pide, no la respuesta.
  await context.route(/googletagmanager\.com|google-analytics\.com|clarity\.ms|cloudflareinsights\.com/, (route) => route.abort());
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/ERR_FAILED|net::|Failed to load resource/.test(message.text())) errors.push(message.text());
  });
  return { context, page, requests, errors };
}
const layer = (page) => page.evaluate(() => (window.dataLayer ?? []).filter((item) => item && typeof item === "object" && !Array.isArray(item) && "event" in item && !String(item.event).startsWith("gtm.")).map((item) => ({ ...item })));
const count = (events, name, filter = () => true) => events.filter((item) => item.event === name && filter(item)).length;

// 1-2. Sin elección y con rechazo: nada de GA4, Tag Manager ni Clarity.
{
  const { context, page, requests, errors } = await newVisitor();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.waitForSelector(".cookie-banner");
  const buttons = await page.locator(".cookie-banner__actions button").allTextContents();
  assert.deepEqual(buttons, ["Rechazar", "Configurar", "Aceptar"], "primera capa: rechazar, configurar y aceptar");
  const sizes = await page.locator(".cookie-banner__actions button").evaluateAll((items) => items.map((item) => `${item.className}`));
  assert.equal(new Set(sizes).size, 1, "aceptar y rechazar con el mismo estilo");
  assert.equal(requests.length, 0, "nada se carga antes de elegir");
  assert.equal((await layer(page)).length, 0, "ningún evento antes de elegir");
  await page.getByRole("button", { name: "Rechazar" }).click();
  await page.goto(`${base}/servicios/lavanderia-profesional-granada`, { waitUntil: "networkidle" });
  await page.locator("header .header-cta").click();
  await page.waitForLoadState("networkidle");
  assert.equal(requests.length, 0, "rechazar impide la carga");
  assert.equal((await layer(page)).length, 0, "rechazar impide los eventos");
  assert.equal(errors.length, 0, errors.join("\n"));
  await context.close();
  console.log("ok - sin consentimiento o con rechazo no se carga ni se envía nada");
}

// 3-10. Con consentimiento: vistas, clics y formulario.
const visitor = await newVisitor();
const { page, requests, errors } = visitor;
await page.goto(`${base}/servicios/lavanderia-sierra-nevada?utm_source=email&utm_medium=outreach&utm_campaign=sierra_nevada_e2e&utm_content=boton&utm_term=lavanderia`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Aceptar" }).click();
await page.waitForTimeout(800);
let events = await layer(page);
assert.equal(count(events, "page_view"), 1, "una única vista al aceptar");
assert.equal(count(events, "sierra_nevada_view"), 1, "vista de Sierra Nevada");
assert.equal(count(events, "business_service_view"), 1, "servicio para empresas");
assert.ok(requests.some((url) => url.includes("gtm.js?id=GTM-PRUEBA1")), "Tag Manager se carga tras aceptar");
console.log("ok - una vista por página y Tag Manager tras aceptar");

// Navegación interna de Next.js: una vista por ruta.
await page.locator("header nav a[href='/servicios']").first().click();
await page.waitForURL(/\/servicios$/);
await page.waitForTimeout(600);
events = await layer(page);
assert.equal(count(events, "page_view", (e) => e.page_path === "/servicios"), 1, "navegación interna registra la ruta una vez");
assert.equal(count(events, "page_view"), 2, "sin vistas duplicadas por hidratación");
console.log("ok - navegación interna sin duplicados");

// Botón superior de presupuesto: un único quote_cta_click con su ubicación.
await page.locator("header .header-cta").click();
await page.waitForURL(/\/contacto/);
await page.waitForTimeout(600);
events = await layer(page);
assert.equal(count(events, "quote_cta_click"), 1, "un solo clic de presupuesto");
assert.equal(events.find((e) => e.event === "quote_cta_click").cta_location, "header", "ubicación del botón");

// Clic en teléfono: una sola vez (sin abrir la llamada).
await page.evaluate(() => document.querySelectorAll("a[href^='tel:']").forEach((a) => a.addEventListener("click", (e) => e.preventDefault())));
await page.locator("main a[href^='tel:']:visible, footer a[href^='tel:']:visible").first().click();
await page.waitForTimeout(300);
events = await layer(page);
assert.equal(count(events, "phone_click"), 1, "un solo clic de teléfono");
assert.equal(events.find((e) => e.event === "phone_click").conversion_type, "call");
const wa = page.locator("a[href*='wa.me']");
if (await wa.count()) {
  await page.evaluate(() => document.querySelectorAll("a[href*='wa.me']").forEach((a) => a.addEventListener("click", (e) => e.preventDefault())));
  await page.locator("a[href*='wa.me']:visible").first().click();
  await page.waitForTimeout(300);
  assert.equal(count(await layer(page), "whatsapp_click"), 1, "un solo clic de WhatsApp");
  console.log("ok - WhatsApp registrado una vez");
} else {
  console.log("aviso - sin enlace de WhatsApp configurado (NEXT_PUBLIC_WHATSAPP_NUMBER)");
}
console.log("ok - presupuesto y teléfono registrados una vez con su ubicación");

// Formulario: vista, inicio, error de validación, error del servidor sin conversión y éxito único.
const form = page.locator("form.contact-form");
await form.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
await form.locator("[name=contacto]").focus();
await form.locator("button[type=submit]").click(); // campos obligatorios vacíos: validación del navegador
await page.waitForTimeout(300);
events = await layer(page);
assert.equal(count(events, "quote_form_view"), 1, "vista del formulario");
assert.equal(count(events, "quote_form_start"), 1, "inicio del formulario");
assert.ok(count(events, "quote_form_validation_error") >= 1, "error de validación registrado");
assert.equal(count(events, "quote_form_success"), 0, "un error de validación no es una conversión");

await form.locator("[name=tipoCliente]").selectOption("Apartamentos turísticos o gestor");
await form.locator("[name=servicio]").selectOption("lavanderia-sierra-nevada");
await form.locator("[name=empresa]").fill("Prueba automática analítica");
await form.locator("[name=contacto]").fill("Persona de prueba");
await form.locator("[name=telefono]").fill("600 000 000");
await form.locator("[name=email]").fill("e2e@example.com");
await form.locator("summary").click();
await form.locator("[name=mensaje]").fill(`Prueba automática de analítica ${Date.now()}`);
await form.locator("[name=consentimiento]").check();
// Fallo del servidor (envío demasiado rápido, rechazado por el antispam): no hay conversión.
await page.evaluate(() => { document.querySelector("form.contact-form [name=startedAt]").value = String(Date.now()); });
await form.locator("button[type=submit]").click();
await page.waitForSelector(".form-status--error");
events = await layer(page);
assert.equal(count(events, "quote_form_error"), 1, "error del servidor registrado");
assert.equal(count(events, "quote_form_success"), 0, "una solicitud fallida no es una conversión");
console.log("ok - validación y error del servidor diferenciados, sin conversión");

await page.waitForTimeout(2800);
await form.locator("button[type=submit]").click();
await page.waitForSelector(".contact-form--done", { timeout: 20000 });
await page.waitForTimeout(500);
events = await layer(page);
assert.equal(count(events, "quote_form_submit"), 2, "dos pulsaciones de envío");
assert.equal(count(events, "quote_form_success"), 1, "exactamente una conversión");
const success = events.find((e) => e.event === "quote_form_success");
assert.equal(success.service_slug, "lavanderia-sierra-nevada");
assert.equal(success.audience_type, "empresa");
assert.match(success.event_id, /^[0-9a-f-]{36}$/, "identificador de evento");
assert.equal(count(events, "quote_form_step"), 1, "paso del formulario (datos operativos)");
const reference = (await page.locator(".contact-form--done").innerText()).match(/GRN-\d{8}-[A-Z0-9]{4}/)[0];
console.log("ok - una solicitud correcta genera exactamente una conversión:", reference);

// Ningún dato personal en la capa de datos ni en las URL pedidas a terceros.
const serialized = JSON.stringify(await page.evaluate(() => window.dataLayer));
for (const pattern of PII) assert.doesNotMatch(serialized, pattern, `sin datos personales en la capa de datos (${pattern})`);
for (const url of requests) for (const pattern of PII) assert.doesNotMatch(decodeURIComponent(url), pattern, "sin datos personales en peticiones de analítica");
for (const item of events) for (const key of Object.keys(item)) assert.ok(["event", "page_path", "page_type", "service_slug", "audience_type", "cta_location", "form_type", "campaign_name", "device_category", "language", "conversion_type", "event_id", "traffic_type", "form_field_count", "form_step"].includes(key), `parámetro permitido: ${key}`);
console.log("ok - sin nombres, correos ni teléfonos en la analítica");

// UTM conservados hasta la solicitud (comprobación interna en el panel).
if (process.env.E2E_ADMIN_EMAIL) {
  const login = await fetch(`${base}/api/users/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: process.env.E2E_ADMIN_EMAIL, password: process.env.E2E_ADMIN_PASSWORD }) });
  const { token } = await login.json();
  const found = await (await fetch(`${base}/api/contact-submissions?where[reference][equals]=${reference}&depth=0`, { headers: { authorization: `JWT ${token}` } })).json();
  const doc = found.docs[0];
  assert.equal(doc.attribution.utmSource, "email");
  assert.equal(doc.attribution.utmMedium, "outreach");
  assert.equal(doc.attribution.utmCampaign, "sierra_nevada_e2e");
  assert.equal(doc.attribution.utmContent, "boton");
  assert.equal(doc.attribution.utmTerm, "lavanderia");
  assert.equal(doc.attribution.paginaEntrada, "/servicios/lavanderia-sierra-nevada");
  assert.equal(doc.analyticsConsent, true);
  console.log("ok - UTM y página de entrada conservados hasta la solicitud");
}

// Retirar el consentimiento: se recarga sin Tag Manager ni Clarity y se borran sus cookies.
await page.goto(`${base}/politica-de-cookies`, { waitUntil: "networkidle" });
requests.length = 0;
await page.evaluate(() => { document.cookie = "_ga=GA1.1.prueba; Path=/"; });
await page.locator("footer").getByRole("button", { name: /cookies/i }).first().click();
await page.locator(".cookie-banner__options input[type=checkbox]:not([disabled])").uncheck();
await Promise.all([page.waitForEvent("load"), page.getByRole("button", { name: "Guardar selección" }).click()]);
await page.waitForLoadState("networkidle");
assert.equal(requests.length, 0, "tras retirar el consentimiento no se carga nada");
assert.ok(!(await page.evaluate(() => document.cookie)).includes("_ga="), "cookies de analítica borradas");
console.log("ok - cambiar el consentimiento actualiza el comportamiento");

// Panel de administración: ni Tag Manager ni Clarity, aunque se haya aceptado.
const admin = await newVisitor();
await admin.page.goto(`${base}/`, { waitUntil: "networkidle" });
await admin.page.getByRole("button", { name: "Aceptar" }).click();
await admin.page.waitForTimeout(500);
admin.requests.length = 0;
await admin.page.goto(`${base}/admin/login`, { waitUntil: "networkidle" });
assert.equal(admin.requests.length, 0, "el panel no carga analítica ni grabaciones");
const masked = await page.goto(`${base}/contacto`, { waitUntil: "networkidle" }).then(() => page.locator("form.contact-form").getAttribute("data-clarity-mask"));
assert.equal(masked, "true", "formulario enmascarado para Clarity");
console.log("ok - /admin excluido y formularios enmascarados");

// Registro técnico del consentimiento.
const consent = await page.evaluate(() => document.cookie.split("; ").find((c) => c.startsWith("granalva_consent=")));
assert.match(decodeURIComponent(consent), /"v":2,"id":"[0-9a-f-]{36}","analytics":false/, "cookie de consentimiento con versión e identificador");
assert.equal(errors.length, 0, errors.join("\n"));
console.log("ok - sin errores de consola");
await browser.close();
