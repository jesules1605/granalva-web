# Auditoría técnica — Limpiezas Granalva

Fecha: 7 de noviembre de 2026.

## 0. Alcance y método (qué se ha podido comprobar realmente)

- **No se ha tenido acceso al código fuente.** La sesión no tiene ningún repositorio y no hay ninguna cuenta de GitHub conectada.
- Se han auditado las **versiones publicadas** mediante peticiones HTTP y Chromium (Playwright), en ordenador (1440 y 1920 px) y en móvil (iPhone 13):
  - Propuesta nueva: `https://granalva-propuesta-visual.manueljesus1605.chatgpt.site`
  - Web en producción: `https://limpiezasgranalva.com`
- El enlace compartido de ChatGPT solo devuelve una página vacía que se genera con JavaScript, así que **no se ha podido leer**.
- Todo lo que aparece a continuación está medido sobre las webs publicadas. Ninguna conclusión se basa en el código.

## 1. Estado actual

### Dos webs distintas

| | Producción (`limpiezasgranalva.com`) | Propuesta aprobada (chatgpt.site) |
|---|---|---|
| Tecnología | WordPress 7.1.4 + Elementor 3.32 / Elementor Pro, Site Kit de Google y el widget de reseñas Trustindex | **vinext**: la reimplementación de la API de Next.js sobre Vite, con React Server Components y renderizado en el servidor |
| URLs indexables | 8 | 11 |
| CMS | Sí (WordPress) | **No** |
| Formularios | Elementor Pro | Abren el cliente de correo del usuario (`mailto`); **no hay backend** |

### Qué funciona en la propuesta (verificado)

- Las 11 URLs responden **200** y tienen HTML renderizado en el servidor, con contenido real y legible por los rastreadores.
- Cada página tiene su propio `<title>`, metadescripción, canonical, **un único H1** y Open Graph.
- Hay datos estructurados: WebSite, Service, OfferCatalog y ContactPoint en la portada, y BreadcrumbList, FAQPage y Service en las páginas de servicio.
- `sitemap.xml` y `robots.txt` existen, pero apuntan al dominio de vista previa.
- En ordenador la cabecera **se mantiene fija** al desplazarse (la fija un contenedor padre).
- El ancla `#contacto` no queda tapada por la cabecera.
- No hay desbordamiento horizontal ni en ordenador ni en móvil (`scrollWidth` igual al ancho de la ventana).
- **El selector de coladas funciona.** Ofrece «Poco / Diario / Mucho» (4, 8 y 12 kg), actualiza «Has elegido» y el botón «Solicitar recogida» lleva a `#contacto`.
- **Las reseñas funcionan.** Se desplazan solas y el botón «Pausar» cambia a «Reanudar ▶».
- El CSS incluye reglas `prefers-reduced-motion`.
- Se usa la fuente Granaina (`/fonts/granaina-limpia.otf`, con `font-display: swap`).
- Paleta: navy `#123d92`, navy-deep `#0b2d6c`, cobalt `#2c5aae`, cream `#f5f0e7` y paper `#fffdf8`.
- No hay errores de JavaScript en la consola.

### Qué no existe o no funciona (verificado)

| Elemento | Estado |
|---|---|
| `/admin`, CMS | 404. No existe |
| `/blog`, `/noticias` | 404. No existe |
| Aviso legal, privacidad, cookies, accesibilidad | 404 en la propuesta. **Sí existen en WordPress** |
| `/contacto`, `/sobre-nosotros` | 404 en la propuesta. Sí existen en WordPress |
| Página 404 | Solo muestra el texto plano «Not Found», sin diseño ni navegación |
| Formulario | `<form>` sin `action`: abre el correo del usuario y no guarda ni envía nada desde el servidor. No hay antispam ni registro de solicitudes |
| Banner de consentimiento de cookies | No existe |
| **Menú en móvil** | **No hay menú.** En el móvil la cabecera solo muestra el logotipo y «Solicitar presupuesto», así que los enlaces de navegación no son accesibles |

## 2. Arquitectura SEO

### Páginas actuales de la propuesta (todas indexables)

| # | URL | H1 |
|---|---|---|
| 1 | `/` | Limpieza y lavandería profesional en Granada. |
| 2 | `/servicios` | Limpieza y lavandería en Granada. Cada servicio, bien definido. |
| 3 | `/servicios/empresa-limpieza-granada` | Empresa de limpieza en Granada para negocios que no pueden parar |
| 4 | `/servicios/lavanderia-profesional-granada` | Lavandería profesional en Granada con recogida y entrega |
| 5 | `/servicios/lavanderia-hoteles-granada` | Lavandería para hoteles y alojamientos en Granada |
| 6 | `/servicios/lavanderia-apartamentos-turisticos-granada` | Lavandería para apartamentos turísticos en Granada |
| 7 | `/servicios/limpieza-apartamentos-turisticos-granada` | Limpieza de apartamentos turísticos en Granada |
| 8 | `/servicios/limpieza-oficinas-locales-granada` | Limpieza de oficinas y locales en Granada |
| 9 | `/servicios/limpieza-fin-de-obra-granada` | Limpieza de fin de obra y reforma en Granada |
| 10 | `/servicios/renting-textil-granada` | Renting textil en Granada para alojamientos y empresas |
| 11 | `/servicios/lavanderia-domicilio-granada` | Lavandería a domicilio en Granada: recogemos tu colada |

