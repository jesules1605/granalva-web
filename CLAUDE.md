# Contexto de desarrollo — Granalva

> Traspaso a producción: empieza por `START-HERE-CLAUDE.md`. El plan del panel propio está en `docs/CMS-ADMIN-PLAN.md` y los defectos ya auditados en `docs/AUDIT-HANDOFF.md`.

Este repositorio contiene la versión íntegra, funcional y publicada de la web corporativa de Granalva. Continúa sobre esta base: no reconstruyas la página desde una plantilla y no retires contenido o interacciones salvo petición expresa.

## Estado publicado

- Preproducción (noindex): `https://granalva-preproduccion.vercel.app`. Producción: `https://limpiezasgranalva.com` (WordPress hasta la autorización del cambio de DNS).
- Audiencia: pública.
- Idioma: español de España.
- Stack: Next.js 16.4 estándar (App Router), React 19, TypeScript, CSS propio y **Payload CMS 3.93 + PostgreSQL** (panel en `/admin`). Vinext/Vite/Cloudflare se retiraron en la fase 1 (rama `feat/nextjs-payload`).
- Calidad verificada: `npm run lint`, `npm test` (build + 19 pruebas SEO y de migración por HTTP), `npm run test:e2e` (formulario y duplicados), `npm run test:e2e:cms` (panel completo), `tests/e2e/cookies.e2e.mjs` (con `NEXT_PUBLIC_GA_ID`) y `tests/visual/qa.mjs` (20 rutas × 8 tamaños).
- **Build:** `turbopackFileSystemCacheForBuild` está desactivado a propósito: la caché persistente llegó a servir un CSS desfasado. No lo reactives. Si algo del CSS no aparece, compila tras `rm -rf .next`.
- Estructura: sitio público en `app/(frontend)/`, panel en `app/(payload)/` y 404 global en `app/global-not-found.tsx`.
- Plan de trabajo vigente y estado de cada fase: `docs/IMPLEMENTATION-PLAN.md`.

## Prioridad transversal: SEO orgánico y local

Desde el 7 de noviembre de 2026 el objetivo prioritario es el máximo posicionamiento orgánico y local legítimo en Granada. El SEO forma parte de la arquitectura, el contenido, el diseño y el CMS, no es un añadido final. Antes de cambiar contenido, rutas o componentes, consulta `docs/seo-strategy.md`:

- **Mapa:** una intención por URL. La tabla se genera con `node scripts/seo-map.mjs`.
- **Portada:**
  - Title: `Empresa de limpieza y lavandería en Granada | Granalva`.
  - H1: `Empresa de limpieza y lavandería profesional en Granada`.
  - Frase comercial: `Tu empresa no puede parar. Tu hogar tampoco debería esperar.`
  - Portada **compacta** de 10 bloques; cada bloque tiene una finalidad comercial. El peso es de 70/30 entre empresas y particulares. El contenido SEO completo vive en cada página de servicio.
  - CTA por prioridad: `Solicitar presupuesto empresarial` → `Contratar lavandería profesional` → limpieza → Sierra Nevada → `Hacer un pedido particular`.
  - En las páginas B2B no se usa «Hacer un pedido». Cada servicio tiene su `ctaLabel` («Planificar recogidas y entregas», «Reservar ruta de temporada»…).
- **Fuentes únicas de datos:**
  - `app/lib/services.ts`: contenido SEO de los servicios;
  - `app/lib/site.ts`: NAP e indexación;
  - `app/lib/seo.ts`: JSON-LD;
  - `app/lib/redirects.ts`: mapa 301.
- **Pruebas:** `tests/rendered-html.test.mjs` es el criterio de aceptación SEO. Si cambias un title o un H1, actualiza a la vez la prueba y `docs/seo-strategy.md`.
- **Prohibido:**
  - «lavandería industrial» sin confirmar instalaciones;
  - **limpieza** en Sierra Nevada mientras no se confirme (la lavandería, la recogida y entrega y el renting en Sierra Nevada **sí están confirmados**: landing `/servicios/lavanderia-sierra-nevada`, publicada todo el año);
  - precios, plazos garantizados, frecuencias o zonas concretas no confirmados;
  - reseñas o valoraciones en JSON-LD;
  - `legalName` sin la razón social real;
  - listas de municipios o texto oculto.
