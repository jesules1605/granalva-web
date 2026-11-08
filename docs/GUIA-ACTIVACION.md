# Guía de activación de servicios (paso a paso)

**Ruta elegida: coste inicial cero y uso comercial.**

- Repositorio privado en GitHub.
- **Netlify Free** para la web y el panel.
- **Neon Free** para PostgreSQL.
- **Cloudflare R2** para fotos y documentos.
- El correo actual de `info@limpiezasgranalva.com`.

No se contrata nada de pago sin tu autorización. La preproducción de Vercel (`granalva-preproduccion.vercel.app`) sigue disponible para revisar el diseño mientras tanto.

**Verificación técnica de Netlify:**

- Next.js 16 + Payload compilan sin errores con su adaptador oficial (v5.16.6).
- La función del servidor ocupa 81 MB, por debajo del límite de 250 MB.
- La publicación programada usa una función diaria (`netlify/functions/payload-jobs.mts`).
- Queda por confirmar en el primer despliegue real la función perimetral de redirecciones (`proxy.ts`). Netlify la empaqueta con Deno, que no se puede descargar desde este entorno de trabajo.
- **Alternativa si fallara:** mover las redirecciones a `netlify.toml` (estáticas) o pasar a Vercel Pro, con tu autorización.

Regla general: **ninguna contraseña ni clave se escribe en el chat**. Se pegan en el panel del servicio (Netlify → Site configuration → Environment variables) o mediante el formulario seguro de credenciales de esta sesión.

## Paso A. Repositorio privado en GitHub

1. **Qué abrir:** https://github.com/new (tu cuenta personal).
2. **Qué seleccionar:** nombre `granalva-web`, **Private**, sin README.
3. **Variable:** ninguna.
4. **Dónde:** dime el nombre `usuario/granalva-web` y conecta GitHub a esta sesión cuando el sistema te lo pida. Yo subiré la rama `feat/nextjs-payload` con su historial y sin secretos.
5. **Comprobación:** verás el código en GitHub; `.env*` no se sube.
6. **Coste:** 0 €.
7. **Alternativa:** GitLab o Bitbucket privados (Netlify también los admite).

## Paso B. Netlify (alojamiento)

1. **Qué abrir:** https://app.netlify.com/signup → «Sign up with GitHub» → plan **Free**.
2. **Qué seleccionar:**
   - «Add new project» → «Import an existing project» → GitHub → `granalva-web`;
   - rama `main` (producción).
3. **Variables** (en Site configuration → Environment variables):
   - `NEXT_PUBLIC_SITE_URL=https://limpiezasgranalva.com`;
   - `PAYLOAD_SECRET` y `CRON_SECRET` (las genero yo con el formulario seguro);
   - `NEXT_PUBLIC_NOINDEX=true` **solo** en «Deploy Previews» y «Branch deploys»;
   - más las de los pasos C, D y E.
4. **Dónde:** en Netlify. Para que yo configure el resto, crea un token en User settings → Applications → «Personal access tokens» y guárdalo con el formulario seguro que te mostraré (host `api.netlify.com`).
5. **Comprobación:** despliegue de prueba en `*.netlify.app`. Comprobaré redirecciones, `noindex` y que el panel carga.
6. **Coste:** 0 € en el plan Free (límites mensuales de ancho de banda y minutos de compilación suficientes para una web corporativa).
7. **Alternativa:** Vercel Pro (unos 20 $/mes) o un Hostinger con Node.js si ya lo tienes contratado.

## Paso C. Neon (PostgreSQL)

1. **Qué abrir:** https://console.neon.tech → registrarse (Free).
2. **Qué seleccionar:**
   - «Create project» → nombre `granalva` → región **AWS Europe (Frankfurt)**;
   - después, Branches → «Create branch» `preproduccion`.
3. **Variables:** `DATABASE_URL`. Usa la cadena **pooled** (host con `-pooler`, `sslmode=require`), una por rama:
   - `main` para producción;
   - `preproduccion` para Deploy Previews.
4. **Dónde:** en Netlify → Environment variables → `DATABASE_URL` con valores distintos por contexto (Production / Deploy Previews).
5. **Comprobación:**
   - el build aplica las migraciones (`scripts/vercel-build.mjs`);
   - `/admin` mostrará «Crear primer usuario»;
   - ejecutaré la carga inicial y las pruebas del panel.
6. **Coste:** 0 € (plan Free: 0,5 GB y restauración a un punto reciente). La copia diaria adicional se documenta en `docs/MANUAL-PANEL.md`.
7. **Alternativa:** Supabase Free.

## Paso D. Cloudflare R2 (fotos y documentos)

1. **Qué abrir:** https://dash.cloudflare.com → registrarse → R2.
2. **Qué seleccionar:**
   - «Create bucket» `granalva-medios` (y `granalva-medios-pre` para preproducción);
   - después, «Manage R2 API Tokens» → «Create API token» → permiso **Object Read & Write** limitado a esos buckets.
3. **Variables:** `S3_BUCKET`, `S3_ENDPOINT` (`https://<account-id>.r2.cloudflarestorage.com`), `S3_REGION=auto`, `S3_ACCESS_KEY_ID` y `S3_SECRET_ACCESS_KEY`.
4. **Dónde:** en Netlify → Environment variables, con un bucket distinto por contexto.
5. **Comprobación:** subiré, sustituiré y restauraré una foto en `/admin` y comprobaré que sobrevive a un redespliegue.
6. **Coste:** 0 € hasta 10 GB y sin coste de descarga. Una web así usa menos de 1 GB.
7. **Alternativa:** Vercel Blob (de pago fuera de Hobby) o Amazon S3.

## Paso E. Correo (SMTP del buzón actual)

1. **Qué abrir:** el panel del proveedor del buzón `info@limpiezasgranalva.com` → configuración de cliente de correo.
2. **Qué anotar:** servidor SMTP, puerto (465 o 587) y usuario. Si el proveedor lo permite, crea una contraseña de aplicación.
3. **Variables:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM` y `CONTACT_TO_EMAIL`.
4. **Dónde:** en Netlify → Environment variables, con `SMTP_PASS` marcada como secreta.
5. **Comprobación:**
   - solicitud de prueba con «Aviso por correo: Enviado» y recepción en tu buzón;
   - «¿Olvidaste tu contraseña?».
6. **Coste:** 0 €.
7. **Alternativa:** Brevo Free. Requiere **añadir** registros DNS nuevos, sin tocar MX, SPF, DKIM ni DMARC.

---

Los pasos siguientes (Search Console, copia de WordPress, zona DNS, fotografías y autorización final) no cambian:

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