Estas páginas cubren las 11 intenciones de búsqueda pedidas y no se solapan. **Se conservan tal cual.**

### Mapa de redirecciones 301 (WordPress → web nueva)

Estas son las URLs que Google tiene indexadas hoy, según el `page-sitemap.xml` de WordPress.

| URL actual en WordPress | Destino propuesto |
|---|---|
| `/` | `/` |
| `/servicios-de-limpieza-granada/` | `/servicios` (301) |
| `/sobre-nosotros/` | `/sobre-nosotros` (página nueva con el equipo real) |
| `/contacto/` | `/contacto` (página nueva) |
| `/aviso-legal/` | `/aviso-legal` (se migra el texto tras revisarlo) |
| `/politica-de-privacidad/` | `/politica-de-privacidad` |
| `/politica-de-cookies/` | `/politica-de-cookies` |
| `/declaracion-de-accesibilidad/` | `/declaracion-de-accesibilidad` |

WordPress termina las URLs con barra (`/`) y la propuesta no. Hay que redirigir con 301 la variante con barra a la variante sin barra. Pendiente: confirmar en Search Console si hay entradas, feeds o adjuntos indexados que no aparezcan en el sitemap.

### Correcciones SEO pendientes

1. Cambiar el dominio de canonical, `og:url`, sitemap y robots a `https://limpiezasgranalva.com`.
2. Retirar la directiva `Host:` de robots.txt (no es estándar) y bloquear `/admin`.
3. Añadir datos estructurados `LocalBusiness`/`Organization` con los datos reales que constan en el aviso legal (titular, dirección de Ogíjares, teléfono y correo). Ahora mismo no hay ningún `LocalBusiness`.
4. Generar `<lastmod>` reales por página (hoy todas tienen la misma fecha fija).
5. Crear una página 404 con diseño y navegación.
6. Añadir el blog (listado y artículos, con `Article` + `BreadcrumbList`), que deben entrar en el sitemap automáticamente.
7. Página de Sierra Nevada: **solo si la empresa presta allí el servicio de forma real.** Pendiente de confirmar.

## 3. Diseño

| Elemento aprobado | Estado | Nota |
|---|---|---|
| Logotipo oficial | ✅ | Es el logotipo auténtico (`granalva-logo.jpg`) |
| Paleta azul y crema | ✅ | |
| Granaina | ✅ | **Hay que confirmar la licencia de uso web** |
| Cabecera fija en ordenador | ✅ | |
| **Menú en móvil** | ❌ | No existe. Hay que añadir un menú accesible (botón con `aria-expanded`, uso con teclado y bloqueo del scroll de fondo) |
| **Titular «Tu empresa no puede parar…»** | ⚠️ | A 1440 y a 1920 px «esperar.» cae sola en una **tercera línea**, lo que rompe la composición de dos líneas. Ver `capturas/headline-1440.webp` y `headline-1920.webp`. Hay que ajustar el tamaño de letra o el ancho máximo |
| Titular en la jerarquía | ℹ️ | Es un H2. El H1 de la portada es «Limpieza y lavandería profesional en Granada.» Desde el punto de vista SEO es correcto, así que **no se cambia** sin tu autorización |
| H1 de la portada en móvil | ⚠️ | El trazo descendente de la «p» de «profesional» se superpone a «Granada» por el interlineado tan ajustado (`capturas/mobile-top.jpg`) |
| Selector de coladas | ✅ | Funciona. Es la solicitud de recogida (sin pago), lo cual es correcto |
| Reseñas con desplazamiento y pausa | ✅ | **Pendiente:** confirmar que son reseñas reales (de Google o Trustindex) y que se pueden publicar con nombre |
| Equipo | ⚠️ | Aparecen las iniciales «MA», «JA» y «GG» en lugar de **fotografías reales** |
| Imágenes `hero-laundry.jpg` y `service-cleaning.jpg` | ⚠️ | Confirmar si son fotografías reales de Granalva. Además están en PNG y convendría servirlas en AVIF o WebP |
| Movimiento reducido | ✅ | Hay reglas CSS. Falta comprobarlo en el navegador con la preferencia activada |

## 4. CMS recomendado

**Recomendación: Next.js (App Router) + Payload CMS 3, con PostgreSQL.**

