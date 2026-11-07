# Granalva — web corporativa

Proyecto completo de la web de Granalva, orientado a limpieza y lavandería profesional en Granada para empresas, alojamientos y particulares.

Para continuar el proyecto en Claude y convertirlo en la web definitiva con panel propio, empieza por `START-HERE-CLAUDE.md`. La arquitectura del CMS está documentada en `docs/CMS-ADMIN-PLAN.md`.

La web abre directamente sobre la portada. No existe introducción, espera inicial ni capa que bloquee la navegación. El vídeo es un fondo integrado y el contenido principal aparece desde el primer instante.

## Tecnología

- React 19
- Next.js 16
- TypeScript
- Vinext + Vite
- CSS global propio
- Cloudflare Workers / ChatGPT Sites

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
npm test
npm run build
```

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
.openai/hosting.json  Identidad de despliegue en Sites
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
