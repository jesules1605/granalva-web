# Analítica, conversiones y rendimiento comercial de Granalva

Sistema de medición de `https://limpiezasgranalva.com`. Todas las cuentas son **propiedad de Granalva** (cuenta `info@limpiezasgranalva.com`). Los colaboradores reciben, como mucho, acceso delegado que se puede retirar en cualquier momento.

- **Panel propio:** `https://limpiezasgranalva.com/admin/analitica` (solo propietario y administradores).
- **Código:**
  - `app/lib/analytics/` contiene el diccionario de eventos, la capa de datos y las consultas a las API;
  - `app/components/analytics/` contiene la escucha global;
  - `app/components/cookie-consent.tsx` gestiona el consentimiento y Cloudflare;
  - `cms/views/AnalyticsView.tsx` es el panel.
- **Prueba automática:** `tests/e2e/analytics.e2e.mjs`.

## 1. Qué mide cada herramienta (y por qué las cifras no coinciden)

| Herramienta | Mide | Consentimiento | Por qué difiere |
|---|---|---|---|
| **Cloudflare Web Analytics** | Visitas, páginas vistas, página, referente, país, dispositivo, navegador, sistema operativo, tiempos de carga, LCP, INP y CLS | No lo necesita: sin cookies ni identificadores | Cuenta casi todas las visitas reales, sin bots. No admite eventos personalizados |
| **Google Analytics 4** (con Tag Manager) | Usuarios nuevos y recurrentes, canales, campañas, eventos de clic y del formulario, embudo, dispositivos y zonas | Solo si el visitante acepta la analítica | Solo ve a quien acepta; los bloqueadores también lo frenan |
| **Microsoft Clarity** | Grabaciones anónimas, mapas de clics y de desplazamiento, clics de rabia, clics muertos, retrocesos rápidos y errores JavaScript | Solo si el visitante acepta la analítica | Muestra comportamiento, no cifras oficiales |
| **Search Console** | Consultas de Google, páginas, clics, impresiones, CTR, posición, país, dispositivo, indexación, sitemap, Core Web Vitals y errores de rastreo | No aplica (datos de Google) | Mide antes de la visita, en los resultados de búsqueda |
| **Panel `/admin`** (solicitudes) | Cada solicitud con su origen (entrada, página, referente y los 5 UTM), estado comercial, importe y motivo de pérdida | Funciona siempre | Es la cifra de negocio real y completa |

**Regla práctica:**
- volumen de tráfico → **Cloudflare**;
- comportamiento y canales → **GA4**;
- búsquedas → **Search Console**;
- solicitudes, clientes y facturación → **panel**.

## 2. Cuentas e identificadores

Rellena la tabla al crear cada cuenta. Los identificadores públicos van también en `/admin` → Analítica → Ajustes de analítica. **Las claves secretas nunca se guardan en GitHub:** van en Netlify como variables secretas.

| Herramienta | Propiedad o proyecto | Identificador | Dónde va | Cuenta propietaria |
|---|---|---|---|---|
| Cloudflare Web Analytics | `limpiezasgranalva.com` | Token del fragmento: `NEXT_PUBLIC_CF_BEACON_TOKEN`<br>Site tag: en los ajustes del panel | Netlify y panel | Cuenta de Cloudflare de Granalva (la misma de R2) |
| Google Analytics 4 | `Limpiezas Granalva – web` | ID de medición **`G-58GYBDJG6T`**<br>ID de propiedad (número) | Variable del contenedor GTM y panel | `info@limpiezasgranalva.com` |
| Google Tag Manager | Contenedor `limpiezasgranalva.com` (Web) | `GTM-…` → `NEXT_PUBLIC_GTM_ID` | Netlify | `info@limpiezasgranalva.com` |
| Search Console | Propiedad de dominio `limpiezasgranalva.com` (verificada automáticamente con Google Workspace) | `sc-domain:limpiezasgranalva.com` | Panel | `info@limpiezasgranalva.com` |
| Microsoft Clarity | `limpiezasgranalva.com` | ID del proyecto → `NEXT_PUBLIC_CLARITY_ID` | Netlify y panel | Cuenta Microsoft o Google de `info@` |
| Looker Studio | `Granalva · Cuadro de mando` | URL del informe | Panel | `info@limpiezasgranalva.com` |
| API de Google (lectura) | Proyecto de Google Cloud `granalva-analitica` con un cliente OAuth «Aplicación web» | `GOOGLE_OAUTH_CLIENT_ID`<br>`GOOGLE_OAUTH_CLIENT_SECRET` (secreta) | Netlify | `info@limpiezasgranalva.com` |
| API de Cloudflare (lectura) | Token «Account Analytics: Read» | `CF_ACCOUNT_ID`<br>`CF_API_TOKEN` (secreta) | Netlify | Cuenta de Cloudflare de Granalva |

