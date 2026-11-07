# Estrategia SEO orgánica y local — Granalva

Última revisión: 7 de noviembre de 2026. Rama `feat/nextjs-payload`.

## Principios

- **Una intención = una URL.** Ninguna página compite con otra por la misma búsqueda. Solo se crea una página nueva si existe un servicio real, una intención diferenciada y contenido propio suficiente.
- **Contenido útil antes que palabras clave.** La palabra principal aparece de forma natural en title, H1, introducción y algún H2. No hay texto oculto, listas de municipios ni bloques de palabras clave.
- **Solo datos verdaderos.** No se publican cifras, clientes, reseñas estructuradas, certificaciones ni zonas sin confirmar.
- **No se garantiza ninguna posición.** El objetivo técnico es facilitar el rastreo, la comprensión, la relevancia local y la conversión. La autoridad se trabaja fuera de la web: ver `docs/SEO-LOCAL-Y-AUTORIDAD.md`.

## Mapa de URLs, intenciones y metadatos

La tabla se genera desde el código con `node scripts/seo-map.mjs` (fuente: `app/lib/services.ts`). La **matriz SEO completa** (estado, index, H2, canonical, datos estructurados, enlaces entrantes y salientes, CTA, imagen social y última actualización de cada URL, incluidas las páginas planificadas) está en `docs/SEO-MATRIX.md` y se genera con `node scripts/seo-matrix.mjs <url>`. Las pruebas `tests/rendered-html.test.mjs` comprueban que title y H1 coinciden exactamente en el HTML publicado.