Por qué:
- La propuesta ya está escrita con la API de Next.js (vinext implementa `next/link`, `next/image` y la App Router). Pasarla a Next.js «real» debería ser casi mecánico: **se conservan los componentes, los estilos y las rutas aprobados.** Se confirmará al ver el código.
- Payload 3 se instala **dentro** de la propia aplicación Next.js, con el panel en `/admin`. Incluye de serie usuarios con roles, control de acceso, borradores, versiones, vista previa, publicación programada, subida de imágenes con recortes y redimensionado, y un editor de bloques. Es software libre (MIT), así que no hay licencias ni dependencia de un proveedor.
- Al publicar, un hook de Payload regenera solo la página afectada (`revalidatePath`), sin despliegue manual y sin Claude.
- Permite personalizar la marca del panel (logotipo, colores y página de inicio con accesos directos).

Alternativas descartadas:
- **WordPress con un tema nuevo:** obligaría a rehacer en PHP el diseño aprobado en React.
- **WordPress «headless» con la web en Next.js:** supondría mantener dos sistemas y dos servidores.

Aspectos que hay que validar:
- Payload no trae doble factor (2FA) de forma nativa. Habría que valorar un plugin o una protección de acceso a `/admin` en el CDN.
- La publicación programada necesita un cron (Vercel Cron o el del servidor).

## 5. Independencia del propietario

- **Repositorio:** en la cuenta de GitHub de Granalva.
- **Hosting**, a nombre de Granalva:
  - Opción A, más sencilla: Vercel (plan Pro, necesario para uso comercial) + Neon Postgres + almacenamiento de imágenes en Vercel Blob o Cloudflare R2.
  - Opción B, más barata: un servidor VPS con Docker.
  - Los precios se confirmarán antes de contratar.
- **Correo de los formularios:** Resend u otro SMTP, con el dominio verificado.
- **Secretos:** solo en variables de entorno del hosting y nunca en el código. Se entrega un `.env.example`.
- **Flujo de trabajo:** Publicaciones → Nueva → título y contenido → foto → pestaña SEO → Vista previa → Publicar. La página queda visible en segundos.
- **Documentación que se entregará:** README de instalación, guía del CMS con capturas, procedimiento de copias y restauración (`pg_dump` + bucket), procedimiento de actualización y tabla de costes.

## 6. Secuencia de implementación

0. **Bloqueante:** conseguir el código fuente de la propuesta y subirlo al repositorio de Granalva.
1. Pasar la propuesta de vinext a Next.js sin cambios visuales. Comparar capturas antes y después, página por página.
2. Correcciones de diseño aprobadas: menú en móvil, salto de línea del titular, interlineado del H1 en móvil y página 404.
3. Integrar Payload: Usuarios (administrador y editor), Medios, Publicaciones, Categorías, Páginas y Servicios (con los textos actuales migrados a bloques), Configuración global (contacto, menú, pie) y Redirecciones.
4. Blog público: `/blog` y `/blog/[slug]`, con sitemap dinámico, `Article` y Open Graph.
5. Formularios reales: guardado en una colección «Solicitudes», notificación a info@, honeypot + Cloudflare Turnstile, cláusula informativa del RGPD y plazo de conservación.
6. Legal: migrar los textos actuales de WordPress, revisarlos y añadir un banner de consentimiento que bloquee Google Analytics hasta que el usuario acepte.
7. SEO final: dominio definitivo, `LocalBusiness`, redirecciones 301, Search Console y medición con Lighthouse.
8. Cambio del DNS, copia de seguridad completa de WordPress y periodo de convivencia.

## 7. Bloqueos y datos que hacen falta

1. **El código fuente de la propuesta.** ¿Dónde está? Si se generó en ChatGPT, hay que descargarlo o exportarlo y subirlo a un repositorio de GitHub de Granalva. Después hay que conectar GitHub a Claude.
2. Licencia de uso web de la fuente Granaina.
3. Si las reseñas son reales y de dónde proceden.
4. Fotografías reales del equipo y del trabajo, y si las imágenes actuales son reales o generadas.
5. Si se presta servicio en Sierra Nevada y cuál es la zona real de servicio.
6. Quién gestiona hoy el DNS y el hosting de WordPress (para la migración y las copias de seguridad).
7. Qué hosting prefieres (opción A u opción B).

## Pruebas: realizadas y pendientes

**Realizadas (sobre las webs publicadas):**
- HTTP, título, H1, canonical y JSON-LD de las 11 rutas.
- Sitemap, robots y página 404.
- Cabecera fija y ancla `#contacto` en ordenador y móvil.
- Desbordamiento horizontal en ordenador y móvil.
- Envío del formulario (sin petición al servidor).
- Selector de coladas y pausa de las reseñas.
- Composición del titular a 1440 y 1920 px.
- Consola de JavaScript sin errores.

**Pendientes:**
- Lighthouse y Core Web Vitals (no medidos).
- Uso con teclado y lector de pantalla.
- Tableta.
- Movimiento reducido en el navegador.
- Validación de los datos estructurados con la Prueba de resultados enriquecidos de Google.
- Todo lo relativo al CMS (no existe todavía).