**URI de redirección autorizada del cliente OAuth:** `https://limpiezasgranalva.com/api/analitica/google/callback`.

**Conexión con Google:**
- Se hace desde `/admin/analitica` → «Conectar con la cuenta de Granalva», con permisos **de solo lectura** de Analytics y Search Console.
- El token se guarda **cifrado** en la base de datos y ninguna API lo devuelve.
- «Desconectar Google» lo revoca.
- Sin archivos JSON de cuenta de servicio.

**Otras variables:**
- `CRON_SECRET` (ya existe) protege los informes programados.
- `NEXT_PUBLIC_ANALYTICS_EXTRA_HOSTS` solo se usa en pruebas: añade dominios donde se permite medir.

## 3. Consentimiento (RGPD, LSSI-CE y guía de la AEPD)

**Primera capa del banner:**
- tres botones con el mismo estilo: **Rechazar**, **Configurar** y **Aceptar**;
- categorías: técnicas (siempre activas) y analítica (Google Analytics y Microsoft Clarity);
- no hay categoría de marketing porque no se usa publicidad.

**Consent Mode v2, modo básico:**
- Tag Manager, GA4 y Clarity **no existen en la página** hasta aceptar;
- al cargar, `ad_storage`, `ad_user_data` y `ad_personalization` quedan siempre denegados.

**Rechazar o retirar:**
- no se carga nada;
- al retirar el consentimiento se borran las cookies `_ga*`, `_clck`, `_clsk`, `CLID` y `MUID`, y se recarga la página;
- se puede cambiar en cualquier momento con «Configurar cookies», en el pie y en la política de cookies.

**Prueba técnica:**
- cada decisión crea un registro en `/admin` → Analítica → Registros de consentimiento;
- el registro guarda un identificador aleatorio (el mismo de la cookie `granalva_consent`), la decisión, la versión del aviso, las herramientas mostradas, la página y la fecha;
- sin IP y sin datos personales;
- retención: 2 años.

**Cloudflare Web Analytics:** va aparte, porque no usa cookies ni almacenamiento local. Figura en la política de privacidad.

**Atribución interna** (página de entrada y UTM durante la sesión): se guarda en `sessionStorage` **solo con consentimiento**. Sin él, la solicitud registra únicamente la página y los UTM de la URL actual.

**Políticas actualizadas el 14 nov 2026:** `/politica-de-cookies` y `/politica-de-privacidad`, con proveedores reales: Netlify, Neon, Cloudflare R2, Turnstile y Web Analytics, Google Workspace, Google Analytics y Tag Manager, y Microsoft Clarity.

**Nunca se envían a ninguna plataforma de analítica:**
- nombre, apellidos, correo o teléfono;
- dirección o contenido del mensaje;
- empresa;
- referencia de la solicitud ni identificadores internos.

`sanitizeParams()` aplica una lista blanca de parámetros y descarta cualquier valor que parezca un correo o un teléfono. Los formularios llevan `data-clarity-mask="true"`.

## 4. Diccionario de eventos

**Fuente única:** `app/lib/analytics/events.ts`.