- **Acciones fuera de la web:** `docs/SEO-LOCAL-Y-AUTORIDAD.md`, `docs/CALENDARIO-EDITORIAL.md` y `docs/MEDICION-SEO.md`.
- **Matriz y competencia:** `docs/SEO-MATRIX.md` (regenerar con `npm run seo:matrix -- http://localhost:3000 > docs/SEO-MATRIX.md`) y `docs/COMPETITOR-SEO-AUDIT.md`.

## Formulario y Payload

- `app/components/contact-form.tsx`, en sus variantes `general` y `sierra-nevada`, envía por server action (`app/actions/contact.ts`). Valida en el servidor y aplica tres protecciones: campo trampa, tiempo mínimo y límite por IP; Turnstile es opcional.
- Cada solicitud se guarda en Payload (`contact-submissions`) con estado, responsable, notas, versión del consentimiento y atribución (página, entrada, referrer y UTM).
- Aviso por SMTP solo si existe `SMTP_HOST`. **Nunca se envían respuestas comerciales automáticas al cliente.**
- Las solicitudes solo las ven el propietario y los administradores. La API pública no permite crearlas ni leerlas.
- Cambios de esquema: `npm run db:migrate:create <nombre>` y después `npm run db:migrate`. En desarrollo, `docker compose up -d` levanta PostgreSQL y `.env.local` (que no se sube a git) contiene `DATABASE_URL` y `PAYLOAD_SECRET`.

## Objetivo comercial vigente

La página está orientada principalmente a empresas, alojamientos y gestores profesionales. El recorrido de particulares sigue siendo importante, pero es secundario.

Prioridades de conversión:

1. Solicitudes de presupuesto de empresas y alojamientos.
2. Lavandería profesional con recogida y entrega.
3. Limpieza de apartamentos turísticos, oficinas, locales y fin de obra.
4. Renting textil.
5. Lavandería a domicilio para particulares.

No inventes precios, número de clientes, años exactos, certificaciones, garantías, coberturas, logotipos de clientes ni cifras de satisfacción. Si falta un dato, deja la estructura preparada o pide la información.

## Primera visita: decisión firme

No debe existir una introducción separada, splash screen, vídeo previo, cuenta atrás, botón «Saltar» ni bloqueo del scroll. El usuario debe ver inmediatamente la navegación, la propuesta de valor y las llamadas a la acción.

El vídeo pertenece al `hero`: se reproduce como fondo y no oculta el contenido. Conserva siempre `poster`, `muted`, `playsInline` y una experiencia comprensible si no carga o si el usuario prefiere movimiento reducido. Para no retrasar el LCP, empieza a descargarse tras el evento `load`. Con movimiento reducido o ahorro de datos se queda en el póster y solo se reproduce al pulsar un capítulo.

## Identidad y sistema visual

La dirección combina claridad comercial, universo de marca propio y carácter granadino contemporáneo. Referencias conceptuales: Rinse para conversión, Fishwife para universo de marca, Vacation para expresividad retro contenida y OLIPOP para ritmo.

Paleta admitida:

- Azul profundo: `#0b2d6c`
- Azul corporativo: `#123d92`
- Azul medio: `#2c5aae`
- Azul claro: `#729fd6`
- Blanco azulado: `#edf4fa`
- Blanco nata: `#f5f0e7`
- Papel: `#fffdf8`

No introducir amarillo intenso, naranja ni colores ajenos al logotipo. Algunos nombres históricos de variables CSS (`--yellow`, `--terracotta`) contienen ahora colores válidos: revisa el valor, no solo el nombre.

