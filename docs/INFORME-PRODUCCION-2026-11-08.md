# Informe de preparación para producción — 8 nov 2026

## Estado y enlaces

| | |
|---|---|
| Preproducción (noindex) | https://granalva-preproduccion.vercel.app |
| Producción actual | https://limpiezasgranalva.com (WordPress, intacto) |
| Rama / commits | `feat/nextjs-payload`; punto de restauración `restore/pre-produccion-final` (`8c589fa`) |
| Capturas | `vista-previa/produccion/granalva-preproduccion-2026-11-08.pdf` (no versionado) y `tests/visual/out/qa*/` |

## Qué se ha hecho

1. **Vídeo del hero** (`docs/VIDEO-HERO.md`).
   - La vibración venía de la cadencia irregular del máster: ~22 fotogramas únicos por segundo dentro de 30 fps, con duplicados irregulares.
   - Corrección: eliminación de duplicados e interpolación con compensación de movimiento a **25 fps CFR**. En el zoom, los casi duplicados bajan de 34 a 7.
   - Se añade una fuente nativa de 1440 px para pantallas anchas (antes se estiraba la de 1280).
   - Pesos: 720 px = 728 KB; 1280 px = 1,87 MB; 1440 px = 2,26 MB; póster = 68 KB.
   - Codificación: H.264, faststart y sin metadatos.
   - Fondo de respaldo azul, nunca negro.
2. **`ServiceHero` común** en los 10 servicios, Sierra Nevada incluida:
   - next/image con `fill`, foco, capa azul, migas, etiqueta, H1 y CTA;
   - foto, alt y foco editables desde el panel.
3. **Títulos extendidos.** Se eliminaron los minipárrafos laterales; las introducciones SEO pasan debajo del título. Detector automático: 0 casos.
4. **Portada en el orden pedido:**
   - hero, propuesta de valor y 4 recorridos;
   - servicios para empresas;
   - lavandería y Sierra Nevada;
   - sectores enlazados a páginas reales;
   - proceso;
   - autoridad;
   - empresas colaboradoras (oculta sin logotipos autorizados);
   - reseñas reales de Google con plataforma y fecha;
   - equipo;
   - CTA final y contacto.
5. **Formulario:**
   - estados nuevo / contactado / presupuesto enviado / ganado / perdido (+ spam), con migración de datos verificada en ambos sentidos;
   - exportación CSV (UTF-8 con BOM, protegida contra inyección de fórmulas, solo propietario y administradores);
   - anti-duplicados;
   - enlaces a privacidad y aviso legal.
6. **Panel Payload:**
   - servicios: SEO y portada, con borradores, versiones y programación;
   - blog con vista previa y `Article`;
   - medios en Vercel Blob (límite de 15 MB, tipos MIME restringidos);
   - equipo (foto solo con consentimiento), reseñas y empresas colaboradoras (solo con autorización registrada);
   - redirecciones (protegen las páginas reales y responden con un único 301);
   - ajustes y menú;
   - roles propietario / administrador / editor.
7. **Legal y privacidad:**
   - aviso legal, privacidad, cookies y accesibilidad con los datos reales del aviso vigente;
   - logotipos obligatorios del Kit Digital en el pie;
   - aviso de cookies (aceptar / rechazar / configurar, revocable) con GA en Consent Mode v2, que no se carga nada antes de aceptar.
8. **Seguridad:** CSP, HSTS (sin `includeSubDomains`, para no afectar al correo), Permissions-Policy, COOP, X-Frame-Options y nosniff.
9. **Migración** (`docs/MIGRACION-WORDPRESS.md`, `docs/redirecciones-wordpress.csv`):
   - 18 URLs mapeadas;
   - www → sin www;
   - `/hello-world/` y feeds → 410;
   - el CSV se verifica en `npm test`.

## Pruebas (todas superadas)

| Prueba | Resultado |
|---|---|
| `npm ci`, `npm run lint`, `tsc --noEmit`, `next build` | Sin errores ni avisos |
| `npm test`: 19 pruebas HTTP | 19/19. Cubren: mapa SEO, JSON-LD veraz, enlaces y huérfanas, sitemap, robots, 404, 301 de un salto, www, CSV de WordPress, orden de portada y ServiceHero |
| `npm run test:e2e` | Formulario real, error accesible, envío duplicado y sin errores de consola ni CSP |
| `npm run test:e2e:cms` | Sesión, privacidad de solicitudes, 5 estados, CSV, redirección 301, ajustes de servicio, blog (publicado, borrador y sitemap) y logotipos |
| `tests/e2e/cookies.e2e.mjs` | Aviso, nada antes de elegir, rechazo recordado, configuración desde el pie y revocación |
| `tests/visual/qa.mjs`, local y preproducción | 160 comprobaciones (20 rutas × 8 tamaños): consola, hidratación, desbordamiento, imágenes, enlaces y H1, sin incidencias |
| `tests/visual/video-check.mjs` | Fuente correcta por pantalla, 25 fps, pausa fuera de pantalla, LCP = póster |