**Disparo:**
- Los eventos se envían a la capa de datos (`window.dataLayer`) solo con consentimiento y solo en el dominio definitivo.
- Una escucha global los clasifica por **atributos estables**, no por el texto del botón: `data-analytics-event`, `data-analytics-id`, `data-cta-location`, `data-service`, `data-audience` y `data-campaign`.
- En su defecto, los clasifica por el tipo de enlace: `tel:`, `wa.me`, `mailto:`, mapas, `/contacto` o `?servicio=`.
- Un mismo evento con los mismos parámetros en menos de 1 s se descarta.

| Evento | Cuándo | Tipo |
|---|---|---|
| `page_view` | Cada ruta, también en la navegación interna de Next.js (una sola vez) | Navegación |
| `service_view` · `business_service_view` · `private_service_view` | Página de servicio (empresa o particular) | Interés |
| `sierra_nevada_view` | `/servicios/lavanderia-sierra-nevada` | Interés |
| `blog_article_view` | Artículo del blog | Interés |
| `scroll_50` · `scroll_90` | Mitad y final de la página | Interés |
| `quote_cta_click` | Cualquier botón o enlace a presupuesto, con su `cta_location` | **Microconversión** |
| `order_cta_click` | «Hacer un pedido» de particulares | Interés |
| `phone_click` | Enlace `tel:` | **Conversión** |
| `whatsapp_click` | Enlace de WhatsApp | **Conversión** |
| `email_click` | Enlace `mailto:` | Contacto |
| `app_order_click` | Enlace a la aplicación de pedidos | **Conversión** |
| `map_click` | Enlace a mapas | Contacto |
| `quote_form_view` | El formulario entra en pantalla | Formulario |
| `quote_form_start` | Primera interacción con el formulario | **Microconversión** |
| `quote_form_step` | Se abren los «datos operativos» | Formulario |
| `quote_form_validation_error` | Faltan datos o no son válidos (navegador o servidor) | Formulario |
| `quote_form_submit` | Pulsación de enviar (aún no es una solicitud) | Formulario |
| `quote_form_success` | **El servidor confirma la solicitud guardada.** Una vez por referencia; los duplicados y el antispam no cuentan | **Conversión principal** |
| `quote_form_error` | Fallo técnico o de verificación al guardar | Formulario |
| `client_logo_click` | Clic en un logotipo de empresa colaboradora | Autoridad |
| `review_interaction` | Pausa o control de reseñas | Autoridad |
| `campaign_view` · `campaign_cta_click` | Campaña destacada vista o pulsada | Campaña |
| `sierra_nevada_quote_click` | Presupuesto o ruta de temporada de Sierra Nevada | Campaña |

**Parámetros permitidos (lista cerrada):**
- `page_path`, `page_type`, `service_slug` y `audience_type` (`empresa` o `particular`);
- `cta_location`, `form_type`, `form_step` y `campaign_name`;
- `device_category`, `language` y `conversion_type`;
- `event_id` (UUID aleatorio, para deduplicar);
- `traffic_type` (`internal` en navegadores de Granalva);
- `form_field_count`.

## 5. Conversiones

| Evento | GA4 | Significado |
|---|---|---|
| `quote_form_success` | **Evento clave** | Solicitud real guardada en el panel |
| `phone_click` | **Evento clave** | Intención de llamada (no garantiza que se llame) |
| `whatsapp_click` | **Evento clave** | Intención de WhatsApp |
| `app_order_click` | **Evento clave** | Acceso a la aplicación de pedidos |
| `quote_cta_click`, `quote_form_start` | Microconversiones (no marcar como clave) | Interés |

En GA4: Administrar → Eventos → marcar como evento clave los cuatro primeros. Aparecen en la lista tras su primer registro; también se pueden crear antes en «Eventos clave» → «Nuevo evento clave».

## 6. Embudo y estados comerciales

| Paso | Cómo se mide |
|---|---|
| 1. Visita a la web | GA4 |
| 2. Vista de servicio | GA4 |
| 3. Clic en «Solicitar presupuesto» | GA4 |
| 4. Visualización del formulario | GA4 |
| 5. Inicio del formulario | GA4 |
| 6. Envío | GA4 |
| 7. Confirmación correcta | GA4, o el panel si GA4 no está conectado |
| 8. Solicitud gestionada | Panel: estado Contactada |
| 9. Presupuesto enviado | Panel: estado Presupuesto enviado |
| 10. Cliente conseguido | Panel: estado Ganada |

