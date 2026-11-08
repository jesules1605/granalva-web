# Manual breve del panel de Granalva (`/admin`)

## Acceso

- **Dirección del panel:**
  - hoy, en preproducción: `https://granalva.netlify.app/admin`;
  - cuando se publique: `https://limpiezasgranalva.com/admin`.
- **Entrar:** escribe tu correo y tu contraseña. Nunca envíes la contraseña por chat ni por correo.
- **Cambiar tu contraseña:** arriba a la derecha, tu nombre → «Cuenta» → «Cambiar contraseña» → escribe la nueva dos veces → «Guardar».
- **Contraseña olvidada:**
  - en la pantalla de acceso, pulsa «¿Olvidaste tu contraseña?» y escribe tu correo;
  - llega un mensaje de «Web Granalva», enviado desde `info@limpiezasgranalva.com`, con un enlace válido durante una hora;
  - pulsa el enlace y escribe la contraseña nueva.
- **Crear un usuario** (solo el propietario):
  - Usuarios → «Crear nuevo»;
  - rellena nombre, correo, una contraseña provisional y el rol;
  - entrega la contraseña provisional en persona o por teléfono, y pide a esa persona que la cambie al entrar o que use «¿Olvidaste tu contraseña?».
- **Retirar el acceso:** Usuarios → la persona → desmarca «Activo» → «Guardar». Es mejor que borrar, porque conserva el historial.
- **Si el propietario pierde el acceso y no le llega el correo de recuperación:**
  - comprueba la carpeta de spam;
  - si sigue sin llegar, un técnico puede restablecer la cuenta desde el servidor sin ver tu contraseña. Para ello debe tener acceso a Netlify y a Neon, que están en tus cuentas.
- **Seguridad:**
  - tras 5 intentos fallidos la cuenta se bloquea 15 minutos;
  - la sesión caduca a las 8 horas;
  - el panel nunca aparece en Google;
  - un administrador o un editor no pueden cambiar su propio rol.
- **Correo de los avisos:** se envía con una «contraseña de aplicación» de Google llamada «Web Granalva». Si un día la borras en https://myaccount.google.com/apppasswords, crea otra y pégala en Netlify, en la variable `SMTP_PASS`. Tu contraseña normal del correo no interviene.

## Roles

| Rol | Puede |
|---|---|
| Propietario | Todo: usuarios, roles, borrar solicitudes y logotipos, ajustes |
| Administrador | Contenido, solicitudes (ver, notas, estados, CSV), redirecciones y ajustes; no gestiona usuarios |
| Editor | Páginas, servicios, blog, medios, equipo y reseñas; **no ve solicitudes** |

Usuarios nuevos: Usuarios → Crear. Solo el propietario asigna roles o desactiva cuentas.

## Solicitudes de presupuesto

Solicitudes → Solicitudes.

- **Buscar:** por referencia, empresa, contacto, teléfono o correo.
- **Filtrar:** por estado, servicio o fechas.
- **En cada solicitud:**
  - estado (nuevo → contactado → presupuesto enviado → ganado / perdido, o spam);
  - responsable y notas internas;
  - página de origen, UTM y consentimiento («Origen y consentimiento»).
- **Exportar:** botones «Exportar todas (CSV)» y «Exportar nuevas (CSV)». Se abren en Excel.
- **Borrar datos** (derecho de supresión): solo el propietario.

## Portada

Páginas → **Portada**:

- **Imagen principal:** escritorio (mín. 1920 px) y móvil (vertical). Recorte y punto focal: en el propio archivo, desde Medios.
- **Oscurecimiento:** 40–100 %. Comprueba en la vista previa que el texto se lee bien.
- **Zoom lento:** desactivado por defecto. Actívalo solo si en la vista previa se ve totalmente estable.
- **Textos:** titular (H1), subtítulo y los dos botones con sus enlaces.
- **Secciones:** añade filas para ordenar, ocultar o cambiar el titular de cada sección. Vacío = orden por defecto.
- **SEO:** title, description e imagen para redes. «No indexar» exige una segunda confirmación; nunca lo actives en producción.
- **Guardar:** «Guardar borrador» → «Vista previa» → «Publicar». También puedes programar la publicación con «Programar».

## Servicios (Sierra Nevada incluida)

Contenido → Servicios → el servicio:

- **Portada:** foto de escritorio, foto móvil, texto alternativo, oscurecimiento, etiqueta, frase editorial y texto del botón.
- **SEO:** title, description y resumen. Hay límites de longitud para no estropear el posicionamiento.
- **Preguntas frecuentes:** si añades al menos una, sustituyen a las predeterminadas.
- **Versiones:** pestaña «Versiones» → elegir una → «Restaurar».

## Páginas y secciones

Páginas → Páginas:

