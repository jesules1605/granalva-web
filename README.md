# Granalva — web corporativa

Proyecto completo de la web de Granalva, orientado a limpieza y lavandería profesional en Granada para empresas, alojamientos y particulares.

Para continuar el proyecto en Claude y convertirlo en la web definitiva con panel propio, empieza por `START-HERE-CLAUDE.md`. La arquitectura del CMS está documentada en `docs/CMS-ADMIN-PLAN.md`.

La web abre directamente sobre la portada. No existe introducción, espera inicial ni capa que bloquee la navegación. El vídeo es un fondo integrado y el contenido principal aparece desde el primer instante.

## Tecnología

- React 19
- Next.js 16.4 (App Router, compilación con Turbopack)
- TypeScript
- CSS global propio (Tailwind 4 solo como base de preflight)
- Despliegue previsto: Vercel (ver `docs/IMPLEMENTATION-PLAN.md`)

> Hasta la versión 10 el proyecto se compilaba con Vinext/Vite para ChatGPT Sites.
> En la fase 1 se migró a Next.js estándar sin cambios visuales ni de SEO
> (verificado con 55 capturas y una instantánea SEO de las 11 rutas).

## Requisitos y puesta en marcha

- Node.js 22.13 o posterior
- npm

```bash
npm ci
npm run dev
```

Comprobaciones:

```bash
npm run lint
npm test          # next build + 10 pruebas SEO por HTTP (title, H1, JSON-LD, enlaces, 301, 404…)
npm run build
npm start         # sirve la build de producción en http://localhost:3000
```

Regresión visual (requiere Playwright y un servidor en marcha):

```bash
npm run test:visual -- http://localhost:3000 tests/visual/out
node tests/visual/seo-snapshot.mjs http://localhost:3000 > seo.json
```

Variables de entorno: copia `.env.example` a `.env.local`. En esta fase solo se
usa `NEXT_PUBLIC_SITE_URL` (dominio canónico); si no se define se mantiene el de
la versión publicada en Sites.

## Estructura

```text
app/
  page.tsx            Portada e interacciones
  components/         Cabecera, pie, logotipo y plantilla de servicio
  lib/services.ts     Contenido de las páginas SEO
  servicios/          Índice y rutas individuales de servicio
  globals.css         Diseño, responsive y animaciones
  layout.tsx          Metadata y datos estructurados
  robots.ts           Directivas de rastreo
  sitemap.ts          Sitemap
public/
  fonts/              Granaina Font
  *.png / *.jpg       Imágenes y logotipo
  *.mp4               Recursos audiovisuales
docs/
  seo-strategy.md     Estrategia y mapa SEO
  IMPLEMENTATION-PLAN.md  Plan por fases y archivos afectados
  auditoria-2026-11/      Auditoría previa, capturas y mapa 301 de WordPress
tests/
  rendered-html.test.mjs  SEO de las 11 rutas, robots, sitemap y 404
  visual/                 Capturas en 5 viewports e instantánea SEO
CLAUDE.md              Contexto completo para continuar con Claude
```

## Funcionalidades incluidas

- Portada audiovisual visible inmediatamente.
- Recorridos diferenciados para empresas y particulares.
- Índice y nueve páginas indexables de servicio con contenido propio.
- Selector de tres tamaños de colada.
- Proceso con moto y cuatro etapas.
- Carrusel de sectores y carrusel de reseñas.
- Sección de equipo y experiencia.
- Preguntas frecuentes orientadas a búsquedas locales.
- Formulario de contacto que prepara la solicitud por correo.
- SEO técnico multipágina: metadatos únicos, canonical, Open Graph, JSON-LD por servicio, robots y sitemap de once URLs.
- Responsive, accesibilidad básica y movimiento reducido.

## Datos pendientes de producción definitiva

1. Logotipos autorizados de clientes.
2. Fotografías reales del equipo y las instalaciones.
3. URL de la aplicación de pedidos.
4. Cifra verificada de años de experiencia.
5. Endpoint o proveedor para envío directo del formulario.
6. Textos legales, privacidad y cookies.
7. Dominio final y perfil de Google Business enlazado.

No se deben inventar empresas clientes, cifras, precios, certificaciones o testimonios.

## Recursos de marca

- Logotipo: `public/granalva-logo.jpg`
- Tipografía: `public/fonts/granaina-limpia.otf`
- Vídeo de portada: `public/granalva-intro.mp4`
- Imágenes: `public/hero-laundry.png`, `public/service-cleaning.png`, `public/service-renting.png`

La atribución de Granaina Font se mantiene en el pie de página.