| URL | Intención | Palabra principal | Secundarias | Title (car.) | H1 | Meta description (car.) |
|---|---|---|---|---|---|---|
| `/` | Encontrar una empresa de limpieza y lavandería en Granada (visión global de la empresa). | empresa de limpieza y lavandería Granada | Limpiezas Granalva (marca); limpieza y lavandería profesional Granada | Empresa de limpieza y lavandería en Granada \| Granalva (54) | Empresa de limpieza y lavandería profesional en Granada | Empresa de limpieza y lavandería profesional en Granada: empresas, oficinas y apartamentos turísticos, lavandería con recogida y entrega y renting textil. (154) |
| `/servicios` | Comparar o explorar todos los servicios (página índice que distribuye autoridad). | servicios de limpieza y lavandería Granada | (navegacional: no compite con /servicios/empresa-limpieza-granada) | Servicios de limpieza y lavandería en Granada \| Granalva (56) | Servicios de limpieza y lavandería en Granada. Cada servicio, bien definido. | Servicios de limpieza y lavandería en Granada: empresas, oficinas, apartamentos turísticos, hoteles, fin de obra, renting textil y lavandería a domicilio. (154) |
| `/servicios/empresa-limpieza-granada` | Contratar una empresa de limpieza profesional en Granada para un negocio o espacio profesional. | empresa de limpieza Granada | limpieza Granada; limpieza profesional Granada; servicios de limpieza Granada | Empresa de limpieza profesional en Granada \| Granalva (53) | Empresa de limpieza profesional en Granada | Empresa de limpieza en Granada para negocios, oficinas, locales y alojamientos. Servicios de limpieza profesional con equipo propio y presupuesto a medida. (155) |
| `/servicios/lavanderia-profesional-granada` | Externalizar la lavandería de un negocio en Granada con un servicio profesional. | lavandería Granada | lavandería profesional Granada; lavandería para empresas Granada; lavandería con recogida y entrega Granada | Lavandería profesional en Granada para empresas \| Granalva (58) | Lavandería profesional para empresas en Granada | Lavandería en Granada para empresas y alojamientos: desmanchado, lavado, secado, planchado y doblado, con recogida y entrega coordinadas. Pide propuesta. (153) |
| `/servicios/lavanderia-hoteles-granada` | Externalizar el lavado de la ropa de un hotel o alojamiento en Granada. | lavandería para hoteles Granada | lavado de ropa de hotel; lavandería hostelería Granada; recogida y entrega de ropa hotelera | Lavandería para hoteles en Granada \| Granalva (45) | Lavandería para hoteles y alojamientos en Granada | Lavandería para hoteles en Granada: lavado de sábanas y toallas, recogida y entrega de ropa hotelera coordinada con la ocupación y renting textil opcional. (155) |
| `/servicios/lavanderia-apartamentos-turisticos-granada` | Resolver el lavado de sábanas y toallas de uno o varios apartamentos turísticos en Granada. | lavandería apartamentos turísticos Granada | lavado de sábanas y toallas; lavandería para apartamentos; recogida y entrega | Lavandería para apartamentos turísticos en Granada \| Granalva (61) | Lavandería para apartamentos turísticos en Granada | Lavandería para apartamentos turísticos en Granada: recogida, lavado de sábanas y toallas y entrega coordinada con la rotación de huéspedes. (140) |
| `/servicios/lavanderia-sierra-nevada` | Contratar lavandería con recogida y entrega para un alojamiento de Sierra Nevada, sobre todo en temporada de esquí. | lavandería Sierra Nevada | lavandería profesional Sierra Nevada; lavandería para hoteles Sierra Nevada; lavandería apartamentos turísticos Sierra Nevada; recogida y entrega lavandería Sierra Nevada; renting textil Sierra Nevada; lavado de sábanas y toallas Sierra Nevada | Lavandería en Sierra Nevada para hoteles y apartamentos \| Granalva (66) | Lavandería profesional con recogida y entrega en Sierra Nevada | Lavandería profesional para hoteles, apartamentos turísticos y alojamientos de Sierra Nevada. Recogida, entrega, cuidado textil y rutas adaptadas a la temporada. (161) |
| `/servicios/limpieza-apartamentos-turisticos-granada` | Contratar la limpieza entre estancias de apartamentos turísticos o viviendas vacacionales en Granada. | limpieza apartamentos turísticos Granada | limpieza alquiler vacacional; limpieza entre huéspedes; limpieza de alojamientos | Limpieza de apartamentos turísticos en Granada \| Granalva (57) | Limpieza de apartamentos turísticos en Granada | Limpieza de apartamentos turísticos en Granada entre huéspedes, coordinada con entradas y salidas, con revisión final y lavandería opcional. (140) |
| `/servicios/limpieza-oficinas-locales-granada` | Contratar la limpieza periódica de una oficina, despacho o local comercial en Granada. | limpieza oficinas Granada | limpieza locales comerciales Granada; limpieza de despachos; limpieza de comercios | Limpieza de oficinas y locales comerciales en Granada \| Granalva (64) | Limpieza de oficinas y locales comerciales en Granada | Limpieza de oficinas, despachos y locales comerciales en Granada. Horarios adaptados a tu actividad, planificación periódica y equipo coordinado. (145) |
| `/servicios/limpieza-fin-de-obra-granada` | Dejar un espacio listo para su uso después de una obra o reforma en Granada. | limpieza fin de obra Granada | limpieza después de reforma; limpieza de obra; limpieza final de obra | Limpieza fin de obra y reformas en Granada \| Granalva (53) | Limpieza fin de obra y después de reformas en Granada | Limpieza fin de obra en Granada para viviendas, locales y oficinas. Limpieza después de reforma con valoración previa y revisión final. (135) |
| `/servicios/renting-textil-granada` | Disponer de ropa de cama y baño para un alojamiento sin comprar todo el stock. | renting textil Granada | alquiler de sábanas y toallas; textiles para hoteles; textiles para apartamentos | Renting textil en Granada para alojamientos \| Granalva (54) | Renting textil para alojamientos y empresas en Granada | Renting textil en Granada: alquiler de sábanas y toallas para hoteles y apartamentos turísticos, con lavandería, rotación y entregas acordadas. (143) |
| `/servicios/lavanderia-domicilio-granada` | Que un particular delegue su colada con recogida y entrega en casa en Granada. | lavandería a domicilio Granada | recogida y entrega de ropa; colada a domicilio; lavado y doblado | Lavandería a domicilio en Granada con recogida \| Granalva (57) | Lavandería a domicilio con recogida y entrega en Granada | Lavandería a domicilio en Granada: recogemos tu ropa, la lavamos, secamos y doblamos, y te la devolvemos en casa. Colada de 4, 8 o 12 kg. (137) |