Contraste: las etiquetas pequeñas sobre fondo claro usan `--cobalt` (#2c5aae), no `--blue` (#729fd6), para cumplir WCAG AA.

La tipografía Granaina se usa en titulares y momentos de identidad. No crear diamantes, mosaicos abstractos, círculos giratorios ni sellos en rotación como recursos decorativos. Cuando una composición necesite un emblema, utilizar el logotipo real de Granalva, estático y sin deformarlo.

## Marca y datos actuales

- Marca: Granalva / Limpiezas Granalva.
- Descriptor del encabezado: `SERVICIO DE LIMPIEZA Y LAVANDERÍA PROFESIONAL`.
- Teléfono: `744 488 964` (`+34 744 488 964`).
- Correo: `info@limpiezasgranalva.com`.
- Ámbito: Granada y área metropolitana.
- Personas mencionadas: Margarita, Jesús y equipo Granalva.

## Arquitectura y comportamiento

- `app/(frontend)/page.tsx`: portada como **componente de servidor** (metadatos, H1, contenido y JSON-LD). El resto de páginas públicas también está en `app/(frontend)/`: `servicios`, `contacto`, `sobre-nosotros` y `not-found`.
- `app/components/home/*`: zonas interactivas de la portada como componentes de cliente aislados (vídeo y capítulos, selector de servicios, selector de colada, recorrido, reseñas y formulario).
- `app/lib/home-content.ts`: datos de la portada (colada, reseñas, equipo, sectores y FAQ).
- `app/lib/services.ts`: única fuente de datos para las nueve páginas indexables de servicio, incluidos los campos SEO.
- `app/lib/site.ts` / `app/lib/seo.ts` / `app/lib/redirects.ts`: NAP e indexación, JSON-LD y redirecciones 301.
- `app/components/site-chrome.tsx` + `mobile-nav.tsx`: cabecera persistente, menú móvil accesible (portal en `<body>`) y pie con los 9 servicios.
- `app/components/breadcrumbs.tsx`: ruta de navegación visible.
- `app/components/service-hero.tsx`: portada común de todas las páginas de servicio (Sierra Nevada incluida): foto con next/image, foco, capa azul, migas y CTA.
- `app/components/service-page.tsx` / `compact-service-page.tsx`: plantilla editorial y plantilla compacta (Sierra Nevada).
- `app/not-found.tsx`: 404 diseñada (`noindex`).
- `proxy.ts`: un único 301 para www, URLs de WordPress y barra final.
- `app/servicios/page.tsx`: índice de servicios.
- `app/servicios/[slug]/page.tsx`: metadatos, JSON-LD y render de cada página de servicio.
- `app/globals.css`: sistema visual, animaciones y breakpoints.
- `app/layout.tsx`: metadatos, Open Graph, robots y JSON-LD.
- `app/robots.ts`: directivas para rastreadores.
- `app/sitemap.ts`: sitemap automático de portada, índice y las nueve páginas de servicio.
- `public/`: logotipo, Granaina Font, vídeos e imágenes.
- `docs/seo-strategy.md`: mapa de palabras clave y siguientes pasos SEO.

Panel Payload en `/admin` (código en `cms/`): solicitudes, servicios (ajustes SEO y portada), blog, medios (Vercel Blob), equipo, reseñas, empresas colaboradoras (con autorización), redirecciones, ajustes y menú. La web lee el panel con `app/lib/cms.ts` y, si no hay base de datos, usa los valores del código. Variables: `.env.example` y `docs/PRODUCTION-CHECKLIST.md`.

Otras piezas:
- páginas legales en `app/(frontend)/aviso-legal`, `politica-de-privacidad`, `politica-de-cookies` y `declaracion-de-accesibilidad`;
- consentimiento de cookies en `app/components/cookie-consent.tsx`;
- blog en `app/(frontend)/blog`;
- migración de WordPress en `docs/MIGRACION-WORDPRESS.md` y `docs/redirecciones-wordpress.csv`;
- vídeo del hero documentado en `docs/VIDEO-HERO.md`.

Estado local usado en la página:

- selector de tamaño de colada;
- servicio destacado;
- capítulos del vídeo del hero;
- recorrido automático/manual de la moto;
- pausa de reseñas;
- estado informativo del formulario.

## Formulario de contacto

Envío real por server action a PostgreSQL (véase «Formulario y Payload»). Anti-duplicados por clave de formulario y por contenido (10 min). Enlaza a la política de privacidad y al aviso legal. Nunca simular un envío exitoso.

## Autoridad, reseñas y logotipos

Las reseñas son reseñas reales de Google (las que mostraba WordPress mediante Trustindex), copiadas literalmente, con plataforma y fecha. Se excluyeron dos posibles reseñas de personas vinculadas a la empresa hasta que el propietario lo confirme. Pasan a gestionarse en la colección `reviews`. Nunca se publican en JSON-LD.

El carrusel de autoridad muestra sectores, no empresas ficticias. Para sustituirlo por logotipos reales:

1. Obtener la lista definitiva de empresas que autorizan el uso de marca.
2. Guardar SVG/PNG oficiales en `public/clientes/` con nombres descriptivos.
3. Mantener altura óptica uniforme, versión monocromática azul cuando sea apropiada y `alt` correcto.
4. Conservar movimiento suave, pausa al pasar el cursor y alternativa estática para `prefers-reduced-motion`.
5. No publicar prospectos, colaboradores no confirmados ni marcas sin permiso.

La mención «Años de experiencia» es deliberadamente cualitativa porque no se ha facilitado una cifra verificada. Sustituirla por el número real solo cuando se confirme.

## SEO implementado

- Portada, índice `/servicios` y nueve páginas de servicio con URL descriptiva.
- Un H1, título, descripción, canonical, Open Graph y Twitter Cards únicos por página.
- Contenido sustancial y diferente por servicio: introducción, alcance, proceso, audiencias y FAQ.
- JSON-LD de `Organization`/`ProfessionalService`/`WebSite` global y `Service`, `BreadcrumbList` y `FAQPage` por servicio.
- `robots.txt` y `sitemap.xml` con portada, índice, 10 servicios, contacto, sobre nosotros y los artículos publicados del blog (legales: noindex).
- Enlaces internos descriptivos desde cabecera, portada, páginas relacionadas y pie.
- Pruebas automáticas (19 en `npm test`): mapa exacto de title y H1, description, canonical, OG, breadcrumbs, JSON-LD veraz y FAQ visibles, alt, enlaces internos sin errores ni huérfanas, sitemap y robots, 404 diseñada, 301 sin cadenas y redirección de www.
- Dominio canónico confirmado por el propietario: `https://limpiezasgranalva.com`, sin `www`. `SITE_URL` lee `NEXT_PUBLIC_SITE_URL`. La preproducción debe usar `NEXT_PUBLIC_NOINDEX=true`.

Páginas actuales:

1. `/servicios/empresa-limpieza-granada`
2. `/servicios/lavanderia-profesional-granada`
3. `/servicios/lavanderia-hoteles-granada`
4. `/servicios/lavanderia-apartamentos-turisticos-granada`
5. `/servicios/limpieza-apartamentos-turisticos-granada`
6. `/servicios/limpieza-oficinas-locales-granada`
7. `/servicios/limpieza-fin-de-obra-granada`
8. `/servicios/renting-textil-granada`
9. `/servicios/lavanderia-domicilio-granada`

No usar repeticiones artificiales de palabras clave. La prioridad es contenido útil, legible y específico. El mapa completo está en `docs/seo-strategy.md`.

## Funcionalidades que no deben romperse

- Contenido visible desde el primer render.
- Cabecera completa persistente, navegación multipágina y CTA de presupuesto.
- Vídeo de hero con poster y fallback.
- Selector accesible de colada.
- Selector de servicios.
- Recorrido manual y automático de la moto.
- Carruseles de sectores y reseñas con movimiento reducido accesible.
- Formulario con etiquetas, campos obligatorios y consentimiento.
- Responsive sin desplazamiento horizontal.
- `prefers-reduced-motion`.

## Próximos pasos recomendados

1. Añadir logotipos de clientes autorizados.
2. Incorporar fotografías reales de Margarita, Jesús, equipo, instalaciones, vehículo y procesos.
3. Conectar la URL real de la aplicación/pedido.
4. Confirmar años exactos de experiencia y cifras demostrables.
5. Configurar SMTP para el aviso por correo de cada solicitud.
6. Revisión jurídica de los textos legales (datos ya reales).
7. Migrar al dominio final, cambiar `SITE_URL`, redirigir el dominio anterior y verificar Search Console.
8. Crear casos de éxito autorizados y enlazarlos desde las páginas de servicio.

## Verificación de regresiones

- `tests/visual/capture.mjs` y `tests/visual/qa.mjs`: rutas del sitemap, páginas legales, blog y 404 × 8 viewports, con consola, desbordamiento, imágenes y H1.
- `tests/visual/seo-snapshot.mjs`: title, description, canonical, OG, H1, JSON-LD y enlaces por ruta.
- Antes de dar por buena una fase, comparar capturas y SEO con la fase anterior.

## Criterio de calidad

Cada cambio debe comprobarse en escritorio y móvil. Prioriza velocidad percibida, autoridad, claridad de la primera pantalla y facilidad para solicitar presupuesto o recogida. La identidad visual debe reforzar la conversión, nunca retrasar el acceso al contenido.
