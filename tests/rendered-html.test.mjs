import assert from "node:assert/strict";
import test from "node:test";

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

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const context = {
  waitUntil() {},
  passThroughOnException() {},
};

test("renders every indexable route with unique SEO metadata and an H1", async () => {
  const worker = await loadWorker();
  const titles = new Set();

  for (const [path, expectedTitle] of routes) {
    const response = await worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), env, context);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, path);
    const html = await response.text();
    assert.match(html, new RegExp(`<title>${expectedTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</title>`), path);
    assert.match(html, /<link[^>]+rel=["']canonical["'][^>]*>/i, path);
    assert.match(html, /<meta[^>]+name=["']description["'][^>]*>/i, path);
    assert.match(html, /<h1(?:\s|>)/i, path);
    assert.doesNotMatch(html, /noindex/i, path);
    assert.equal(titles.has(expectedTitle), false, `Duplicate title: ${expectedTitle}`);
    titles.add(expectedTitle);
  }
});

test("publishes robots.txt and a sitemap containing all indexable routes", async () => {
  const worker = await loadWorker();

  const sitemapResponse = await worker.fetch(new Request("http://localhost/sitemap.xml"), env, context);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  for (const [path] of routes) {
    const expectedUrl = path === "/" ? "https://granalva-propuesta-visual.manueljesus1605.chatgpt.site" : `https://granalva-propuesta-visual.manueljesus1605.chatgpt.site${path}`;
    assert.match(sitemap, new RegExp(expectedUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), path);
  }

  const robotsResponse = await worker.fetch(new Request("http://localhost/robots.txt"), env, context);
  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /Allow:\s*\//i);
  assert.match(robots, /Sitemap:\s*https:\/\/granalva-propuesta-visual\.manueljesus1605\.chatgpt\.site\/sitemap\.xml/i);
});