#### Enlaces relacionados por servicio (texto de anclaje)

- `/servicios/empresa-limpieza-granada` → «limpieza de oficinas y locales comerciales» (`/servicios/limpieza-oficinas-locales-granada`), «limpieza de apartamentos turísticos» (`/servicios/limpieza-apartamentos-turisticos-granada`), «limpieza fin de obra en Granada» (`/servicios/limpieza-fin-de-obra-granada`), «lavandería profesional para empresas» (`/servicios/lavanderia-profesional-granada`)
- `/servicios/lavanderia-profesional-granada` → «lavandería para hoteles en Granada» (`/servicios/lavanderia-hoteles-granada`), «lavandería para apartamentos turísticos» (`/servicios/lavanderia-apartamentos-turisticos-granada`), «renting textil para alojamientos» (`/servicios/renting-textil-granada`)
- `/servicios/lavanderia-hoteles-granada` → «renting textil para hoteles y apartamentos» (`/servicios/renting-textil-granada`), «lavandería profesional en Granada» (`/servicios/lavanderia-profesional-granada`), «lavandería para apartamentos turísticos» (`/servicios/lavanderia-apartamentos-turisticos-granada`), «lavandería para hoteles en Sierra Nevada» (`/servicios/lavanderia-sierra-nevada`)
- `/servicios/lavanderia-apartamentos-turisticos-granada` → «limpieza de apartamentos turísticos en Granada» (`/servicios/limpieza-apartamentos-turisticos-granada`), «alquiler de sábanas y toallas (renting textil)» (`/servicios/renting-textil-granada`), «lavandería para hoteles y alojamientos» (`/servicios/lavanderia-hoteles-granada`), «lavandería para apartamentos en Sierra Nevada» (`/servicios/lavanderia-sierra-nevada`)
- `/servicios/lavanderia-sierra-nevada` → «lavandería para hoteles y alojamientos» (`/servicios/lavanderia-hoteles-granada`), «lavandería para apartamentos turísticos» (`/servicios/lavanderia-apartamentos-turisticos-granada`), «renting textil para la temporada» (`/servicios/renting-textil-granada`)
- `/servicios/limpieza-apartamentos-turisticos-granada` → «lavandería para apartamentos turísticos» (`/servicios/lavanderia-apartamentos-turisticos-granada`), «renting textil para alojamientos» (`/servicios/renting-textil-granada`), «empresa de limpieza profesional en Granada» (`/servicios/empresa-limpieza-granada`)
- `/servicios/limpieza-oficinas-locales-granada` → «empresa de limpieza profesional en Granada» (`/servicios/empresa-limpieza-granada`), «limpieza fin de obra antes de abrir un local» (`/servicios/limpieza-fin-de-obra-granada`), «lavandería para empresas con uniformidad» (`/servicios/lavanderia-profesional-granada`)
- `/servicios/limpieza-fin-de-obra-granada` → «limpieza periódica de oficinas y locales» (`/servicios/limpieza-oficinas-locales-granada`), «empresa de limpieza profesional en Granada» (`/servicios/empresa-limpieza-granada`), «limpieza de apartamentos turísticos reformados» (`/servicios/limpieza-apartamentos-turisticos-granada`)
- `/servicios/renting-textil-granada` → «lavandería para hoteles en Granada» (`/servicios/lavanderia-hoteles-granada`), «lavandería para apartamentos turísticos» (`/servicios/lavanderia-apartamentos-turisticos-granada`), «limpieza de apartamentos turísticos» (`/servicios/limpieza-apartamentos-turisticos-granada`), «renting textil para la temporada en Sierra Nevada» (`/servicios/lavanderia-sierra-nevada`)
- `/servicios/lavanderia-domicilio-granada` → «lavandería profesional para empresas» (`/servicios/lavanderia-profesional-granada`), «servicios de limpieza en Granada» (`/servicios/empresa-limpieza-granada`)

