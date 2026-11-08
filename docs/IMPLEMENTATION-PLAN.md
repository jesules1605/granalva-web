# Plan de implementación — web definitiva de Granalva

Rama de trabajo: `feat/nextjs-payload`. Base: commit `b32d6e7`, que importa la versión 10 publicada (origen `eec1d255`).

Línea base verificada el 7 de noviembre de 2026: `npm ci`, `npm run lint` y `npm test` (2/2) pasan. Hay 55 capturas de referencia (11 rutas × 5 tamaños) y una instantánea SEO de cada ruta, tomadas sobre la build vinext local.

## Decisiones técnicas confirmadas

- **Payload 3.93.0** (la última estable, del 6 de noviembre de 2026) exige `next >=16.3.3 <17`. El proyecto usa `next@16.2.6`, así que se sube a **`next@16.4.5`**, dentro de la misma versión mayor. React 19.2 sigue siendo compatible.
- El código de `app/` ya usa la API estándar de Next.js (`next/link`, `next/image`, `generateMetadata`, `sitemap.ts`, `robots.ts`). Solo dependen de ChatGPT Sites o Cloudflare estos elementos: `vite.config.ts`, `worker/`, `build/`, `db/`, `drizzle*`, `examples/`, `.openai/`, `.vinext/`, `app/chatgpt-auth.ts` (no se usa en ningún sitio) y los `scripts/*.sh`.
- Base de datos: PostgreSQL con `@payloadcms/db-postgres`. Medios: Vercel Blob o S3/R2 mediante un adaptador de almacenamiento de Payload. Nunca se usa el disco del servidor.

## Fases

### Fase 1 — Migración de vinext a Next.js 16.4, sin cambios visuales ✅

