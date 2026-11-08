// Prueba de extremo a extremo del formulario B2B (requiere navegador y base de datos).
// Uso: con la web en marcha (`npm run build && npm start`) y PostgreSQL configurado:
//   node tests/e2e/contact-form.e2e.mjs http://localhost:3000
// Comprueba: preselección por URL, error accesible que conserva los datos,
// envío correcto con referencia y foco en la confirmación.
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright"));
}

const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
// Errores de consola (incluidas violaciones de la política CSP).
page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });

await page.goto(`${base}/contacto?servicio=renting-textil-granada&utm_source=e2e&utm_campaign=prueba#formulario`, { waitUntil: "networkidle" });
const form = page.locator("form.contact-form");
assert.equal(await form.locator("[name=servicio]").inputValue(), "renting-textil-granada", "preselección por URL");

await form.locator("[name=tipoCliente]").selectOption("Hotel o apartahotel");
await form.locator("[name=empresa]").fill("Prueba automática E2E");
await form.locator("[name=contacto]").fill("Persona de prueba");
await form.locator("[name=email]").fill("correo-invalido@x");
await form.locator("summary").click();
await form.locator("[name=unidades]").fill("10 habitaciones");
await form.locator("[name=consentimiento]").check();
await page.waitForTimeout(2800); // tiempo mínimo de rellenado (antispam)
await form.locator("button[type=submit]").click();
await page.waitForSelector(".form-status--error");
assert.equal(await form.locator("[name=empresa]").inputValue(), "Prueba automática E2E", "conserva los datos tras un error");
assert.equal(await form.locator("[name=unidades]").inputValue(), "10 habitaciones", "conserva los datos operativos");

await form.locator("[name=email]").fill("e2e@example.com");
await form.locator("button[type=submit]").click();
await page.waitForSelector(".contact-form--done", { timeout: 20000 });
const confirmation = await page.locator(".contact-form--done").innerText();
assert.match(confirmation, /GRN-\d{8}-[A-Z0-9]{4}/, "referencia de la solicitud");
assert.equal(errors.length, 0, errors.join("\n"));
const reference = confirmation.match(/GRN-\d{8}-[A-Z0-9]{4}/)[0];
console.log("ok - formulario de extremo a extremo:", reference);

// Envío duplicado: la misma solicitud repetida en 10 minutos devuelve la misma referencia.
const again = await browser.newPage();
await again.goto(`${base}/contacto?servicio=renting-textil-granada#formulario`, { waitUntil: "networkidle" });
const form2 = again.locator("form.contact-form");
await form2.locator("[name=tipoCliente]").selectOption("Hotel o apartahotel");
await form2.locator("[name=empresa]").fill("Prueba automática E2E");
await form2.locator("[name=contacto]").fill("Persona de prueba");
await form2.locator("[name=email]").fill("e2e@example.com");
await form2.locator("[name=consentimiento]").check();
await again.waitForTimeout(2800);
await form2.locator("button[type=submit]").click();
await again.waitForSelector(".contact-form--done", { timeout: 20000 });
assert.ok((await again.locator(".contact-form--done").innerText()).includes(reference), "un envío duplicado reutiliza la solicitud existente");
console.log("ok - envío duplicado detectado:", reference);
await browser.close();