### Búsquedas prioritarias → página que las atiende

| Búsqueda | URL principal |
|---|---|
| empresa de limpieza Granada / empresa de limpieza en Granada | `/servicios/empresa-limpieza-granada`, con la portada como apoyo de marca |
| limpieza Granada / limpieza profesional Granada / servicios de limpieza Granada | `/servicios/empresa-limpieza-granada` |
| lavandería Granada / lavandería profesional Granada / lavandería para empresas Granada | `/servicios/lavanderia-profesional-granada` |
| lavandería hoteles Granada | `/servicios/lavanderia-hoteles-granada` |
| lavandería apartamentos turísticos Granada | `/servicios/lavanderia-apartamentos-turisticos-granada` |
| limpieza apartamentos turísticos Granada | `/servicios/limpieza-apartamentos-turisticos-granada` |
| limpieza oficinas Granada / limpieza locales comerciales Granada | `/servicios/limpieza-oficinas-locales-granada` |
| limpieza fin de obra Granada | `/servicios/limpieza-fin-de-obra-granada` |
| renting textil Granada | `/servicios/renting-textil-granada` |
| lavandería Sierra Nevada / lavandería profesional Sierra Nevada / lavandería para hoteles Sierra Nevada / lavandería apartamentos (turísticos) Sierra Nevada / recogida y entrega lavandería Sierra Nevada / renting textil Sierra Nevada / lavado de sábanas y toallas Sierra Nevada | `/servicios/lavanderia-sierra-nevada` |
| contacto / presupuesto (navegacional) | `/contacto` (conserva la URL de WordPress) |
| quiénes somos / equipo (marca) | `/sobre-nosotros` (conserva la URL de WordPress) |
| lavandería a domicilio Granada / lavandería con recogida y entrega Granada | `/servicios/lavanderia-domicilio-granada` (particulares). La recogida y entrega para empresas se trata en `/servicios/lavanderia-profesional-granada` |
| Limpiezas Granalva (marca) | `/` |

Riesgo de solapamiento vigilado: la portada («empresa de limpieza y lavandería») y `/servicios/empresa-limpieza-granada` («empresa de limpieza profesional»). La portada presenta la empresa en conjunto y enlaza la página de servicio con un texto de anclaje descriptivo. Si Search Console muestra que ambas se alternan para la misma consulta, se refuerza la página de servicio (contenido, casos de éxito y enlaces internos) y se mantiene la portada orientada a marca y a la combinación limpieza + lavandería.

**Lavandería industrial:** no se usa esa expresión mientras Granalva no confirme instalaciones y capacidad que la justifiquen.

**Sierra Nevada:**
- **Lavandería con recogida y entrega y renting textil:** confirmados por el propietario el 7 de noviembre de 2026. Tienen la landing `/servicios/lavanderia-sierra-nevada`, que permanece publicada todo el año; fuera de temporada se actualiza el bloque comercial, pero la URL no se elimina.
- **Limpieza de alojamientos en Sierra Nevada:** **no está confirmada**, así que no se menciona. Si se confirma, se añade una sección propia a la landing; no se crea otra URL salvo que exista contenido suficiente.
- **Sin datos no confirmados:** no se publican precios, plazos garantizados, frecuencias ni zonas concretas (por ejemplo, Pradollano) hasta confirmarlos.

## Portada compacta orientada a conversión B2B

La portada resume y distribuye; no contiene todo el contenido SEO de cada servicio. Tiene 10 bloques, en este orden:

1. Cabecera fija y cinta superior.
2. Hero con H1, introducción y CTA por prioridad.
3. Autoridad verificable.
4. Empresas frente a particulares, con un peso de 70/30.
5. Selector dinámico de 4 líneas de servicio.
6. Proceso.
7. Bloque estacional de Sierra Nevada.
8. Sectores.
9. Reseñas.
10. CTA final y formulario empresarial.

Detalles de implementación:

