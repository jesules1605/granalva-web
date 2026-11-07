# Plan del portal de administración de Granalva

## Objetivo

Crear un panel propio en `/admin`, protegido por autenticación, desde el que Granalva pueda mantener la web sin depender de Claude ni modificar código. El CMS debe ser la fuente de verdad del contenido, mientras que el diseño continúa controlado por componentes para evitar que una edición accidental rompa la identidad visual.

## Arquitectura objetivo

- Frontend y backend: Next.js App Router.
- CMS: Payload CMS integrado en el mismo proyecto.
- Base de datos: PostgreSQL gestionado.
- Medios: almacenamiento de objetos persistente; nunca el disco efímero de la aplicación.
- Despliegue recomendado para la primera versión: Vercel, por simplicidad operativa, con una base PostgreSQL gestionada y Vercel Blob o Cloudflare R2 para medios.
- Correo transaccional: proveedor configurable por variables de entorno.
- Antispam: honeypot, límite de frecuencia y Cloudflare Turnstile o equivalente.

La implementación debe ser portable. Los secretos solo existen como variables de entorno; nunca se añaden al repositorio.

## Roles y permisos

| Rol | Permisos |
|---|---|
| Propietario | Acceso total, usuarios, configuración, publicación y exportación. |
| Administrador | Gestiona todo el contenido y los formularios, sin cambiar credenciales críticas. |
| Editor | Crea y edita contenido y medios; publica solo si se le autoriza. |

Requisitos mínimos: contraseñas seguras, cookies seguras, recuperación de contraseña, bloqueo por intentos, sesiones revocables y registro de `createdBy`/`updatedBy`. Solo los roles autorizados acceden a solicitudes de contacto.

## Modelo de contenido

### Colecciones

#### `users`

- nombre, correo y rol;
- autenticación habilitada;
- estado activo/inactivo;
- último acceso cuando sea viable.

#### `media`

- archivo original;
- texto alternativo obligatorio para imágenes de contenido;
- título, pie, crédito y fuente;
- punto focal y variantes optimizadas;
- tipo de recurso y etiquetas;
- límites de tamaño y MIME permitidos.

Los archivos públicos deben almacenarse de forma permanente. Generar formatos y tamaños adecuados sin destruir el original.

#### `services`

- título, slug, estado y orden;
- audiencia: empresa, alojamiento, particular o mixta;
- entradilla, hero, contenido estructurado y proceso;
- beneficios, sectores, preguntas frecuentes y servicios relacionados;
- llamadas a la acción;
- SEO individual: título, descripción, imagen social, canonical opcional e indexación;
- datos estructurados derivados automáticamente;
- borradores, versiones, vista previa y publicación programada.

Migrar aquí las nueve páginas definidas en `app/lib/services.ts` conservando exactamente sus slugs iniciales.

#### `sectors`

- nombre, slug, descripción y orden;
- icono o logotipo de Granalva, no símbolos inventados;
- servicios relacionados;
- publicación opcional como landing futura solo si tiene contenido sustancial.

#### `team`

- nombre, cargo, biografía breve, fotografía y orden;
- visibilidad pública;
- no publicar iniciales como sustituto definitivo de fotografías.

#### `clients`

- nombre, logotipo oficial, URL y sector;
- texto alternativo;
- autorización de publicación: sí/no, fecha y nota interna;
- orden y estado público.

El frontend solo muestra clientes con autorización confirmada. El carrusel debe pausar al pasar el cursor y respetar `prefers-reduced-motion`.

#### `reviews`

- autor, texto, puntuación, fecha, servicio y fuente;
- URL de origen y estado de verificación;
- permiso de publicación;
- orden y visibilidad.

No permitir que una reseña sin fuente/permiso se publique por defecto.

#### `case-studies`

- cliente o descripción anonimizada autorizada;
- necesidad, solución, alcance y resultados demostrables;
- imágenes, cita y servicios relacionados;
- SEO completo.

#### `posts`

- título, slug, extracto, contenido, autor, categoría, portada y fecha;
- SEO, imagen social y FAQ opcional;
- borradores, versiones y publicación programada.

El blog debe responder dudas reales y apoyar las páginas comerciales; no crear artículos repetitivos destinados únicamente a palabras clave.

#### `legal-pages`

- tipo: aviso legal, privacidad, cookies u otros;
- título, slug, contenido, versión y fecha de vigencia;
- noindex configurable cuando corresponda.

#### `redirects`

