// Pruebas de HTML renderizado: arrancan la build de producción de Next.js
// (`next start`) y comprueban por HTTP el SEO de las once rutas indexables.
// Requiere haber ejecutado `next build` (lo hace `npm test`).
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { after, before, test } from "node:test";

const PORT = Number(process.env.TEST_PORT ?? 4310);
const BASE = `http://127.0.0.1:${PORT}`;
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://granalva-propuesta-visual.manueljesus1605.chatgpt.site"
).replace(/\/+$/, "");

const routes = [
  ["/", "Empresa de limpieza y lavandería en Granada | Granalva"],
  ["/servicios", "Servicios de limpieza y lavandería en Granada | Granalva"],
  ["/servicios/empresa-limpieza-granada", "Empresa de limpieza en Granada | Granalva"],
  ["/servicios/lavanderia-profesional-granada", "Lavandería profesional en Granada | Granalva"],
  ["/servicios/lavanderia-hoteles-granada", "Lavandería para hoteles en Granada | Granalva"],
  ["/servicios/lavanderia-apartamentos-turisticos-granada", "Lavandería apartamentos turísticos Granada | Granalva"],
  ["/servicios/limpieza-apartamentos-turisticos-granada", "Limpieza de apartamentos turísticos Granada | Granalva"],
  ["/servicios/limpieza-oficinas-locales-granada", "Limpieza de oficinas y locales Granada | Granalva"],
  ["/servicios/limpieza-fin-de-obra-granada", "Limpieza fin de obra en Granada | Granalva"],
  ["/servicios/renting-textil-granada", "Renting textil en Granada | Granalva"],
  ["/servicios/lavanderia-domicilio-granada", "Lavandería a domicilio en Granada | Granalva"],
];

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
let server;

before(async () => {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT), "-H", "127.0.0.1"], {
    stdio: ["ignore", "pipe", "pipe"],
    detached: true,
    env: { ...process.env, NODE_ENV: "production" },
  });
  let log = "";
  server.stdout.on("data", (chunk) => (log += chunk));
  server.stderr.on("data", (chunk) => (log += chunk));
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE}/robots.txt`);
      if (response.ok) return;
    } catch {
      // El servidor todavía no acepta conexiones.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  stopServer();
  throw new Error(`next start no respondió en 60 s:\n${log}`);
});

// Detiene next start y sus procesos hijos (grupo de procesos completo).
function stopServer() {
  if (!server?.pid) return;
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    // El proceso ya había terminado.
  }
}

after(stopServer);

test("renders every indexable route with unique SEO metadata and an H1", async () => {
  const titles = new Set();

  for (const [path, expectedTitle] of routes) {
    const response = await fetch(`${BASE}${path}`, { headers: { accept: "text/html" } });
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, path);
    const html = await response.text();
    assert.match(html, new RegExp(`<title>${escape(expectedTitle)}</title>`), path);
    // En la raíz, «https://dominio» y «https://dominio/» son la misma URL (RFC 3986).
    const canonicalPattern = path === "/" ? `${escape(SITE_URL)}/?` : escape(`${SITE_URL}${path}`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalPattern}"`), path);
    assert.match(html, /<meta[^>]+name=["']description["'][^>]*>/i, path);
    assert.equal((html.match(/<h1(?:\s|>)/gi) ?? []).length, 1, `${path}: debe haber exactamente un H1`);
    assert.doesNotMatch(html, /noindex/i, path);
    assert.equal(titles.has(expectedTitle), false, `Duplicate title: ${expectedTitle}`);
    titles.add(expectedTitle);
  }
});

test("publishes robots.txt and a sitemap containing all indexable routes", async () => {
  const sitemapResponse = await fetch(`${BASE}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  for (const [path] of routes) {
    const expectedUrl = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
    assert.match(sitemap, new RegExp(`<loc>${escape(expectedUrl)}</loc>`), path);
  }

  const robotsResponse = await fetch(`${BASE}/robots.txt`);
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /Allow:\s*\//i);
  assert.match(robots, new RegExp(`Sitemap:\\s*${escape(SITE_URL)}/sitemap\\.xml`, "i"));
});

test("returns 404 for unknown routes", async () => {
  const response = await fetch(`${BASE}/servicios/no-existe`);
  assert.equal(response.status, 404);
  const other = await fetch(`${BASE}/pagina-que-no-existe`);
  assert.equal(other.status, 404);
});