- **Longitud:** pasa de 10 193 px a unos 7 900 px de alto a 1440 px de ancho.
- **Contenido trasladado:** el equipo y la historia de marca están ahora en `/sobre-nosotros`, y el selector de colada en `/servicios/lavanderia-domicilio-granada#colada`.
- **Selector dinámico:** sigue el patrón accesible de pestañas, con flechas, Inicio y Fin. Los 4 paneles están en el HTML del servidor; los inactivos llevan `hidden`, pero su texto y sus enlaces son rastreables. Cada panel enlaza las páginas indexables de su línea.
- **Prioridad de CTA:**
  1. «Solicitar presupuesto empresarial»;
  2. «Contratar lavandería profesional»;
  3. «Limpieza para empresas»;
  4. «Temporada en Sierra Nevada»;
  5. «Hacer un pedido particular».
- **CTA en páginas B2B:** no se usa «Hacer un pedido». Cada servicio tiene su propio CTA: «Planificar recogidas y entregas», «Reservar ruta de temporada», etc.

## Formularios y medición de conversiones

- **Variantes:** formulario general (portada y `/contacto`) y formulario de Sierra Nevada, incrustado en la landing (`#reservar-ruta`).
- **Ampliación progresiva:** 6 campos obligatorios o básicos y un desplegable opcional de «datos operativos»: ubicación, unidades, volumen, frecuencia, inicio e información adicional.
- **Atribución guardada con cada solicitud:** página de envío, página de entrada, referrer y parámetros UTM de la primera visita.
- **Preselección:** `/contacto?servicio=<slug>` preselecciona el servicio. La canonical sigue siendo `/contacto`, así que los parámetros no generan duplicados.

## Contenido de cada página de servicio

Cada página incluye, en este orden:

1. Breadcrumbs visibles.
2. H1 y entradilla.
3. CTA de presupuesto y teléfono.
4. «El servicio»: un H2 con la palabra principal y tres párrafos que integran las palabras secundarias.
5. «Qué resuelve»: necesidades reales del cliente.
6. «Qué incluye».
7. «Cómo trabajamos»: cuatro pasos.
8. «Para quién y dónde», con la zona de servicio real.
9. Preguntas frecuentes visibles.
10. Entre dos y cuatro servicios relacionados, con texto de anclaje descriptivo.
11. CTA adaptado a la intención, con teléfono y correo.
12. Fecha de revisión del contenido.

Pendiente de material real: fotografías propias por servicio, casos de éxito autorizados y reseñas verificables. Las imágenes actuales se describen con un texto alternativo neutro, porque no se ha confirmado que sean fotografías de Granalva.

## Enlazado interno

- **Portada:** enlaza los 9 servicios desde el contenido renderizado en servidor (bloque «Todos los servicios» y tarjetas de audiencia), además de cabecera y pie.
- **`/servicios`:** enlaza cada servicio con su H1 como texto de anclaje, en lugar de «Ver servicio».
- **Cada servicio:** enlaza de 2 a 4 servicios relacionados (ver la lista de arriba), el formulario de presupuesto (`/#contacto`) y el teléfono.
- **Pie:** los 9 servicios, contacto y presupuesto. Los textos legales se añadirán en la fase 7, cuando existan sus páginas.
- **Menú móvil:** navegación principal y los 9 servicios.
- **Blog y casos de éxito (fases 5 y 8):** cada artículo y cada caso enlazará la página comercial correspondiente.
- **Prueba automática:** ninguna página indexable queda huérfana y todos los enlaces internos responden 200.

## SEO técnico implementado

