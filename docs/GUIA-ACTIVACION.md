# Guía de activación de servicios (paso a paso)

Regla general: **ninguna contraseña ni clave se escribe en el chat**. Las claves se pegan directamente en Vercel (Settings → Environment Variables) o se conectan mediante integraciones.

**Proyectos de Vercel:**

- `granalva-preproduccion`: ya existe, en noindex.
- `granalva`: se creará para producción, con su propia base de datos, almacenamiento y variables.

---

## Paso 1. Plan de Vercel

1. **Qué abrir:** https://vercel.com → equipo **JESUS** → Settings → Billing.
2. **Qué seleccionar:** «Upgrade to Pro».
3. **Variable:** ninguna.
4. **Dónde:** no aplica.
5. **Comprobación:** consultaré el plan del equipo con el token que ya tengo.
6. **Coste:** unos 20 $/mes por miembro (precio de Vercel, confírmalo en su web). El plan Hobby actual solo admite uso personal y no comercial según las condiciones de Vercel.
7. **Alternativa:** otro alojamiento compatible con Next.js (Netlify, Railway o un VPS). Requiere rehacer la configuración de despliegue.

## Paso 2. Base de datos PostgreSQL (Neon)

1. **Qué abrir:** Vercel → proyecto `granalva-preproduccion` → pestaña **Storage** → «Create Database» → **Neon** (Serverless Postgres).
2. **Qué seleccionar:**
   - región **Frankfurt (eu-central-1)**;
   - plan Free para preproducción;
   - nombre `granalva-preproduccion`;
   - «Connect Project» → `granalva-preproduccion`, entornos *Production* y *Preview*.
3. **Variable:** `DATABASE_URL`. La integración la crea sola: conexión con *pooling* (host `-pooler`) y `sslmode=require`, adecuada para Vercel.
4. **Dónde:** no hay que copiar nada; la integración la añade al proyecto.
5. **Comprobación:**
   - redesplegaré;
   - el build aplicará las migraciones (`scripts/vercel-build.mjs`);
   - `/api/users/init` responderá y `/admin` mostrará «Crear primer usuario».
6. **Coste:** Free (0,5 GB y copia de restauración de corto plazo). Para producción se recomienda el plan de pago de Neon (unos 19 $/mes) por su historial de restauración más amplio. Confirma los precios en neon.tech.
7. **Alternativas:** Supabase o Vercel Postgres de otros proveedores del Marketplace.

**Producción:** se repite el mismo paso con el proyecto `granalva` y otra base de datos llamada `granalva-produccion`. Nunca se comparten datos ni se usa la base local.

## Paso 3. Almacenamiento de fotos y documentos (Vercel Blob)

1. **Qué abrir:** Vercel → proyecto `granalva-preproduccion` → **Storage** → «Create» → **Blob**.
2. **Qué seleccionar:** nombre `granalva-medios-preproduccion` → «Connect» al proyecto.
3. **Variable:** `BLOB_READ_WRITE_TOKEN`, creada automáticamente.
4. **Dónde:** no hay que copiar nada.
5. **Comprobación:** subiré una imagen de prueba en `/admin` y comprobaré que se sirve desde `*.public.blob.vercel-storage.com` y que sobrevive a un redespliegue.
6. **Coste:** el plan incluye una cuota mensual; el exceso se cobra por GB, céntimos en este volumen.
7. **Alternativa:** Cloudflare R2 o Amazon S3, con el adaptador S3 de Payload.

## Paso 4. Correo (aviso de solicitudes y recuperación de contraseña)

1. **Qué abrir:** el panel del proveedor donde está el buzón `info@limpiezasgranalva.com` (el mismo hosting o el servicio de correo actual). Busca «Configuración del cliente de correo / SMTP».
2. **Qué anotar:**
   - servidor SMTP;
   - puerto (465 con SSL o 587 con STARTTLS);
   - usuario: normalmente `info@limpiezasgranalva.com`;
   - la contraseña del buzón o, mejor, una contraseña de aplicación.