| Archivo | Cambio |
|---|---|
| `package.json`, `package-lock.json` | Scripts `next dev/build/start`. Se retiran vinext, vite, @vitejs/*, @cloudflare/vite-plugin, wrangler, react-server-dom-webpack y drizzle. `next` y `eslint-config-next` pasan a 16.4.5 |
| `next.config.ts` | Configuración de producción mínima |
| `app/layout.tsx` | Se retira Geist: el CSS nunca leía sus variables, así que solo añadía 4 precargas de fuente que no se pintaban. Ningún otro cambio |
| `app/lib/services.ts` | `SITE_URL` sale de `NEXT_PUBLIC_SITE_URL` y conserva el valor actual como respaldo. Ningún otro cambio |
| `tests/rendered-html.test.mjs` | Prueba la build de Next real mediante HTTP, con las mismas aserciones |
| `tests/visual/*` | Capturas antes/después, instantánea SEO y comparación de píxeles |
| Se eliminan | `vite.config.ts`, `worker/`, `build/`, `db/`, `drizzle/`, `drizzle.config.ts`, `examples/`, `.openai/`, `app/chatgpt-auth.ts`, `scripts/*.sh`. La línea de caché de `.npmrc` se quita |
| `.vinext/fonts` | Se elimina, porque Geist no se usaba |
| `README.md`, `CLAUDE.md` | Stack y comandos actualizados |

Criterio de aceptación: lint y pruebas en verde; las 11 rutas con el mismo título, description, canonical, H1, OG y JSON-LD que antes; capturas equivalentes en los 5 tamaños.

**Resultado (verificado el 7 de noviembre de 2026):**
- `npm run lint`: correcto. `npm test`: 3/3. Se añadió la prueba de 404, y la de H1 ahora exige exactamente uno.
- `next build`: 15 páginas estáticas, sin avisos.
- Instantánea SEO de las 11 rutas, sitemap y robots: idéntica salvo dos diferencias equivalentes:
  - el canonical de la portada pierde la barra final (`…site/` → `…site`), que en la raíz es la misma URL;
  - cambia el orden de la línea `Host:` en robots.txt.
- Capturas: 52 de 55 idénticas, con un umbral del 0,05 % de píxeles. Las 3 restantes (`/servicios` en 1024, 390 y 360 px) solo difieren porque, en la captura de referencia, no estaban cargadas aún las imágenes con `loading="lazy"`. Ya está corregido en `capture.mjs`.
- Funciona en la build de Next, en ordenador y en móvil:
  - vídeo del hero, cabecera fija y capítulos;
  - selector de coladas, selector de servicios y pausa de las reseñas;
  - validación obligatoria del formulario;
  - 0 errores en la consola.

### Fase SEO — Arquitectura SEO, contenido y correcciones auditadas ✅ (7 nov 2026)

Encargo del propietario: SEO orgánico y local como prioridad transversal. Detalle en `docs/seo-strategy.md`.

| Archivo | Cambio |
|---|---|
| `app/lib/services.ts` | Modelo SEO por servicio (H1, title, description, intención, palabras clave, «qué resuelve», cobertura, relacionados con texto de anclaje, CTA, `updatedAt`) y contenido ampliado. `SITE_URL` por defecto pasa a `https://limpiezasgranalva.com` |
| `app/lib/site.ts`, `app/lib/seo.ts`, `app/lib/redirects.ts`, `app/lib/home-content.ts` | NAP único, reglas de indexación, generadores JSON-LD, mapa 301 de WordPress y contenido de la portada |
| `app/page.tsx` + `app/components/home/*` | Portada como componente de servidor con H1, introducción y CTA acordados. Las zonas interactivas pasan a componentes de cliente aislados |
| `app/components/service-page.tsx`, `app/servicios/**` | Breadcrumbs visibles, secciones «Qué resuelve» y «Zona de servicio», relacionados con anclaje descriptivo, CTA por intención, fecha de revisión y JSON-LD `WebPage`/`Service`/`BreadcrumbList`/`FAQPage`/`CollectionPage` |
| `app/components/mobile-nav.tsx`, `site-chrome.tsx` | Menú móvil accesible (portal, foco atrapado, Escape) y pie con los 9 servicios |
| `app/not-found.tsx` | 404 diseñada con `noindex` |
| `app/robots.ts`, `app/sitemap.ts`, `app/layout.tsx`, `proxy.ts`, `next.config.ts` | Robots con exclusiones, `lastmod` real, `noindex` en preproducción, un solo 301 para www, WordPress y barra final, y cabeceras de seguridad y caché |
| `public/` | Imágenes con nombres descriptivos, imagen OG de 1200×630 y póster WebP del vídeo (100 KB en lugar de un PNG de 2 MB) |
| `app/globals.css` | Titulares auditados, compensación de anclas, menú, breadcrumbs, secciones nuevas y contraste AA |
| `tests/rendered-html.test.mjs` | 10 pruebas: mapa title/H1, contenido inicial, breadcrumbs, JSON-LD veraz, alt, enlaces y páginas huérfanas, sitemap y robots, 404, 301 sin cadenas y www |
| `docs/` | `seo-strategy.md`, `SEO-LOCAL-Y-AUTORIDAD.md`, `CALENDARIO-EDITORIAL.md`, `MEDICION-SEO.md` y `scripts/seo-map.mjs` |

### Fase B2B — Captación B2B, Sierra Nevada, formulario real y base de Payload ✅ (7 nov 2026)

Encargo del propietario: convertir la web en una herramienta de captación B2B con portada compacta, selector dinámico, campaña y landing de Sierra Nevada, formularios segmentados registrados en Payload, auditoría de competencia y matriz SEO.

| Área | Archivos |
|---|---|
| Portada compacta (10 bloques, 70/30 empresas/particulares) | `app/(frontend)/page.tsx`, `app/lib/home-content.ts` (`serviceCategories`, `sierraNevadaBlock`), `app/components/home/service-selector.tsx` |
| Landing de Sierra Nevada | `app/lib/services.ts` (`lavanderia-sierra-nevada`, `extraSections`, `embeddedForm`, `areaServed`), `app/components/service-page.tsx` |
| Páginas heredadas de WordPress | `app/(frontend)/contacto/page.tsx`, `app/(frontend)/sobre-nosotros/page.tsx` |
| Formulario B2B | `app/components/contact-form.tsx`, `app/actions/contact.ts` (server action, campo trampa, tiempo mínimo, límite por IP, Turnstile opcional), `app/lib/contact-schema.ts`, `app/lib/submissions.ts` |
| Payload CMS + PostgreSQL | `payload.config.ts`, `cms/access.ts`, `cms/collections/Users.ts` y `ContactSubmissions.ts`, `cms/components/AdminBrand.tsx`, `app/(payload)/**`, `migrations/`, `payload-types.ts` |
| Reorganización | Sitio público en `app/(frontend)/`; 404 global en `app/global-not-found.tsx` (dos layouts raíz) |
| Navegación y CTA | `app/components/site-chrome.tsx` (Sierra Nevada, Sobre nosotros, Contacto); CTA adaptado a cada página (`ctaLabel`) |
| Pruebas | `tests/rendered-html.test.mjs` (15 pruebas), `tests/e2e/contact-form.e2e.mjs` |
| Documentación | `docs/COMPETITOR-SEO-AUDIT.md`, `docs/SEO-MATRIX.md` (`scripts/seo-matrix.mjs`) y `docs/seo-strategy.md` actualizado |

**Comprobado en local:**
- Las 14 URLs indexables cumplen todos los requisitos de indexación.
- La 404 se renderiza en el servidor.
- `/contacto/` y `/sobre-nosotros/` redirigen con un 301 a su versión sin barra.
- Formulario de extremo a extremo: error con los datos conservados, envío correcto, registro en PostgreSQL con atribución UTM y consulta en `/admin`.
- La primera cuenta del panel queda como propietario.
- El panel y la API no son indexables y las solicitudes no son públicas.

**Pendiente:**
- SMTP y destinatario de los avisos; mientras no exista, las solicitudes se registran con el aviso «pendiente».
- Claves de Turnstile.
- Exportación CSV restringida.
- Política de retención aplicada con una tarea programada.

### Fase 2 — Correcciones de diseño auditadas (`docs/AUDIT-HANDOFF.md`)

**Estado tras la fase SEO:** resueltos los puntos 1 (menú móvil), 2 y 3 (titulares), 4 (solapamiento del H1), 5 (iniciales sustituidas por el emblema real hasta tener fotografías), 6 (404) y 9 (anclas bajo la cabecera fija). Quedan pendientes:

- el 7 (formulario real, fase 6);
- el 8 (textos legales, fase 7);
- el 10: revisión de las imágenes provisionales; la de renting muestra un tejido con formas geométricas, y conviene sustituirla por una fotografía real.

| Defecto | Archivos |
|---|---|
| 1. Menú móvil accesible (botón con `aria-expanded`, foco atrapado, Escape, bloqueo del scroll de fondo) | `app/components/site-chrome.tsx`, nuevo `app/components/mobile-nav.tsx`, `app/globals.css` |
| 2. Titular «Tu empresa no puede parar…» en dos líneas equilibradas | `app/globals.css` (tamaño con `clamp`, `text-wrap: balance`) y `app/page.tsx`, solo si hacen falta saltos intencionados |
| 3. «Preparados para espacios…» a todo el ancho útil | `app/globals.css`, `app/page.tsx` |
| 4. Solapamiento del H1 en móvil | `app/globals.css` (interlineado del hero en los breakpoints móviles) |
| 5. Equipo sin iniciales que simulen retratos | `app/page.tsx`, `app/globals.css` |
| 6. Página 404 propia | nuevo `app/not-found.tsx` |
| 9. Cabecera completa fija sin tapar anclas | `app/globals.css` (`scroll-padding-top` según la altura real) |
| 10. Revisar los decorativos que quedan | `app/page.tsx`, `app/globals.css` |

Nota sobre el texto: `CLAUDE.md` y `AUDIT-HANDOFF.md` citan el titular como «…Tu hogar tampoco debería **esperar**.», mientras que el código publicado dice «…tampoco debería **tener que esperar**.». No se cambia el texto sin confirmación del propietario.

### Fase 3 — Payload CMS base, PostgreSQL y `/admin` (en parte completada en la fase B2B)

Hecho:
- integración de Payload 3.93 con PostgreSQL;
- `/admin` en español con la identidad Granalva y sin Gravatar;
- roles de propietario, administrador y editor;
- bloqueo tras 5 intentos de acceso;
- migraciones versionadas.

Pendiente:
- colección `media` con almacenamiento persistente (Vercel Blob o R2);
- recuperación de contraseña por correo, que requiere SMTP;
- 2FA.


- `payload.config.ts`, `payload-types.ts` (generado), `migrations/`.
- `app/(frontend)/…`: se mueve aquí el sitio público con su layout. `app/(payload)/admin/[[...segments]]/`, `app/(payload)/api/[...slug]/route.ts` y `app/(payload)/layout.tsx` son los archivos estándar de Payload.
- Colección `users` con roles propietario, administrador y editor. Bloqueo tras varios intentos fallidos, sesiones y campos `createdBy`/`updatedBy`.
- Colección `media` con `alt` obligatorio, MIME y tamaño limitados, variantes optimizadas (sharp) y adaptador de almacenamiento.
- Panel con la marca Granalva: logotipo, colores y página de inicio con accesos directos. `noindex` en `/admin` y `Disallow` en robots.
- `docker-compose.yml`, solo para tener PostgreSQL en local.

### Fase 4 — Modelo de contenido y conexión del frontend

- Colecciones `services`, `sectors`, `team`, `reviews`, `clients` y `case-studies`. Globals `site-settings`, `navigation` y `homepage`.
- Script `scripts/seed.ts`, que traslada a Payload el contenido de `app/lib/services.ts` y de la portada **con los mismos slugs y textos**.
- El frontend lee de Payload con `revalidatePath` desde los hooks `afterChange`. Solo se muestran reseñas y clientes que tengan permiso.

### Fase 5 — Blog

- Colecciones `posts` y `categories` con borradores, versiones, vista previa y publicación programada (cola de trabajos de Payload + cron).
- Rutas `app/(frontend)/blog/page.tsx` y `blog/[slug]/page.tsx`, con JSON-LD `Article` y `BreadcrumbList`.
- El sitemap se genera a partir del contenido publicado.

### Fase 6 — Formulario real (en parte completada en la fase B2B: ver arriba)

- Colección `contact-submissions` con estados, notas y exportación CSV restringida por rol.
- Server action o ruta API con validación en el servidor, honeypot, límite de frecuencia y Turnstile.
- Aviso por correo (adaptador de email de Payload) y número de recepción. `mailto:` se mantiene solo como alternativa si el servidor falla.

### Fase 7 — Legal y cookies

- Colección `legal-pages` y rutas `/aviso-legal`, `/politica-de-privacidad`, `/politica-de-cookies` y `/declaracion-de-accesibilidad`, con los mismos slugs que WordPress.
- Los textos de WordPress se migran como **borrador**, hasta que el propietario los revise.
- Banner de consentimiento: la analítica no se carga antes de que el usuario acepte.

### Fase 8 — SEO final y redirecciones

- Colección `redirects` y su lectura en `middleware.ts`. Se importa el mapa de WordPress (ver `docs/auditoria-2026-11/AUDITORIA-GRANALVA.md`, sección 2).
- `LocalBusiness` con los datos de `site-settings`. `lastmod` real en el sitemap.
- Variable de entorno de indexación: la preproducción siempre lleva `noindex`.

### Fase 9 — Preproducción

- Repositorio privado de GitHub **propiedad de Granalva**.
- Despliegue en Vercel con su URL de preproducción, Neon Postgres y Blob/R2.
- E2E con Playwright (navegación, formulario, inicio de sesión, publicar un artículo), Lighthouse, accesibilidad, prueba de restauración de una copia de seguridad.
- Guía del propietario: `docs/GUIA-ADMIN.md`.

### Fase 10 — Lanzamiento

Se sigue `docs/PRODUCTION-CHECKLIST.md`, sección 8. **WordPress sigue en producción hasta este punto.**

## Bloqueos que dependen del propietario

- **Fase 9:** repositorio privado de Granalva y GitHub conectado a Claude.
- **Fase 9:** cuentas de Vercel, de base de datos y de correo a nombre de Granalva.
- Datos y material: ver la lista de `START-HERE-CLAUDE.md`.

## Fase de producción (8 nov 2026): completada hasta el punto de autorización

Informe completo: `docs/INFORME-PRODUCCION-2026-11-08.md`. Incluye el vídeo a 25 fps, ServiceHero, la portada reordenada, el panel completo, los textos legales, las cookies, la seguridad, la migración de WordPress y las pruebas. Pendiente: credenciales (base de datos, Blob, SMTP), fotografías reales, accesos DNS, hosting y Search Console, y la autorización «AUTORIZO PUBLICACIÓN».