## Lighthouse

**Local (sin noindex), móvil / escritorio:**

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Portada | 92 / 100 | 100 / 100* | 100 | 100 |
| Sierra Nevada | 93 / 100 | 100 | 100 | 100 |
| Lavandería para hoteles | 95 / 100 | 100 | 100 | 100 |
| Contacto | 96 / 100 | 100 | 100 | 100 |
| Servicios | 96 / 100 | 100 | 100 | 100 |
| Sobre nosotros | 95 / 100 | 100 | 100 | 100 |

\*Tras la corrección de la transición de color: 100 en tres mediciones seguidas.

**Preproducción** (medida a través del proxy del entorno, que añade latencia):

- Rendimiento: 86–92 en móvil y 98–99 en escritorio.
- Accesibilidad y buenas prácticas: 100.
- SEO: 69, solo por el `noindex` intencionado.

**LCP:**

- El LCP simulado en móvil de la portada (3,2 s local) no alcanza los 2,5 s. Lighthouse suma la fuente, el CSS y el JS de base al tiempo de pintado.
- El LCP medido en navegador es de 0,14–0,32 s con red rápida y de 2,1 s con red móvil lenta.
- CLS = 0 en todas las páginas. TBT ≤ 120 ms.

## Navegadores

Solo hay Chromium en el entorno de trabajo. Firefox y Safari/WebKit **no se han podido probar**: conviene revisarlos en dispositivos reales antes de publicar.

## Indexación

- **Indexables (sitemap):** portada, `/servicios`, 10 servicios, `/contacto` y `/sobre-nosotros` (14 URLs), más los artículos publicados del blog.
- **Excluidas:**
  - legales (noindex, follow);
  - `/blog` mientras no tenga artículos;
  - `/admin` y `/api` (X-Robots-Tag);
  - borradores;
  - 404 y 410.
- **Canonical:** siempre `https://limpiezasgranalva.com/...`, nunca `vercel.app`.
- **Preproducción:** `noindex, nofollow` y `Disallow: /`. En producción el `noindex` se retira solo en el dominio final.

## Datos estructurados

- Organization + ProfessionalService, WebSite, WebPage, Service, BreadcrumbList, FAQPage, ContactPage, AboutPage, Blog y Article.
- Sin reseñas, sin valoraciones y sin `legalName`.
- Validados en las pruebas: tipos, URLs absolutas canónicas y FAQ visibles.

## Infraestructura

| Pieza | Estado |
|---|---|
| PostgreSQL | Local con migraciones (`migrations/`). **Falta la base de datos de preproducción y la de producción.** |
| Almacenamiento de medios | Configurado para Vercel Blob. **Falta el token.** |
| Correo de aviso | Preparado (SMTP). **Faltan las credenciales.** Sin ellas, cada solicitud queda registrada con el aviso «pendiente». |
| Copias de seguridad | Copia de WordPress y exportación DNS pendientes del acceso al hosting y al DNS. Procedimiento descrito en `docs/MIGRACION-WORDPRESS.md`. |
| Reversión | Restaurar A y CNAME desde la exportación (TTL de 300 s); WordPress intacto durante 30 días |
| Correo (MX, SPF, DKIM, DMARC) | **No se toca.** Desde el entorno no se pueden consultar los registros DNS (bloqueado), así que se verificarán con la exportación de la zona. |

## Pendiente de datos o accesos del propietario

1. **Fotografías reales.** Las tres imágenes actuales son de origen no confirmado; la de la limpieza muestra a una persona. Hacen falta:
   - una foto reconocible de Sierra Nevada o Pradollano;
   - fotos por servicio;
   - fotos del equipo, con consentimiento.
2. **Reseñas.** Hay que confirmar si «Manuel Jesús Muñoz Alva» y «Yolanda Corral Gómez» son personas vinculadas a la empresa; mientras tanto están excluidas.
3. **Logotipos de clientes,** con autorización por escrito.
4. **Credenciales:**
   - base de datos (Neon u otra) para preproducción y producción;
   - Vercel Blob;
   - SMTP;
   - opcionales: Turnstile y GA4.
5. **Acceso a la zona DNS y al hosting de WordPress** (copia de seguridad), y **acceso a Search Console**.
6. **Decisión sobre páginas nuevas:** limpieza de hoteles, de comunidades y de centros deportivos. Solo si son servicios reales con contenido propio; hoy esos sectores enlazan a las páginas existentes.
7. **Revisión jurídica** de los textos legales. Los datos son los del aviso vigente.
8. **Licencia de la tipografía Granaina** para uso comercial: confirmar.
