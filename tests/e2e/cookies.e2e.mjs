// Consentimiento de cookies. Requiere una compilación con NEXT_PUBLIC_GA_ID definido.
// Uso: NEXT_PUBLIC_GA_ID=G-PRUEBA0000 npm run build && npm start; node tests/e2e/cookies.e2e.mjs http://localhost:3000
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); } catch { ({ chromium } = require(process.env.PLAYWRIGHT_PATH ?? "playwright")); }
const base = process.argv[2] ?? "http://localhost:3000";
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const gaRequests = [];
// Google no se contacta en la prueba: se registran y se responden en local.
await context.route(/googletagmanager\.com|google-analytics\.com/, (route) => { gaRequests.push(route.request().url()); route.fulfill({ status: 200, contentType: "application/javascript", body: "" }); });

await page.goto(base, { waitUntil: "networkidle" });
const banner = page.locator(".cookie-banner");
await banner.waitFor();
assert.equal(gaRequests.length, 0, "sin consentimiento no se carga Google Analytics");
assert.equal((await context.cookies()).filter((c) => c.name.startsWith("_ga")).length, 0);
const buttons = await banner.locator(".cookie-banner__actions button").allInnerTexts();
assert.deepEqual(buttons.map((t) => t.trim().toLowerCase()), ["rechazar", "configurar", "aceptar"], "aceptar y rechazar al mismo nivel");
console.log("ok - aviso visible y nada cargado antes de elegir");

await banner.getByRole("button", { name: "Rechazar" }).click();
await banner.waitFor({ state: "detached" });
await page.reload({ waitUntil: "networkidle" });
assert.equal(await page.locator(".cookie-banner").count(), 0, "la elección se recuerda");
assert.equal(gaRequests.length, 0, "rechazo: no se carga Analytics");
console.log("ok - rechazo recordado sin Analytics");

await page.locator(".footer-legal").getByRole("button", { name: "Configurar cookies" }).click();
await banner.waitFor();
await banner.getByLabel("Analítica (Google Analytics)").check();
await banner.getByRole("button", { name: "Guardar selección" }).click();
await page.waitForTimeout(1500);
assert.ok(gaRequests.some((url) => url.includes("gtag/js?id=G-PRUEBA0000")), "con consentimiento se carga gtag");
const consent = (await context.cookies()).find((c) => c.name === "granalva_consent");
assert.match(decodeURIComponent(consent.value), /"analytics":true/);
console.log("ok - configuración desde el pie: Analytics aceptada y cargada");

await page.locator(".footer-legal").getByRole("button", { name: "Configurar cookies" }).click();
await banner.getByRole("button", { name: "Rechazar" }).click();
const after = (await context.cookies()).find((c) => c.name === "granalva_consent");
assert.match(decodeURIComponent(after.value), /"analytics":false/);
console.log("ok - consentimiento revocable");
await browser.close();
