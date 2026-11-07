# Granalva — traspaso completo para Claude

Este repositorio es el **código fuente íntegro de la versión 10 publicada** en:

- `https://granalva-propuesta-visual.manueljesus1605.chatgpt.site`
- Commit de origen: `eec1d255558c5b82ed2f4968b4292ff4ad8b3614`

No reconstruyas la web a partir de capturas ni de la URL pública. El código, la fuente Granaina, el logotipo, los vídeos, las imágenes, las once rutas indexables, las pruebas y la documentación SEO están aquí.

## Orden de lectura para ahorrar contexto y créditos

1. Lee este archivo.
2. Lee `CLAUDE.md`, que contiene todas las decisiones vigentes de marca, contenido y comportamiento.
3. Para el panel de administración, lee `docs/CMS-ADMIN-PLAN.md`.
4. Para los fallos ya detectados y los criterios de aceptación, lee `docs/AUDIT-HANDOFF.md`.
5. Para publicación, dominio y migración, lee `docs/PRODUCTION-CHECKLIST.md`.
6. Consulta archivos concretos del código solo cuando la tarea los afecte. No vuelvas a auditar todo el sitio en cada conversación.

## Encargo principal

Convertir esta base visual en la web definitiva de `limpiezasgranalva.com`, conservando su diseño y sus once páginas SEO, y añadir un CMS propio con panel protegido en `/admin` para que el propietario pueda:

- editar textos, imágenes, vídeos, llamadas a la acción y datos de contacto;
- crear y editar servicios y páginas sin tocar código;
- administrar equipo, clientes, logotipos autorizados, reseñas y casos de éxito;
- publicar artículos del blog;
- gestionar SEO por página, redirecciones, borradores, versiones y publicación programada;
- recibir, consultar y exportar solicitudes de contacto;
- subir archivos a almacenamiento permanente.

La arquitectura acordada como punto de partida es **Next.js estable + Payload CMS + PostgreSQL**, con almacenamiento permanente para medios. Payload debe convivir en el mismo repositorio y exponer el panel en `/admin`. Si una incompatibilidad real obliga a cambiar de enfoque, documenta la evidencia y pide confirmación antes de sustituir esta arquitectura.

## Primera tarea técnica

1. Crea una rama de trabajo, sin borrar el historial.
2. Ejecuta la línea base:

   ```bash
   npm ci
   npm run lint
   npm test
   ```

3. Captura la versión actual en escritorio y móvil para comparación visual.
4. Migra de Vinext/Vite a una aplicación Next.js compatible con la versión vigente de Payload, preservando rutas, componentes, contenido, metadatos, recursos y apariencia.
5. Implementa el CMS por fases siguiendo `docs/CMS-ADMIN-PLAN.md`.
6. Corrige los defectos enumerados en `docs/AUDIT-HANDOFF.md`.
7. Despliega primero una URL de preproducción. No cambies el DNS de `limpiezasgranalva.com` hasta completar la lista de `docs/PRODUCTION-CHECKLIST.md`.

## Decisiones de diseño obligatorias

- No hay introducción, splash, cuenta atrás ni vídeo que bloquee la entrada. El contenido se ve de inmediato.
- La cabecera completa, incluida la cinta superior, permanece fija al hacer scroll y debe tener navegación móvil accesible.
- No hay círculos giratorios, rombos/diamantes abstractos ni mosaicos decorativos que compitan con la marca. Cuando se necesite un emblema, se usa el logotipo real, estático y sin deformarlo.
- Descriptor exacto: `SERVICIO DE LIMPIEZA Y LAVANDERÍA PROFESIONAL`.
- El titular `Tu empresa no puede parar. Tu hogar tampoco debería esperar.` debe quedar centrado, equilibrado y sin una palabra huérfana.
- El titular `Preparados para espacios que tienen que estar siempre listos.` debe ocupar visualmente el ancho útil de la pantalla en escritorio, con un salto de línea intencionado y fluido, sin dejar grandes huecos laterales. En móvil debe adaptarse sin recortes ni solapamientos.
- B2B es prioritario; particulares es un recorrido secundario, claramente visible.
- No inventar clientes, años, cifras, certificaciones, reseñas ni resultados.

## Datos y recursos existentes

- Teléfono: `744 488 964` / `+34 744 488 964`
- Correo: `info@limpiezasgranalva.com`
- Logo: `public/granalva-logo.jpg`
- Fuente: `public/fonts/granaina-limpia.otf`
- Vídeos: `public/granalva-intro*.mp4`
- Imágenes: `public/hero-laundry.png`, `public/service-cleaning.png`, `public/service-renting.png`
- Estrategia SEO: `docs/seo-strategy.md`
- Variables futuras: `.env.example`

## Datos que deben pedirse al propietario, no suponerse

- fotografías reales de Margarita, Jesús, equipo, instalaciones, vehículos y procesos;
- logotipos oficiales y autorización de cada cliente que vaya a publicarse;
- cifra exacta y demostrable de años de experiencia;
- licencia o autorización de uso web de Granaina Font;
- autenticidad y fuente de cada reseña;
- cobertura real, incluida la confirmación de Sierra Nevada;
- URL final de pedidos;
- razón social, NIF, domicilio y demás datos legales;
- acceso al dominio, DNS, WordPress y Search Console;
- proveedor final de alojamiento, base de datos, medios y correo transaccional.

## Regla de publicación

La web WordPress actual debe mantenerse operativa hasta que la nueva versión haya superado pruebas, tenga textos legales, formulario real, copias de seguridad, redirecciones 301 y dominio de preproducción verificado. El cambio de DNS es la última fase, no la primera.

