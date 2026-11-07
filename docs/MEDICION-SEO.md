# Plan de medición e informe SEO inicial — Granalva

## 1. Informe inicial (línea base, 7 de noviembre de 2026)

### Lo que se ha podido medir

Rastreo directo de la web en producción (WordPress 7.1 + Elementor, `page-sitemap.xml`):

| URL actual | HTTP | Title | H1 visible | Meta description |
|---|---|---|---|---|
| `/` | 200 | Servicio de Limpieza en Granada \| Empresas y Particulares \| Granalva | «Servicios De Limpieza En Granada», precedido de «Resultados 100 % impecables» | Sí (138 car.) |
| `/servicios-de-limpieza-granada/` | 200 | Limpieza de casas y oficinas - Granalva | Servicios de Limpieza en Granada | Sí (137 car.) |
| `/sobre-nosotros/` | 200 | Sobre Nosotros - Limpiezas Granalva | Sobre Nosotros / Confianza en la limpieza del hogar y la oficina | No |
| `/contacto/` | 200 | Contacto - Limpiezas Granalva | Sin H1 | No |
| `/aviso-legal/` | 200 | Aviso Legal - Limpiezas Granalva | Aviso Legal | No |
| `/politica-de-privacidad/` | 200 | Política de Privacidad - Limpiezas Granalva | Política de Privacidad | No |
| `/politica-de-cookies/` | 200 | Política de Cookies - Limpiezas Granalva | Política de Cookies | No |
| `/declaracion-de-accesibilidad/` | 200 | Declaración de Accesibilidad - Limpiezas Granalva | Declaración de Accesibilidad | No |

Diagnóstico de la web actual:

- Solo hay **una** página de servicio para todas las líneas de negocio. No existen URLs para lavandería, hoteles, apartamentos turísticos, oficinas, fin de obra, renting textil ni lavandería a domicilio.
- La portada y `/servicios-de-limpieza-granada/` comparten prácticamente el mismo H1, así que **compiten por la misma búsqueda**.
- 6 de 8 páginas no tienen meta description y `/contacto/` no tiene H1.
- La palabra «lavandería» no aparece en ningún title ni H1, aunque es una línea de negocio prioritaria.
- La portada afirma «Resultados 100 % impecables», una frase no demostrable.

Web nueva (preproducción local, no publicada): 11 URLs indexables con title, H1 y description únicos, y Lighthouse SEO 100. El detalle está en `docs/seo-strategy.md`.

### Lo que no se ha podido medir y debe obtener el propietario

No hay acceso a Search Console, Google Analytics ni Google Business Profile desde este proyecto. **Antes de cambiar el DNS**, exportar y guardar en `docs/medicion/` (datos sin información personal):

1. **Search Console**, últimos 16 meses:
   - Rendimiento → Consultas y Páginas (CSV), con clics, impresiones, CTR y posición media;
   - Indexación → Páginas: URLs indexadas, excluidas y errores;
   - Core Web Vitals (móvil y ordenador).
2. **Google Business Profile**, últimos 6 meses: llamadas, clics a la web, solicitudes de ruta, visualizaciones y búsquedas que activaron el perfil.
3. **Google Analytics / Site Kit** (si existe): sesiones orgánicas y conversiones de formulario y teléfono.
4. **Posiciones de referencia:** búsqueda manual en incógnito, desde Granada y en móvil, de las 17 consultas prioritarias, anotando la posición en el mapa y en los resultados orgánicos. Repetir el mismo día de cada mes.

## 2. Qué se medirá después del lanzamiento

| Métrica | Fuente | Frecuencia | Para qué |
|---|---|---|---|
| Impresiones, clics, CTR y posición por consulta | Search Console | Semanal el primer mes; después mensual | Ver qué consultas reales atrae cada página |
| Páginas que reciben tráfico | Search Console → Páginas | Mensual | Detectar páginas sin impresiones o con solapamientos |
| Búsquedas de marca («granalva», «limpiezas granalva») | Search Console (filtro de consulta) | Mensual | Notoriedad |
| Cobertura e indexación | Search Console → Páginas | Semanal el primer mes | 404, redirecciones y páginas excluidas |
| Core Web Vitals reales (LCP, INP, CLS) | Search Console + PageSpeed Insights | Mensual | Rendimiento real de usuarios |
| Formularios enviados | Colección `contact-submissions` en `/admin` (ya operativa): servicio, formulario (general o Sierra Nevada), página de envío, página de entrada, referrer y UTM | Mensual | Conversiones atribuibles por página y campaña |
| Reservas de ruta de Sierra Nevada | `contact-submissions` filtrado por `formulario = sierra-nevada` | Semanal en temporada | Rendimiento de la campaña estacional |
| Llamadas | Google Business Profile + clics en `tel:` (evento de analítica con consentimiento) | Mensual | Conversiones telefónicas |
| Pedidos de lavandería | Sistema de pedidos, cuando exista | Mensual | Conversión del particular |
| Rendimiento local | Estadísticas de Google Business Profile | Mensual | Visibilidad en el mapa |
| Tráfico de Google Business Profile | Visitas con `utm_campaign=gbp` | Mensual | Separar el tráfico del perfil del orgánico |

La analítica no esencial solo se carga tras el consentimiento de cookies (fase 7). Los datos personales de los formularios no se envían a la analítica.

## 3. Migración e indexación: comprobaciones del día del cambio

Complementa `docs/PRODUCTION-CHECKLIST.md`, sección 8.

1. Lista completa de URLs antiguas (sitemap + Search Console + enlaces externos conocidos) cotejada con `app/lib/redirects.ts`.
2. Cada URL antigua: **un único 301** a su equivalente. Nunca se redirigen todas a la portada.
3. `https://www.limpiezasgranalva.com/*` → 301 → `https://limpiezasgranalva.com/*`, y HTTP → HTTPS (desde el hosting).
4. Canonicals, `robots.txt` (sin `Disallow: /`) y `sitemap.xml` con el dominio definitivo. Comprobar que **no** está activo `NEXT_PUBLIC_NOINDEX`.
5. Search Console:
   - verificar la propiedad de dominio (`GOOGLE_SITE_VERIFICATION` o DNS);
   - enviar `sitemap.xml`;
   - solicitar indexación de la portada y de los servicios prioritarios.
6. Primeras 4 semanas: revisar 404, errores 5xx, redirecciones, cobertura, caídas de impresiones por página y formularios recibidos.
7. Mantener WordPress accesible en un entorno privado durante el periodo de seguridad acordado.
