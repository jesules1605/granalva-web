# Lista de publicación y migración a producción

## 1. Repositorio y entornos

- Crear un repositorio privado de GitHub propiedad de Granalva.
- Subir este proyecto con su historial o realizar un primer commit documentado.
- Proteger `main`; trabajar mediante ramas y revisiones.
- Configurar tres entornos: local, preproducción y producción.
- Documentar variables sin guardar secretos en Git.

## 2. Infraestructura

- Aplicación Next.js desplegada en preproducción.
- PostgreSQL gestionado con copias automáticas.
- Almacenamiento permanente de medios.
- Correo transaccional con dominio verificado.
- Secretos distintos por entorno.
- Monitorización de errores y disponibilidad.

## 3. Contenido y CMS

- Migrar portada y nueve servicios sin cambiar los slugs aprobados.
- Crear usuarios y roles del panel.
- Cargar datos reales de empresa y textos legales.
- Sustituir material provisional por fotos reales.
- Cargar solo logotipos de clientes autorizados.
- Verificar todas las reseñas y años de experiencia.
- Crear 404, blog y casos de éxito cuando haya material real.

## 4. Formulario, privacidad y cookies

- Envío real probado de extremo a extremo.
- Registro de solicitudes en administración.
- Correo de aviso y confirmación.
- Antispam y límite de frecuencia.
- Consentimiento y enlace a privacidad.
- Aviso legal, privacidad y cookies vigentes.
- Banner de consentimiento que no cargue analítica no esencial antes de aceptar.

## 5. SEO técnico

- Cambiar `SITE_URL` y todas las referencias al dominio canónico final.
- Mantener títulos, H1, descripciones, canonical y datos estructurados únicos.
- Mantener las once URLs iniciales y ampliar solo con contenido útil.
- Generar `robots.txt` y `sitemap.xml` desde contenido publicado.
- Impedir indexación de `/admin`, borradores, previews, API interna y resultados vacíos.
- Comprobar Open Graph, favicon, WebSite, Organization/LocalBusiness, Service, Breadcrumb y FAQ cuando corresponda.
- Validar enlaces internos y páginas huérfanas.
- Medir Core Web Vitals y optimizar el vídeo, imágenes y fuentes.

## 6. Migración desde WordPress

- Exportar lista completa de URLs y su estado desde WordPress y Search Console.
- Preparar un mapa exacto de cada URL antigua a su equivalente nuevo.
- Usar 301; nunca enviar todas las URLs a portada.
- Preservar páginas legales necesarias.
- Hacer copia completa de WordPress y base de datos antes del cambio.
- Mantener WordPress accesible en un entorno privado durante el periodo de seguridad.

## 7. Pruebas previas

- `npm run lint`
- pruebas unitarias/integración;
- pruebas E2E de navegación, formulario, autenticación y CMS;
- accesibilidad con teclado, foco, contraste y lector de pantalla;
- responsive en móvil, tableta y escritorio;
- pruebas de roles y acceso no autorizado;
- restauración de backup;
- Lighthouse y prueba de carga básica.

## 8. Cambio de dominio

1. Reducir TTL con antelación.
2. Verificar dominio en la plataforma nueva sin cambiar producción.
3. Realizar copia final de WordPress.
4. Activar redirecciones y cambiar DNS.
5. Comprobar HTTPS, www/no-www y una sola versión canónica.
6. Probar las URLs prioritarias y las redirecciones antiguas.
7. Enviar el sitemap a Search Console y Bing Webmaster Tools.
8. Solicitar indexación de portada y servicios prioritarios.
9. Vigilar 404, 5xx, formularios, conversiones e indexación durante las primeras semanas.

## Nota sobre posicionamiento

La implementación debe ser técnicamente excelente, pero nadie puede garantizar el puesto número 1. El crecimiento dependerá además de Google Business Profile, reseñas legítimas, autoridad local, casos de éxito, menciones, enlaces relevantes y mejora continua basada en Search Console.


## Estado a 8 nov 2026 y día de publicación

### Hecho y verificado en local
- Formulario real → PostgreSQL (Payload) con estados nuevo/contactado/presupuesto enviado/ganado/perdido, exportación CSV, anti-duplicados, campo trampa, tiempo mínimo, límite por IP y Turnstile opcional (`npm run test:e2e`).
- Panel: servicios (SEO y portada con borradores, versiones y programación), blog con vista previa, medios en Vercel Blob, equipo, reseñas, empresas colaboradoras con autorización, redirecciones, ajustes y menú (`npm run test:e2e:cms`).
- Textos legales con datos reales, aviso de cookies con Consent Mode v2 (`tests/e2e/cookies.e2e.mjs`), CSP, HSTS y Permissions-Policy.
- Mapa de redirecciones de WordPress verificado en `npm test` (`docs/redirecciones-wordpress.csv`).

### Variables por entorno (Vercel → Settings → Environment Variables)
| Variable | Preproducción | Producción |
|---|---|---|
| `NEXT_PUBLIC_NOINDEX` | `true` | *(vacía)*: **solo en el dominio final** |
| `NEXT_PUBLIC_SITE_URL` | `https://limpiezasgranalva.com` | `https://limpiezasgranalva.com` |
| `DATABASE_URL` | base de datos de preproducción | base de datos de producción (distinta) |
| `PAYLOAD_SECRET` | aleatoria | aleatoria distinta |
| `BLOB_READ_WRITE_TOKEN` | almacén de preproducción | almacén de producción |
| `SMTP_*`, `EMAIL_FROM`, `CONTACT_TO_EMAIL` | correo de pruebas | correo real |
| `CRON_SECRET` | aleatoria | aleatoria |
| `NEXT_PUBLIC_GA_ID`, Turnstile | opcional | cuando se faciliten |

La canonical apunta siempre al dominio final, nunca a `*.vercel.app`; la preproducción se protege con `noindex` + `Disallow: /`.

### Día de publicación (tras «AUTORIZO PUBLICACIÓN»)
1. Copia final de WordPress y exportación de la zona DNS (`docs/MIGRACION-WORDPRESS.md`).
2. `npm run db:migrate` contra la base de datos de producción; crear el usuario propietario.
3. Desplegar producción sin `NEXT_PUBLIC_NOINDEX`; añadir `limpiezasgranalva.com` y `www` al proyecto.
4. Cambiar solo A (`@`) y CNAME (`www`). MX, SPF, DKIM y DMARC no se tocan.
5. Comprobaciones posteriores: HTTPS, www → sin www, `robots.txt` sin `Disallow: /`, `sitemap.xml`, canonicals, redirecciones del CSV, envío real del formulario, acceso a `/admin`, consola sin errores y Lighthouse.
6. Search Console: verificar la propiedad de dominio, enviar el sitemap e inspeccionar la portada y los servicios prioritarios.
7. Si algo crítico falla: reversión del DNS (WordPress sigue intacto).
