// Instantánea SEO por ruta: node tests/visual/seo-snapshot.mjs <baseUrl> > snapshot.json
const base = process.argv[2] ?? "http://localhost:3000";
const routes = ["/", "/servicios", "/servicios/empresa-limpieza-granada", "/servicios/lavanderia-profesional-granada", "/servicios/lavanderia-hoteles-granada", "/servicios/lavanderia-apartamentos-turisticos-granada", "/servicios/limpieza-apartamentos-turisticos-granada", "/servicios/limpieza-oficinas-locales-granada", "/servicios/limpieza-fin-de-obra-granada", "/servicios/renting-textil-granada", "/servicios/lavanderia-domicilio-granada", "/servicios/lavanderia-sierra-nevada", "/contacto", "/sobre-nosotros"];
const pick = (html, re) => [...html.matchAll(re)].map((m) => m[1]);
const out = {};
for (const r of routes) {
  const res = await fetch(base + r);
  const html = await res.text();
  out[r] = {
    status: res.status,
    title: pick(html, /<title>([^<]*)<\/title>/g),
    description: pick(html, /<meta name="description" content="([^"]*)"/g),
    canonical: pick(html, /<link rel="canonical" href="([^"]*)"/g),
    robots: pick(html, /<meta name="robots" content="([^"]*)"/g),
    og: pick(html, /<meta property="(og:[a-z:_]+" content="[^"]*)"/g).sort(),
    twitter: pick(html, /<meta name="(twitter:[a-z:_]+" content="[^"]*)"/g).sort(),
    h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g).map((h) => h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()),
    h2count: (html.match(/<h2[\s>]/g) ?? []).length,
    jsonld: pick(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g).map((j) => JSON.parse(j)),
    links: [...new Set(pick(html, /<a [^>]*href="([^"]*)"/g))].sort(),
  };
}
for (const p of ["/sitemap.xml", "/robots.txt"]) { const r = await fetch(base + p); out[p] = { status: r.status, body: (await r.text()).trim() }; }
console.log(JSON.stringify(out, null, 1));