| Elemento | Implementación | Verificación |
|---|---|---|
| Panel y API | `/admin` y `/api/*` con `X-Robots-Tag: noindex, nofollow`, `Disallow` en robots y acceso por roles. Las solicitudes no se pueden leer ni crear desde la API pública | Prueba «panel y API» |
| Contenido duplicado | Similitud de texto entre cada par de páginas indexables, medida con fragmentos de 5 palabras: falla por encima del 50 %. Máximo actual: 29 % | Prueba «duplicados» |
| Renderizado | HTML generado de forma estática (SSG). El H1, la introducción y los enlaces no dependen de JavaScript. La portada es un componente de servidor y solo las zonas interactivas son de cliente | `npm test` lee el HTML inicial |
| Códigos HTTP | 200 en páginas válidas; 404 real en direcciones inexistentes (`dynamicParams = false`) | Prueba 8 |
| 404 | Página diseñada con `noindex, follow` y enlaces a los 9 servicios | Prueba 8 |
| Redirecciones | `proxy.ts` resuelve en un único 301 tres casos: www → sin www, URLs de WordPress → su equivalente, y barra final → sin barra. `skipTrailingSlashRedirect` evita el 308 encadenado de Next | Pruebas 9 y 10 |
| Canonical | Autorreferente y absoluto, definido por `NEXT_PUBLIC_SITE_URL` (por defecto `https://limpiezasgranalva.com`) | Prueba 1 |
| Indexación | `NEXT_PUBLIC_NOINDEX=true` (o `VERCEL_ENV=preview`) → `noindex, nofollow` y `Disallow: /` | Verificado manualmente con una build de preproducción |
| robots.txt | `Allow: /`; `Disallow` en `/admin`, `/api/` y `/preview`; sitemap | Prueba 7 |
| sitemap.xml | Solo las 11 URLs indexables, con `lastmod` real (fecha de revisión del contenido) | Prueba 7 |
| Datos estructurados | `Organization` + `ProfessionalService` y `WebSite` (global); `WebPage` + `FAQPage` en portada; `CollectionPage` + `ItemList` + `BreadcrumbList` en `/servicios`; `WebPage` + `Service` + `BreadcrumbList` + `FAQPage` en cada servicio | Prueba 4: JSON válido, FAQ visibles, sin `Review`/`AggregateRating`, sin `legalName` inventado |
| Open Graph / Twitter | Por página; imagen social de 1200×630 | Prueba 1 |
| Imágenes | `next/image` con AVIF/WebP y tamaños adaptados (antes: PNG de 2 MB sin optimizar), nombres descriptivos y `alt` en todas | Prueba 5 |
| Vídeo del hero | No compite con el contenido: se carga tras `load`, póster WebP de 100 KB (antes, fondo PNG de 2 MB). Sin reproducción automática con movimiento reducido o ahorro de datos | Playwright |
| Fuentes | Granaina precargada con `font-display: swap`. Retirada Geist, que se descargaba sin usarse | Lighthouse |
| Accesibilidad | Menú móvil (aria-expanded, foco atrapado, Escape); breadcrumbs; tabs con `aria-controls`; contraste AA en las etiquetas sobre fondo claro | Lighthouse + Playwright |

### Mediciones de laboratorio (Lighthouse 12.8.2, `next start` local, móvil simulado salvo indicación)

| Página | Fase SEO: 1.ª medición (antes de diferir el vídeo y corregir accesibilidad) | Fase SEO: medición final | Fase B2B (actual) |
|---|---|---|---|
| `/` móvil | Rend. 87 · Acces. 96 · LCP 3,1 s · TBT 300 ms · 2,3 MB | Rend. 91 · Acces. 97 · LCP 3,3 s · TBT 110 ms | **Rend. 92 · Acces. 100 · SEO 100 · BP 100 · LCP 3,3 s · CLS 0 · TBT 50 ms** |
| `/` escritorio | Rend. 100 · Acces. 96 · LCP 0,7 s | Rend. 100 · Acces. 100 | **Rend. 100 · Acces. 97\* · SEO 100 · LCP 0,7 s · CLS 0** |
| Página de servicio (hoteles) móvil | Rend. 96 · Acces. 96 · LCP 2,6 s · 267 KB | Rend. 98 · Acces. 100 · LCP 2,4 s | **Rend. 96 · Acces. 100 · SEO 100 · LCP 2,8 s · CLS 0 · 374 KB** |
| `/servicios/lavanderia-sierra-nevada` móvil | — (no existía) | — | **Rend. 95 · Acces. 100 · SEO 100 · LCP 2,8 s · CLS 0** (con caché de imágenes; 3,6 s en la primera conversión AVIF) |
| `/contacto` móvil | — (no existía) | — | **Rend. 97 · Acces. 100 · SEO 100 · LCP 2,6 s · CLS 0** |
| `/sobre-nosotros` móvil | — (no existía) | — | **Rend. 96 · Acces. 100 · SEO 100 · LCP 2,7 s · CLS 0** |