- ruta de origen, destino y código, normalmente 301;
- validación de bucles y duplicados;
- importación del mapa de URLs de WordPress.

#### `contact-submissions`

- fecha, tipo de cliente, servicio, nombre, empresa, teléfono, correo, mensaje;
- consentimiento y versión del texto legal aceptado;
- UTM/referrer cuando exista y sea legal;
- estado: nueva, en gestión, respondida, archivada o spam;
- notas internas y responsable;
- exportación CSV restringida.

Los datos personales no deben aparecer en logs públicos ni analítica. Definir política de retención y borrado.

### Globals

#### `site-settings`

- nombre, descriptor, teléfono, correo, WhatsApp y dirección;
- razón social y datos fiscales;
- áreas reales de servicio;
- perfiles sociales, Google Business y URL de pedidos;
- SEO general, imagen social y verificaciones de buscadores;
- integraciones de analítica y consentimiento.

#### `navigation`

- cinta superior, menú principal, CTA y pie;
- enlaces internos validados;
- menú móvil incluido.

#### `homepage`

- hero, CTA, vídeo/fallback y textos;
- franja de experiencia y autoridad;
- bloques de empresas y particulares;
- selector de colada;
- proceso de moto y etapas;
- sectores atendidos;
- logotipos de clientes;
- equipo, reseñas, FAQ y bloque de contacto.

Limitar los campos a contenido; no exponer controles libres de CSS que permitan romper el diseño.

## SEO editable y validaciones (obligatorio)

Los campos y las reglas están definidos en `docs/seo-strategy.md`, en la sección «Requisitos SEO del CMS». El modelo de `services` debe reproducir exactamente el tipo `ServicePage` de `app/lib/services.ts`:

- `h1`, `metaTitle`, `metaDescription`, `intent`, `primaryKeyword` y `secondaryKeywords`;
- `introTitle`, `needs`, `coverage`, `related` (slug + texto de anclaje), `ctaTitle`, `ctaText` y `updatedAt`.

Los datos NAP de `app/lib/site.ts` pasan a `site-settings`. Las redirecciones de `app/lib/redirects.ts` se importan a `redirects`, y `proxy.ts` las aplicará leyendo esa colección. Las pruebas de `tests/rendered-html.test.mjs` deben seguir pasando cuando el contenido proceda de Payload.

## Formulario de contacto

Al enviar:

1. Validar en cliente y servidor.
2. Comprobar antispam y rate limit.
3. Registrar la solicitud en PostgreSQL.
4. Enviar aviso a Granalva y confirmación al usuario, sin incluir datos innecesarios.
5. Mostrar un identificador de recepción y un estado accesible.
6. Si falla el correo pero el registro existe, no perder la solicitud y marcar el reintento.

Mantener `mailto:` solo como fallback visible si la infraestructura está temporalmente caída.

## Flujo editorial

- Borrador → revisión → programado/publicado.
- Vista previa autenticada del contenido no publicado.
- Historial de versiones y restauración.
- Revalidación automática del frontend al publicar.
- Slugs bloqueados o redirección automática cuando se cambien.
- Previsualización social y validación de SEO antes de publicar.

## Copias de seguridad

- PostgreSQL: copia automática diaria y retención definida.
- Medios: versionado o copia en segundo almacenamiento.
- Código: repositorio privado de GitHub con rama principal protegida.
- Exportaciones periódicas de contenido y redirecciones.
- Probar la restauración antes del lanzamiento.

## Definition of Done del CMS

- `/admin` requiere acceso y funciona en escritorio y móvil.
- Un editor puede cambiar un texto, una foto y una página de servicio y ver el resultado publicado sin ejecutar código.
- Un editor puede crear un artículo y programarlo.
- Un formulario real queda registrado y notifica por correo.
- Los medios sobreviven a nuevos despliegues.
- Roles y permisos impiden accesos indebidos.
- Hay migraciones reproducibles y una copia de seguridad restaurable.
- El sitio público mantiene el diseño y las rutas SEO existentes.

## Documentación oficial de referencia

- Payload en una aplicación Next.js: `https://payloadcms.com/docs/getting-started/installation`
- Panel de administración: `https://payloadcms.com/docs/admin/overview`
- PostgreSQL: `https://payloadcms.com/docs/database/postgres`
- Despliegue y almacenamiento persistente: `https://payloadcms.com/docs/production/deployment`
- Subidas y biblioteca multimedia: `https://payloadcms.com/docs/upload/overview`

