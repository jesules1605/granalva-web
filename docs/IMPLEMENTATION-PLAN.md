# Plan de implementación — web definitiva de Granalva

Rama de trabajo: `feat/nextjs-payload`. Base: commit `b32d6e7`, que importa la versión 10 publicada (origen `eec1d255`).

Línea base verificada el 7 de noviembre de 2026: `npm ci`, `npm run lint` y `npm test` (2/2) pasan. Hay 55 capturas de referencia (11 rutas × 5 tamaños) y una instantánea SEO de cada ruta, tomadas sobre la build vinext local.

## Decisiones técnicas confirmadas

- **Payload 3.93.0** (la última estable, del 6 de noviembre de 2026) exige `next >=16.3.3 <17`. El proyecto usa `next@16.2.6`, así que se sube a **`next@16.4.5`**, dentro de la misma versión mayor. React 19.2 sigue siendo compatible.
- El código de `app/` ya usa la API estándar de Next.js (`next/link`, `next/image`, `generateMetadata`, `sitemap.ts`, `robots.ts`). Solo dependen de ChatGPT Sites o Cloudflare estos elementos: `vite.config.ts`, `worker/`, `build/`, `db/`, `drizzle*`, `examples/`, `.openai/`, `.vinext/`, `app/chatgpt-auth.ts` (no se usa en ningún sitio) y los `scripts/*.sh`.
- Base de datos: PostgreSQL con `@payloadcms/db-postgres`. Medios: Vercel Blob o S3/R2 mediante un adaptador de almacenamiento de Payload. Nunca se usa el disco del servidor.

## Fases

### Fase 1 — Migración de vinext a Next.js 16.4, sin cambios visuales ✅ (esta entrega)

| Archivo | Cambio |
|---|---|
| `package.json`, `package-lock.json` | Scripts `next dev/build/start`. Se retiran vinext, vite, @vitejs/*, @cloudflare/vite-plugin, wrangler, react-server-dom-webpack y drizzle. `next` y `eslint-config-next` pasan a 16.4.5 |
| `next.config.ts` | Configuración de producción mínima |
| `app/layout.tsx` | Geist se carga desde ficheros locales. Ningún otro cambio |
| `app/lib/services.ts` | `SITE_URL` sale de `NEXT_PUBLIC_SITE_URL` y conserva el valor actual como respaldo. Ningún otro cambio |
| `tests/rendered-html.test.mjs` | Prueba la build de Next real mediante HTTP, con las mismas aserciones |
| `tests/visual/*` | Capturas antes/después, instantánea SEO y comparación de píxeles |
| Se eliminan | `vite.config.ts`, `worker/`, `build/`, `db/`, `drizzle/`, `drizzle.config.ts`, `examples/`, `.openai/`, `app/chatgpt-auth.ts`, `scripts/*.sh`. La línea de caché de `.npmrc` se quita |
| `.vinext/fonts` → `app/fonts/geist/` | Mismos ficheros WOFF2, ahora en una ruta independiente de vinext |
| `README.md`, `CLAUDE.md` | Stack y comandos actualizados |

Criterio de aceptación: lint y pruebas en verde; las 11 rutas con el mismo título, description, canonical, H1, OG y JSON-LD que antes; capturas equivalentes en los 5 tamaños.

### Fase 2 — Correcciones de diseño auditadas (`docs/AUDIT-HANDOFF.md`)

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

### Fase 3 — Payload CMS base, PostgreSQL y `/admin`

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

### Fase 6 — Formulario real

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