\* El único aviso es de contraste y se mide a mitad de la animación automática del recorrido «Así funciona». Los colores intermedios de la transición no cumplen, pero sus dos estados finales sí (más de 4,5:1).

La versión 10 original (vinext) no se midió con Lighthouse; la referencia de partida es la 1.ª medición de la fase SEO, ya en Next.js.

Diferencias de la fase B2B respecto a la anterior:

- La portada mide 7 900 px de alto a 1440 px de ancho, frente a 10 193 (22 % menos).
- El peso de la portada sigue dominado por el vídeo del hero (unos 2 MB), que se descarga después del evento `load` y no se descarga con movimiento reducido ni con ahorro de datos.
- El LCP móvil de las páginas interiores está entre 2,6 y 2,8 s en la simulación de un móvil lento. Los 2,4 s de la fase anterior se midieron en otra ejecución; la diferencia entra en la variación habitual de Lighthouse y se debe a la imagen del hero.

Son datos de laboratorio con un móvil lento simulado; **no son datos reales de usuarios**. Los Core Web Vitals reales (LCP < 2,5 s, INP < 200 ms, CLS < 0,1) se comprobarán en Search Console y PageSpeed Insights cuando haya tráfico en el dominio definitivo. En la portada, el LCP en móvil es la imagen de fondo del hero y el 53 % del tiempo es «render delay» en la simulación. Si los datos reales lo confirman, la siguiente mejora será servir el hero con `next/image` en lugar de un fondo CSS.

## Competencia

Ver `docs/COMPETITOR-SEO-AUDIT.md`: 16 páginas de 14 competidores, con title, H1, estructura, datos estructurados, velocidad, autoridad, fortalezas, debilidades y oportunidades.

## Requisitos SEO del CMS (fases 3 a 8)

Todo lo siguiente será editable en `/admin` sin tocar código:

- **Campos por página, servicio y artículo:**
  - title SEO, meta description, H1 y slug;
  - canonical opcional, imagen social e index/noindex;
  - FAQ (alimenta FAQPage solo si es visible);
  - servicios relacionados con su texto de anclaje;
  - fecha de actualización.
  - Breadcrumbs y datos estructurados se generan solos a partir de estos campos.
- **Globales:** datos NAP (`site-settings`), navegación y redirecciones.

Validaciones obligatorias (hooks `beforeValidate`/`beforeChange` de Payload):

| Regla | Comportamiento |
|---|---|
| Title duplicado | Error si otro documento publicado usa el mismo title |
| Slug duplicado | Índice único por colección y error descriptivo |
| H1 vacío | Campo obligatorio |
| Description vacía o fuera de 70-165 caracteres | Error si falta y aviso si la longitud no es adecuada |
| Imagen sin `alt` | `alt` obligatorio en la colección `media` |
| Cambio de slug publicado | Crea automáticamente una redirección 301 de la URL antigua a la nueva y comprueba que no haya bucles ni cadenas |
| Borradores | Nunca aparecen en el sitemap; las vistas previas llevan `noindex`; `/preview` está bloqueado en robots |
| noindex | Excluye la página del sitemap automáticamente |

## Migración desde WordPress

Ver `docs/MEDICION-SEO.md` (línea base) y `app/lib/redirects.ts` (mapa 301). Resumen:

- `/servicios-de-limpieza-granada/` → `/servicios`. Activa.
- `/sobre-nosotros/`, `/contacto/` y las 4 páginas legales conservan su slug: la barra final se resuelve con un 301. Las páginas se crearán en las fases 6 y 7. Hasta entonces quedan marcadas como pendientes en `app/lib/redirects.ts`, y **WordPress sigue en producción**.
- Antes del cambio de DNS, se descarga de Search Console la lista completa de URLs con impresiones y se añade cualquier URL que falte al mapa.