**Estados en `/admin` → Solicitudes:** Nuevo · Contactado · Presupuesto enviado · Ganado · Perdido · Spam.

**Campos opcionales:**
- importe estimado (€ sin IVA);
- fecha de seguimiento;
- motivo de pérdida y su detalle;
- notas internas;
- responsable.

Las fechas de contacto, presupuesto y cierre se anotan solas al cambiar el estado. Así se sabe qué campañas generan **clientes y facturación**, no solo formularios.

## 7. Panel «Analítica y rendimiento» (`/admin/analitica`)

**Periodos:** 7, 30 y 90 días, cada uno comparado con el periodo anterior.

**Contenido:**
- **Resumen:** visitas y páginas vistas (Cloudflare), sesiones y usuarios (GA4), solicitudes, tasa de conversión, conversiones, clientes ganados.
- **Clics:** presupuesto, teléfono, WhatsApp, correo, aplicación, pedidos particulares, formularios correctos y fallidos.
- **Embudo** de 10 pasos y abandono del formulario.
- **Segmentos:** empresas, particulares y Sierra Nevada (solicitudes, ganadas y cierre); ganadas y perdidas con el motivo principal.
- **Origen de las solicitudes:** canales, campañas UTM, clientes ganados por origen, página de entrada, página del formulario y servicio.
- **Tráfico (GA4):**
  - canales, campañas y servicios más vistos;
  - páginas más vistas y páginas de entrada con conversiones;
  - dispositivos y zonas;
  - errores (404 y formulario).
- **Search Console:** clics, impresiones, CTR, posición media, consultas, páginas y dispositivos.
- **Cloudflare:** LCP, INP y CLS p75; páginas, referentes, países y dispositivos.
- **Generador de enlaces UTM.**
- **Enlaces** a GA4, Search Console, Clarity, Cloudflare, Tag Manager y Looker Studio; conexión y desconexión de Google.
- **Botones** de envío manual de informes.

**Datos:**
- Los datos de GA4, Search Console y Cloudflare **no se copian** en PostgreSQL: se consultan con las API oficiales y se guardan 15 minutos en memoria.
- PostgreSQL solo guarda lo comercial: solicitudes, estados, importes, consentimientos e incidencias técnicas.

## 8. Guía de enlaces UTM

Usa el **generador del panel**: limpia tildes, mayúsculas y espacios para que una campaña no aparezca duplicada.

| Parámetro | Obligatorio | Valores recomendados |
|---|---|---|
| `utm_source` | Sí | `email`, `whatsapp`, `instagram`, `facebook`, `linkedin`, `google_business`, `dossier`, `qr` |
| `utm_medium` | Sí | `outreach` (correo personal), `newsletter`, `social` (publicación), `print` (papel), `qr`, `referral` |
| `utm_campaign` | Sí | `tema_año`: `sierra_nevada_2026`, `apartamentos_2027`, `renting_hoteles_2026` |
| `utm_content` | No | La pieza o botón: `boton_dossier`, `firma_correo`, `story_1` |
| `utm_term` | No | Palabra clave, solo si aplica |

**Ejemplo:** `https://limpiezasgranalva.com/servicios/lavanderia-sierra-nevada?utm_source=email&utm_medium=outreach&utm_campaign=sierra_nevada_2026`

**Reglas:**
- siempre en minúsculas y con guion bajo;
- el mismo nombre de campaña en todos los canales de una misma acción;
- **nunca** pongas UTM en enlaces internos de la propia web, porque rompen la atribución;
- no incluyas datos personales en los UTM.

## 9. Search Console

**Propiedad:**
- Ya existe y está verificada la **propiedad de dominio** `limpiezasgranalva.com`, verificada automáticamente por Google Workspace sin tocar el DNS. No crees otra.
- El histórico del sitemap antiguo (`page-sitemap.xml`) se conserva. Esa URL redirige con 301 al sitemap nuevo.

