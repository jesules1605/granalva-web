# Estrategia SEO local — Granalva

## Objetivo

La web se organiza alrededor de una entidad local —Granalva— y de páginas que resuelven intenciones concretas de empresas, alojamientos y particulares en Granada. La prioridad comercial es B2B; el recorrido doméstico permanece como línea secundaria diferenciada.

No existe una promesa legítima de «posición 1». El objetivo técnico es facilitar rastreo, comprensión temática, relevancia local y conversión. La autoridad real se construirá con reseñas, casos autorizados, perfil de Google Business, menciones locales y enlaces de calidad.

## Arquitectura e intención por URL

| URL | Intención principal |
|---|---|
| `/` | empresa de limpieza y lavandería en Granada |
| `/servicios` | servicios de limpieza y lavandería en Granada |
| `/servicios/empresa-limpieza-granada` | empresa de limpieza Granada / limpieza profesional Granada |
| `/servicios/lavanderia-profesional-granada` | lavandería profesional Granada / lavandería para empresas |
| `/servicios/lavanderia-hoteles-granada` | lavandería hoteles Granada / ropa de cama hotel |
| `/servicios/lavanderia-apartamentos-turisticos-granada` | lavandería apartamentos turísticos Granada |
| `/servicios/limpieza-apartamentos-turisticos-granada` | limpieza apartamentos turísticos Granada |
| `/servicios/limpieza-oficinas-locales-granada` | limpieza oficinas Granada / limpieza locales comerciales |
| `/servicios/limpieza-fin-de-obra-granada` | limpieza fin de obra Granada / limpieza después de reforma |
| `/servicios/renting-textil-granada` | renting textil Granada / alquiler de sábanas y toallas |
| `/servicios/lavanderia-domicilio-granada` | lavandería a domicilio Granada / recogida de colada |

Las expresiones se integran con naturalidad en título, H1, introducción y respuestas útiles. No se crean páginas casi idénticas ni se repiten palabras clave de manera artificial.

## Implementación técnica

- Título, descripción y canonical únicos por URL.
- H1 único y jerarquía H2/H3 coherente.
- URLs descriptivas agrupadas bajo `/servicios/`.
- Enlaces internos desde cabecera, portada, servicios relacionados y pie.
- Alt descriptivo en imágenes contextuales.
- Datos estructurados globales de organización y datos `Service`, `BreadcrumbList` y `FAQPage` en cada servicio.
- Sitemap XML con URLs absolutas y fecha de modificación significativa.
- Robots abierto a rastreo y con referencia al sitemap.
- Pruebas automáticas sobre las once rutas indexables.

## Migración al dominio definitivo

1. Cambiar `SITE_URL` en `app/lib/services.ts` por el dominio canónico final.
2. Publicar y comprobar canonical, Open Graph, JSON-LD, `robots.txt` y `sitemap.xml`.
3. Configurar redirecciones 301 desde cualquier URL anterior equivalente.
4. Verificar la propiedad de dominio en Google Search Console.
5. Enviar `/sitemap.xml` y comprobar que las once páginas se descubren sin errores.
6. Usar Inspección de URL para revisar renderizado e indexación de las páginas prioritarias.
7. Enlazar el dominio desde el perfil verificado de Google Business y mantener nombre, teléfono y área de servicio coherentes.

## Autoridad pendiente

- Incorporar logotipos únicamente de clientes que hayan autorizado su publicación.
- Añadir casos de éxito con necesidad, solución y resultado demostrable.
- Sustituir imágenes provisionales por fotografías reales de equipo, lavandería, vehículo y procesos.
- Confirmar la cifra exacta de años de experiencia antes de publicarla.
- Conseguir y responder reseñas verificables; no trasladar testimonios sin fuente.
- Obtener menciones y enlaces editoriales locales relevantes, sin comprar enlaces ni crear redes artificiales.

## Producción y medición

- Conectar el formulario a un proveedor seguro con antispam y consentimiento legal.
- Añadir aviso legal, privacidad y cookies con datos fiscales definitivos.
- Medir conversiones de formulario, llamadas y solicitudes de recogida.
- Comprobar Core Web Vitals en el dominio real y optimizar especialmente vídeo e imágenes.
- Revisar consultas, páginas, CTR e indexación en Search Console de forma periódica.