- **Crear página:** título (es el único H1), URL y secciones.
- **Tipos de sección:**
  - portada con imagen y texto;
  - imagen y texto, tarjetas y proceso;
  - preguntas frecuentes y llamada a la acción;
  - reseñas, equipo, empresas colaboradoras, sectores y servicios;
  - formulario y documentos PDF.
- **Ocultar** una sección: casilla «Ocultar esta sección». **Reordenar:** arrastrar. **Duplicar:** menú «⋯» de la sección.
- **Sustituir una página existente:** una página publicada con la misma URL la reemplaza. Ya hay **borradores preparados** de Sobre nosotros, Referencias, Contacto, Empresas, Particulares y las páginas legales.
- **Cambiar la URL de una página publicada:** se crea sola una redirección 301 desde la antigua.
- **Protecciones:**
  - no se puede tener dos H1;
  - no se puede repetir una URL ni usar una reservada;
  - la canonical solo puede apuntar al dominio;
  - «No indexar» pide confirmación.

## Medios

Contenido → Medios.

- **Al subir:**
  - texto alternativo obligatorio;
  - autoría y licencia («Fotografía propia de Granalva»);
  - «Uso previsto», para encontrar la foto después.
- **Recorte y punto focal:** al editar el archivo.
- **Formatos:** JPG, PNG, WebP, AVIF y PDF, hasta 15 MB.
- **Almacenamiento:** los archivos se guardan en Cloudflare R2 (cubo privado `granalva-medios`), que es persistente: no se pierden al redesplegar la web.

## Autoridad

- **Reseñas:** Contenido → Reseñas. Copia el texto literal, con su plataforma y fecha. No publiques reseñas propias ni de familiares (casilla «relación con Granalva»).
- **Empresas colaboradoras:** solo con el logotipo oficial y la autorización por escrito (casilla y fecha).
- **Años de experiencia y cifras:** Configuración → Ajustes del sitio. Solo se muestran si están marcados como verificados y tienen fuente.
- **Equipo:** fotos reales, con la casilla de autorización de la persona.

## Menú, marquesina, contacto y pie

Configuración → Ajustes del sitio (teléfono, correo, WhatsApp, marquesina, frase del pie) y Menú principal.

## Blog

Contenido → Blog: título, entradilla, imagen, contenido y servicio relacionado. Admite borradores, autoguardado, vista previa y programación. El blog no aparece en Google hasta que hay un artículo publicado.

## Redirecciones

SEO → Redirecciones: URL antigua → URL nueva (301).

- No permite redirigir una página real.
- No permite crear cadenas: si el destino ya redirige, avisa.
- No redirijas nunca todo a la portada.

## Copias de seguridad y restauración

**Base de datos (Neon).** Contiene los textos, las solicitudes, los usuarios y el historial.

- **Copia automática:** Neon permite volver a un punto de las últimas horas. El margen exacto según el plan aparece en Neon → proyecto `granalva` → «Backup & Restore».
- **Copia manual sin programas**, recomendada antes de cambios grandes y una vez al mes:
  1. Abre Neon → proyecto `granalva` → «Branches» → «Create branch».
  2. Ponle de nombre la fecha (por ejemplo, `copia-2026-12-01`), con origen `main` y la opción «Current point in time».
  3. Esa rama es una foto fija de toda la base de datos y no cambia aunque edites la web. El plan gratuito admite varias; borra las antiguas.
- **Restaurar:**
  - en «Backup & Restore», elige el momento y pulsa «Restore»;
  - o restaura desde una rama de copia;
  - Neon guarda automáticamente el estado anterior, así que la restauración también se puede deshacer.
- **Copia externa completa** (para un técnico): `pg_dump "$DATABASE_URL" > granalva-AAAA-MM-DD.sql`, y para restaurar, `psql`. La cadena está en Netlify, como variable secreta.

**Contenido.** Cada servicio, página, entrada y la portada guardan su historial: abre el documento → «Versiones» → elige una → «Restaurar esta versión».

**Fotos y documentos (Cloudflare R2).**

- Sobreviven a los redespliegues.
- Al **borrar** un medio en el panel, el archivo se elimina de R2. Si solo quieres dejar de usarlo, sustitúyelo en la sección correspondiente en lugar de borrarlo.
- **Guarda tú los originales** (en el ordenador o en Google Drive) de cada foto que subas.
- **Recuperar una foto concreta:** Cloudflare → R2 → `granalva-medios` → el archivo → «Download».
- **Restaurar una foto borrada:** súbela de nuevo desde el original en Medios y vuelve a asignarla.

**Código.** Está en GitHub (`jesules1605/granalva-web`), con todo su historial. Netlify permite volver a un despliegue anterior: Deploys → elige uno → «Publish deploy».