**Sitemap:** `https://limpiezasgranalva.com/sitemap.xml`, enviado el 11 nov 2026.

**Vínculos:**
- **Con GA4:** Administrar → Vínculos de productos → Search Console → elegir la propiedad de dominio y el flujo web.
- **Con Looker Studio:** conector «Search Console», «Impresión del sitio» y «Impresión de URL».

## 10. Microsoft Clarity

**Al crear el proyecto** (en clarity.microsoft.com):
1. Settings → **Masking: Strict**: oculta todo el texto que se escribe y el contenido sensible.
2. Settings → **Setup → «Manual install»**: copia el ID del proyecto y **no** instales su código. Lo instala la web después del consentimiento.
3. Settings → **IP blocking:** añade la IP de la oficina de Granalva, si es fija.
4. Settings → **Cookies: On**. Necesario para unir páginas de una visita; la web solo lo carga con consentimiento.

**Cobertura:**
- Clarity muestra grabaciones, mapas de clics y de desplazamiento, rage clicks, dead clicks, quick backs y errores JavaScript.
- Los **embudos** se crean en Clarity → Funnels, por URL: servicio → `/contacto` → confirmación.

**Exclusiones:** el panel `/admin`, la API y las rutas de acceso **nunca** cargan Clarity, porque usan otro layout. Los formularios llevan `data-clarity-mask`.

## 11. Calidad de los datos

**Entornos:**
- Solo mide el dominio `limpiezasgranalva.com`.
- `localhost`, `granalva.netlify.app`, las previsualizaciones y `/admin` no envían nada.

**Tráfico interno:**
1. Abre una vez `https://limpiezasgranalva.com/?granalva_interno=1` en cada navegador de Granalva. Desde entonces sus eventos llevan `traffic_type=internal` (`=0` lo desmarca).
2. En GA4: Administrar → Flujos de datos → Configurar etiqueta → «Definir tráfico interno» (opcional, por IP).
3. En GA4: Administrar → **Filtros de datos** → «Internal Traffic».
   - Créalo en estado **«Probando»** y compruébalo en DebugView.
   - Después pásalo a **«Activo»**. Es irreversible para los datos ya filtrados.

**Vistas y eventos sin duplicados:**
- El contenedor de GTM desactiva el `page_view` automático. La vista la envía la web una sola vez por ruta.
- En GA4 → Flujo web → Medición mejorada, **desactiva «Cambios de página basados en eventos del historial del navegador»** y «Envíos de formularios», porque la web ya los mide con precisión.
- Los clics no se duplican: hay un único manejador global y se descarta lo repetido en menos de 1 s.
- La conversión no se duplica: hay un `event_id` aleatorio, se marca una vez por referencia y los duplicados del servidor no cuentan.

**Errores del formulario:** `quote_form_validation_error` (datos del usuario) y `quote_form_error` (servidor o antispam) están separados. Las incidencias del servidor también se guardan en `/admin` → Incidencias técnicas, sin datos personales.

## 12. Configuración en GA4 tras crear la propiedad

1. **Importa el contenedor:** Tag Manager → Administrar → Importar contenedor → `docs/gtm/granalva-gtm-contenedor.json` → espacio «Default» → **Combinar**.
2. La variable **«GA4 - ID de medición»** ya contiene `G-58GYBDJG6T`. Después, **Publicar**.
3. Para regenerar el contenedor tras cambiar el diccionario: `node scripts/gtm-container.mjs`.
4. En GA4 → Administrar → **Definiciones personalizadas** → Crear dimensiones (ámbito «Evento»):
   - `page_type`, `service_slug`, `audience_type`, `cta_location`;
   - `form_type`, `form_step`, `campaign_name`, `conversion_type`.
5. Marca los **eventos clave** (sección 5).
6. Retención de datos: Administrar → Recopilación y conservación de datos → **14 meses**.
7. Indicadores de Google (señales): **desactivados**, porque no se hace publicidad.
8. Vincula Search Console (sección 9).
9. **No vincules Google Ads** hasta que Granalva lo pida expresamente.