3. **Variables:**
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`;
   - `EMAIL_FROM=info@limpiezasgranalva.com`;
   - `CONTACT_TO_EMAIL=info@limpiezasgranalva.com`.
4. **Dónde:**
   - Vercel → proyecto → Settings → Environment Variables → «Add»;
   - marca `SMTP_PASS` como **Sensitive**;
   - entornos Production y Preview.
5. **Comprobación:**
   - enviaré una solicitud de prueba: deberá quedar con «Aviso por correo: Enviado» y tú la recibirás;
   - probaré «¿Olvidaste tu contraseña?».
6. **Coste:** 0 € con el buzón actual.
7. **Alternativa:** Resend o Brevo. Requieren **añadir** registros DNS de verificación, sin modificar MX, SPF, DKIM ni DMARC existentes; necesitarían tu autorización.

**No se modifica ningún registro de correo** (MX, SPF, DKIM, DMARC).

## Paso 5. Search Console (obligatorio antes de publicar)

No puedo aceptar invitaciones de Google: no tengo cuenta propia. La vía segura es que exportes los datos y los subas aquí.

1. **Qué abrir:** https://search.google.com/search-console → propiedad de `limpiezasgranalva.com`. Si la creó Site Kit de WordPress, será de tipo «Prefijo de URL» `https://limpiezasgranalva.com/`.
2. **Qué exportar:**
   - **Rendimiento:** «Fecha: últimos 16 meses» → «Exportar» → CSV. Incluye Consultas, Páginas, Países, Dispositivos y Fechas, con clics, impresiones, CTR y posición.
   - **Indexación → Páginas:** «Exportar» (indexadas y no indexadas, con motivos).
   - **Enlaces:** «Exportar enlaces externos» (más enlazadas y sitios que enlazan).
   - **Sitemaps:** captura de pantalla.
   - **Experiencia → Core Web Vitals:** captura de pantalla.
   - **Inspección de URL** de `https://limpiezasgranalva.com/`: captura de la «URL canónica seleccionada por Google».
3. **Variable** (después de publicar): `GOOGLE_SITE_VERIFICATION`. Es el código de la etiqueta HTML de verificación y no requiere DNS.
4. **Dónde:** sube los CSV y capturas aquí, en un .zip. El código de verificación va en Vercel → Environment Variables.
5. **Comprobación:**
   - completaré `docs/mapa-migracion.csv` con clics, impresiones, posición y enlaces;
   - cualquier URL con impresiones que no esté en el mapa recibirá su redirección 301.
6. **Coste:** 0 €.
7. **Alternativa:** añadir como usuario un correo de una cuenta de servicio de Google Cloud. Es más complejo y no aporta más que la exportación.

**Tipo de propiedad:**

- Para la migración basta la existente (el dominio no cambia).
- Más adelante se recomienda una propiedad de **dominio**, que se verifica con un registro TXT **nuevo**: no modifica nada del correo y necesita tu autorización.

## Paso 6. Copia de WordPress

1. **Qué abrir:**
   - el panel del hosting de WordPress → Copias de seguridad → «Descargar copia completa» (archivos y base de datos);
   - además, en WordPress → Herramientas → **Exportar** → «Todo el contenido».
2. **Qué hacer con cada copia:**
   - guarda tú la copia completa;
   - sube aquí solo el **XML** de la exportación, que no contiene contraseñas.
3. **Variable:** ninguna.
4. **Dónde:** en el chat (archivo XML).
5. **Comprobación:** verificaré entradas, páginas, adjuntos y URLs no listadas en el sitemap.
6. **Coste:** 0 €.
7. **Alternativa:** plugin UpdraftPlus (copia completa descargable).

## Paso 7. Copia de la zona DNS

1. **Qué abrir:** el panel donde se gestiona el dominio (registrador o hosting) → DNS.
2. **Qué hacer:**
   - «Exportar zona» o, si no existe, captura de **todos** los registros (A, AAAA, CNAME, MX, TXT, SRV, CAA);
   - bajar el **TTL** de los registros `@` (A) y `www` (CNAME o A) a **300** segundos, sin cambiar sus valores, 24 h antes de publicar.
3. **Variable:** ninguna.
4. **Dónde:** sube aquí el archivo o las capturas.
5. **Comprobación:** confirmaré qué registros de correo existen para garantizar que no se tocan.
6. **Coste:** 0 €.
7. **Alternativa:** delegar el dominio en Vercel DNS. **No recomendado**, porque obligaría a recrear los registros de correo.

## Paso 8. Fotografías reales

Se suben directamente en `/admin` → Medios. Con «Uso previsto» y el texto alternativo se asignan sin tocar código (véase `docs/MANUAL-PANEL.md`). Hacen falta:

- foto principal;
- Sierra Nevada;
- apartamentos;
- lavandería;
- empresas;
- renting;
- equipo, con autorización.

## Paso 9. Autorización final

Con todo verificado en preproducción te preguntaré: «¿Autorizas la publicación en limpiezasgranalva.com?». No cambiaré el DNS hasta que respondas exactamente **AUTORIZO PUBLICACIÓN**. Después:

1. Añadiré el dominio y `www` al proyecto de producción. `www` irá configurado como redirección 301 de dominio, para que `http://www` llegue en un solo salto.
2. Te indicaré los dos valores DNS exactos que muestra Vercel (A de `@` y CNAME de `www`).
3. Comprobaré HTTPS, redirecciones, `robots.txt`, `sitemap.xml`, formulario, panel y correo.
4. Enviaré el sitemap en Search Console.
5. Si falla algo crítico, se vuelve a los valores DNS anteriores; WordPress sigue intacto.
