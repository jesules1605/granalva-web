# Migración desde WordPress (inventario del 8 nov 2026)

Fuente: rastreo de `https://limpiezasgranalva.com` (Yoast `sitemap_index.xml` → `page-sitemap.xml`), comprobación manual de variantes y URLs heredadas. El mapa de redirecciones verificable está en `docs/redirecciones-wordpress.csv` y se comprueba en `npm test`.

Search Console y la búsqueda `site:` no se han podido consultar desde el entorno de trabajo: **hace falta acceso a Search Console** para añadir las URLs con impresiones que no estén en el sitemap.

## Inventario

| URL de WordPress | Estado actual | Destino en la web nueva |
|---|---|---|
| `/` | 200 (canónica sin www) | `/` (200) |
| `/servicios-de-limpieza-granada/` | 200 | 301 → `/servicios` |
| `/sobre-nosotros/` | 200 | 301 → `/sobre-nosotros` (barra final) |
| `/contacto/` | 200 | 301 → `/contacto` |
| `/aviso-legal/` | 200 | 301 → `/aviso-legal` |
| `/politica-de-privacidad/` | 200 | 301 → `/politica-de-privacidad` |
| `/politica-de-cookies/` | 200 | 301 → `/politica-de-cookies` |
| `/declaracion-de-accesibilidad/` | 200 | 301 → `/declaracion-de-accesibilidad` |
| `/inicio/` | 301 → `/` | 301 → `/` |
| `/servicios/` | 301 → servicios-de-limpieza | 301 → `/servicios` |
| `/referencias/` | 404 | **Página nueva `/referencias`** (301 por la barra final) |
| `/hello-world/` | **200** (entrada de ejemplo de WordPress, indexable) | 410 |
| `/feed/`, `/comments/feed/` | 200 | 410 |
| `/?p=1`, `/?s=…` | Parámetros de WordPress | Portada (200, canonical `/`) |
| `/wp-admin/`, `/wp-login.php` | 302 / 404 | 404 |
| `https://www.limpiezasgranalva.com/*` | **200** (duplicado del dominio sin www) | 301 → mismo path sin www |
| `http://…` | No comprobable desde aquí (puerto 80 bloqueado) | HTTPS forzado por Vercel |

Medios de WordPress (`/wp-content/uploads/…`): no se migran. Son fotos de banco genéricas de origen no acreditado y los logotipos del Kit Digital; no se usan en la web nueva. Quedarán en 404 cuando se retire WordPress, igual que en cualquier sustitución de tema.

## Host canónico

`https://limpiezasgranalva.com`, sin www y sin barra final. Lo confirmó el propietario y coincide con la canonical de WordPress.

- `www` → 301 al mismo path sin www (en `proxy.ts`). Hace falta añadir `www.limpiezasgranalva.com` al proyecto de Vercel como alias.
- Barra final → 301 a la URL sin barra, en un solo salto combinado con www o con URLs antiguas.
- Nunca hay cadenas: `proxy.ts` resuelve el destino final y emite una única redirección.

## Hallazgos que corrige la web nueva

1. `www` respondía 200: contenido duplicado entre hosts.
2. `/hello-world/` (contenido de ejemplo) estaba publicado e indexable.
3. Los feeds vacíos estaban expuestos.
4. Los datos legales se mantienen. Titular: Margarita Alva Corral; NIF y domicilio publicados en el aviso legal vigente.
5. Por decisión del propietario, la web nueva **no** incluye los logotipos ni las menciones del Kit Digital, Acelera Pyme ni NextGenerationEU.

## Copia de seguridad de WordPress (antes de cambiar DNS)

Necesita acceso al hosting (nginx, panel del proveedor actual):

1. Copia completa desde el panel del hosting (archivos + base de datos) o con un plugin (UpdraftPlus / All-in-One WP Migration), descargada fuera del servidor.
2. Exportación XML de WordPress (Herramientas → Exportar) como copia de contenidos.
3. Captura del sitemap y de los textos legales (ya archivados en este inventario).
4. **No cancelar el hosting de WordPress** hasta 30 días después del cambio: es el plan de reversión.

## Cambio de DNS (solo tras «AUTORIZO PUBLICACIÓN»)

Valores habituales de Vercel; se confirman en el panel del proyecto al añadir el dominio:

| Registro | Nombre | Valor | TTL |
|---|---|---|---|
| A | `@` | `76.76.21.21` | 300 s durante la migración (después, 3600 s) |
| CNAME | `www` | `cname.vercel-dns.com` | 300 s → 3600 s |

- **No se tocan** MX, SPF, DKIM, DMARC ni ningún registro de correo u otros servicios.
- Antes del cambio: exportar la zona DNS completa (copia) y bajar el TTL de A/CNAME a 300 s con 24 h de antelación.

## Reversión

Si tras el cambio falla algo crítico (web caída, formulario sin registrar, errores 5xx):

1. Restaurar los valores anteriores de A/CNAME desde la exportación de la zona (con TTL de 300 s la propagación es rápida).
2. WordPress sigue intacto en su hosting.
3. Revisar el fallo en la preproducción y repetir el cambio cuando esté resuelto.

## Contraste con la exportación XML de WordPress (8 nov 2026)

La exportación «Todo el contenido» coincide con el inventario rastreado. El archivo no se sube a git porque contiene el correo del autor.

- **8 páginas publicadas:** todas tienen su 301 de un salto o conservan la URL.
- **1 entrada** («Hello world!», la de ejemplo): 410.
- **45 adjuntos:** se responde 410 a todo `/wp-content/`, porque las fotos nuevas están en R2 con otras URLs.
- **Plantillas internas de Elementor** (`/elementor-hf/…`, `?elementor_library=`, `?elementor_snippet=`): 410.
- **Accesos de WordPress** (`/wp-admin`, `/wp-login.php`, `/wp-json`, `/xmlrpc.php`): 410.
- **Contenido no publicado:** ningún borrador, página privada ni entrada programada.