## 13. Looker Studio (informe privado de Granalva)

**Crear el informe:**
1. Entra con `info@` en lookerstudio.google.com → **Informe en blanco**.
2. Añade las fuentes de datos:
   - **Google Analytics**: la propiedad de Granalva;
   - **Search Console**: «Impresión del sitio» e «Impresión de URL»;
   - **Hojas de cálculo de Google** con la exportación CSV de solicitudes del panel, para el embudo comercial y los clientes ganados. Opcional: la hoja se actualiza a mano al exportar.

**Páginas:**

| Página | Contenido |
|---|---|
| 1. Resumen ejecutivo | Tarjetas de visitas (sesiones), usuarios, solicitudes (`quote_form_success`), conversiones (eventos clave), tasa de conversión (eventos clave / sesiones), canal principal y servicio principal (tablas top 1), cada una con «Comparación: periodo anterior» |
| 2. Adquisición | Canal, fuente/medio y campaña: sesiones y eventos clave |
| 3. Conversiones | Recuento por evento clave; embudo con un gráfico de barras de `service_view` → `quote_cta_click` → `quote_form_view` → `quote_form_start` → `quote_form_submit` → `quote_form_success` |
| 4. Servicios y páginas | `service_slug` con vistas y conversiones; páginas de entrada |
| 5. SEO | Search Console: consultas, páginas, clics, impresiones, CTR, posición, país y dispositivo |
| 6. Sierra Nevada | Filtro `service_slug = lavanderia-sierra-nevada`: vistas, clics y solicitudes |
| 7. Empresas frente a particulares | `audience_type` en vistas y conversiones |
| 8. Rendimiento técnico | Eventos `page_view` con `page_type = not_found`, `quote_form_error` y enlace a Cloudflare y PageSpeed para Core Web Vitals |

**Filtros (controles en todas las páginas):**
- periodo;
- `service_slug` (servicio);
- canal (grupo de canales predeterminado de la sesión);
- campaña;
- dispositivo;
- `audience_type` (tipo de cliente);
- región (ubicación general).

**Compartir:** botón «Compartir» → solo cuentas concretas de Granalva, como «Lector». **Nunca** «Cualquier persona con el enlace».

Copia la URL del informe en el panel → Ajustes de analítica → Looker Studio.

## 14. Informes y alertas

**Envío:** la función programada `netlify/functions/analytics-reports.mts` se ejecuta a diario a las 08:20 y llama a `/api/analitica/informes` con `CRON_SECRET`. Los correos salen por el SMTP de Google Workspace.

| Envío | Cuándo | Contenido |
|---|---|---|
| Resumen semanal | Lunes | Solicitudes (empresa, particular, Sierra Nevada), estados, canal y servicio principales, visitas y conversión, clics GA4, Search Console |
| Informe mensual | Día 1 | Lo mismo, a 30 días |
| Sin solicitudes | Diario | Si no llega ninguna solicitud en N días (por defecto 10) |
| Errores del formulario | Diario | ≥ 3 errores de guardado o de correo en 24 h |
| Caída orgánica | Diario | Clics de Google −40 % frente a la semana anterior (con al menos 20 clics) |
| Aumento de 404 | Diario | 404 de 7 días ≥ el doble de la media semanal |
| Core Web Vitals | Diario | LCP > 2,5 s, INP > 200 ms o CLS > 0,1 (p75, al menos 50 mediciones) |

**Reglas:**
- Destinatarios, activación y umbrales: `/admin` → Analítica → Ajustes de analítica.
- Solo se envía a las direcciones configuradas allí; nunca a terceros.
- La misma alerta no se repite antes de 7 días.
- Los botones del panel permiten un envío manual de prueba.

## 15. Accesos: añadir, retirar y exportar

