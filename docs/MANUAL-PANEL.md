# Manual breve del panel de Granalva (`/admin`)

## Acceso

- **Primera vez:** abre `https://<web>/admin`. Como aún no hay usuarios, el panel pide crear el primero, que será el **propietario**. Usa `info@limpiezasgranalva.com` o tu correo personal y una contraseña larga.
- **Contraseña olvidada:** en la pantalla de acceso, «¿Olvidaste tu contraseña?». Recibirás un correo; requiere el SMTP configurado.
- **Seguridad:**
  - tras 5 intentos fallidos la cuenta se bloquea 15 minutos;
  - la sesión caduca a las 8 horas;
  - el panel nunca aparece en Google.

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
- **Almacenamiento:** los archivos se guardan en Vercel Blob, que es persistente.

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

## Copias de seguridad

- **Base de datos:** copias automáticas del proveedor (Neon). Restauración a un punto anterior desde su panel.
- **Contenido:** cada servicio, página y portada guarda su historial de versiones.
- **Medios:** Vercel Blob. Conviene descargar de vez en cuando las fotos originales.