| Herramienta | Añadir usuario | Retirar acceso | Exportar datos |
|---|---|---|---|
| Panel `/admin` | Usuarios → Crear (solo el propietario) | Desmarcar «Activo» | Solicitudes → «Exportar todas (CSV)» |
| GA4 | Administrar → Gestión de acceso a la propiedad → «+» → rol **Lector** o **Analista** | Misma pantalla → quitar | Cada informe → Compartir → Descargar archivo (CSV o PDF); o Looker Studio |
| Tag Manager | Administrar → Gestión de usuarios → «+» → «Leer» | Quitar | Administrar → Exportar contenedor (JSON) |
| Search Console | Ajustes → Usuarios y permisos → Añadir → **Restringido** | Quitar | Rendimiento → Exportar (CSV o Excel; 16 meses de histórico) |
| Clarity | Settings → Team → Add member → **Member** | Remove | Dashboard → Export; grabaciones solo en Clarity (30 días) |
| Cloudflare | Manage Account → Members → Invite → rol «Analytics» | Revoke | Web Analytics → datos agregados por GraphQL (panel `/admin`) |
| Looker Studio | Compartir → añadir correo → Lector | Quitar | Archivo → Descargar (PDF) |
| Neon (base de datos) | Organization → Members | Remove | Copia con `pg_dump` (`docs/MANUAL-PANEL.md`) |

**Al terminar una colaboración:**
1. Quita el usuario en cada herramienta.
2. Revisa «Gestión de acceso».
3. Si tuvo acceso a Netlify, cambia `CRON_SECRET`.

## 16. Sustituir un proveedor en el futuro

**Medición:**
- El diccionario de eventos y la capa de datos no dependen de GA4. Para cambiar de herramienta (por ejemplo Matomo o Plausible), se crea una etiqueta en Tag Manager que lea los mismos eventos, o se cambia `track()` en `app/lib/analytics/client.ts`.
- **Clarity** se sustituye cambiando el fragmento en `cookie-consent.tsx`. Actualiza la política de cookies.
- **Cloudflare Web Analytics** se sustituye en `CloudflareBeacon`.

**Panel:** cada fuente está aislada en una función de `app/lib/analytics/server.ts` (`ga4Stats`, `searchConsoleStats`, `cloudflareStats`). Si una falla o se retira, el resto del panel sigue funcionando.

**Solicitudes:** siempre en PostgreSQL. Son de Granalva y se exportan en CSV.

## 17. Pruebas realizadas

**Automática:** `tests/e2e/analytics.e2e.mjs`, contra una compilación con identificadores de prueba, el 14 nov 2026.

**Consentimiento:**
- sin elección no se carga ni se envía nada;
- con rechazo, tampoco;
- primera capa con los 3 botones del mismo estilo;
- tras aceptar se carga Tag Manager y se registra una única vista;
- retirar el consentimiento recarga sin Tag Manager ni Clarity y borra las cookies;
- `/admin` no carga Tag Manager ni Clarity aunque se haya aceptado;
- formularios enmascarados;
- cookie de consentimiento con versión e identificador.

**Navegación y clics:**
- la navegación interna de Next.js registra cada ruta una vez, sin duplicados por hidratación;
- el botón superior genera un solo `quote_cta_click` con `cta_location=header`;
- el teléfono genera un solo `phone_click` con `conversion_type=call`.

**Formulario:**
- `quote_form_view`, `quote_form_start`, `quote_form_step` y `quote_form_validation_error`;
- un error del servidor genera `quote_form_error` y **no** genera conversión;
- una solicitud correcta genera **exactamente una** `quote_form_success` con `event_id`;
- un envío repetido (duplicado) no cuenta como conversión nueva.

**Datos personales y atribución:**
- ningún nombre, correo, teléfono, empresa ni mensaje en la capa de datos ni en las peticiones a terceros;
- solo parámetros de la lista blanca;
- los 5 UTM y la página de entrada se conservan hasta la solicitud, y queda registrado el consentimiento de analítica;
- sin errores de consola.

**Pendiente de verificar en producción**, cuando existan las cuentas:
- Tag Assistant y GA4 DebugView;
- datos reales en Looker Studio;
- grabaciones de Clarity sin campos visibles;
- Lighthouse con las herramientas activas.
