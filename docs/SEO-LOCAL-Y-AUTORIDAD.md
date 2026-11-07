# SEO local, Google Business Profile y autoridad — acciones fuera de la web

Estas tareas no dependen del código. Su responsable es el propietario o quien gestione el marketing. Ninguna garantiza una posición concreta, pero son las palancas legítimas que más influyen en el resultado local de Google (el mapa y el «local pack»).

## 1. Datos NAP: una sola versión en todas partes

Nombre, dirección (o área de servicio) y teléfono deben ser **idénticos** en Google Business Profile, la web, los datos estructurados, el aviso legal, las redes y los directorios. En la web salen de un único archivo, `app/lib/site.ts`, que pasará a `site-settings` en `/admin`.

| Dato | Valor actual en la web | Pendiente |
|---|---|---|
| Nombre comercial | Limpiezas Granalva | Confirmar que coincide **exactamente** con Google Business Profile |
| Teléfono | 744 488 964 (+34 744 488 964) | — |
| Correo | info@limpiezasgranalva.com | — |
| Web | https://limpiezasgranalva.com (sin www) | — |
| Área de servicio | Granada y área metropolitana | Confirmar municipios reales y Sierra Nevada |
| Dirección | No se publica | Decidir si es un negocio con local abierto al público o de área de servicio. El aviso legal actual de WordPress contiene un domicilio: confirmar si debe mostrarse o si es solo un dato fiscal |
| Horario | No se publica | Facilitar el horario de atención para web, Google Business Profile y datos estructurados |
| Perfiles oficiales | Ninguno publicado | Facilitar URLs reales de Google Business Profile, Instagram, Facebook o LinkedIn para añadirlas a `sameAs` |

## 2. Google Business Profile: lista de acciones

1. **Verificar el perfil** y comprobar que el propietario tiene acceso como propietario principal, no solo como gestor.
2. **Nombre:** solo el nombre real («Limpiezas Granalva»). Nunca «Limpiezas Granalva – Empresa de limpieza Granada»: Google puede suspender el perfil por añadir palabras clave al nombre.
3. **Categorías:**
   - La principal debe ser la actividad que más factura. Las opciones a buscar en el selector son del tipo «Servicio de limpieza comercial», «Servicio de limpieza» o «Lavandería».
   - Como secundarias, las demás actividades reales: limpieza de casas, lavandería, servicio de lavandería con recogida y entrega, alquiler de ropa de cama, etc.
   - Usar solo los nombres que ofrece el selector de Google; no inventar categorías.
4. **Área de servicio:** solo los municipios donde se presta servicio de forma real. Si no hay local abierto al público, ocultar la dirección.
5. **Servicios:** dar de alta los 9 servicios con una descripción breve y coherente con la web.
6. **Enlaces de cada servicio:** cada servicio debe enlazar su página. Ejemplo: `https://limpiezasgranalva.com/servicios/lavanderia-hoteles-granada?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
7. **Web principal del perfil:** `https://limpiezasgranalva.com/?utm_source=google&utm_medium=organic&utm_campaign=gbp`.
8. **Fotos y vídeos reales:**
   - equipo, vehículo, lavandería, procesos y resultados;
   - sin imágenes de banco ni generadas;
   - las mismas fotos pueden usarse en la web.
9. **Horarios:** ordinarios y especiales (festivos de Granada, Semana Santa, Navidad).
10. **Reseñas:**
    - Pedirlas solo a clientes reales tras un servicio terminado, con un enlace directo.
    - No ofrecer nada a cambio, no filtrar a quién se le pide ni redactarlas por el cliente.
    - Responder **todas**, también las negativas, de forma profesional.
11. **Publicaciones:** novedades, temporadas (alta turística, Sierra Nevada si se confirma), casos reales autorizados y artículos del blog.
12. **Preguntas y respuestas:** revisarlas cada mes y contestar con la misma información de la web.
13. **Medición:** consultar cada mes en las estadísticas del perfil las llamadas, visitas a la web, solicitudes de ruta y búsquedas.

### Sierra Nevada (temporada 2026/27)

- Añadir en Google Business Profile el servicio «Lavandería en Sierra Nevada», enlazado con `https://limpiezasgranalva.com/servicios/lavanderia-sierra-nevada?utm_source=google&utm_medium=organic&utm_campaign=gbp-sierra`.
- Añadir Sierra Nevada al área de servicio del perfil **solo** para los servicios que realmente se prestan allí.
- Publicar en el perfil, antes y durante la temporada, novedades reales (rutas abiertas, preparación de temporada) con fotos propias.
- Contactar con gestores de apartamentos y alojamientos de la estación, asociaciones de empresarios turísticos de la zona y entidades locales que publiquen directorios de proveedores. Pedir una mención o un enlace solo cuando haya relación comercial real.

## 2 bis. Search Console y Bing Webmaster Tools

1. **Search Console:**
   - verificar la **propiedad de dominio** por DNS (cubre http/https y www);
   - enviar `https://limpiezasgranalva.com/sitemap.xml`;
   - activar los avisos por correo.
2. **Bing Webmaster Tools:** importar el sitio desde Search Console y enviar el mismo sitemap. Bing alimenta también otros buscadores y asistentes.
3. **Revisiones del primer mes:** semanalmente, Páginas, Rendimiento y Core Web Vitals; después, mensualmente.

## 3. Autoridad y confianza dentro de la web (preparado para el CMS)

| Elemento | Estado | Cuando el propietario lo facilite |
|---|---|---|
| Logotipos de clientes | No se publica ninguno | Colección `clients` con fecha y nota de autorización; solo se muestran los autorizados |
| Casos de éxito | No hay | Colección `case-studies`: necesidad, solución y resultados demostrables, enlazando el servicio usado |
| Fotografías del equipo | Iniciales sustituidas por el emblema real | Colección `team`, con foto real, cargo y biografía breve |
| Instalaciones y vehículos | No hay fotos | Biblioteca `media` |
| Años de experiencia | Texto cualitativo, sin cifra | Sustituir por la cifra real verificada |
| Reseñas | 4 extractos procedentes de la página pública de referencias de Granalva | Colección `reviews`: fuente, URL y permiso. **No** se marcan en JSON-LD (Google no admite reseñas de la propia empresa en datos estructurados) |
| Asociaciones o acreditaciones | Ninguna publicada | Solo las reales, con enlace a la entidad |
| Autores del blog | — | Personas reales de Granalva (`Person` en JSON-LD) |
| Fecha de actualización | Visible en cada servicio | Se actualizará sola desde el CMS |
| Datos legales | En WordPress | Fase 7: migrar tras revisión |

En la portada de WordPress figura la frase «Resultados 100 % impecables». La web nueva no la incluye porque no es demostrable.

## 4. Estrategia de autoridad local (enlaces y menciones legítimas)

Por orden de valor esperado para un negocio local B2B:

1. **Clientes y colaboradores:** pedir a los alojamientos, gestores y empresas clientes una mención con enlace en su página de proveedores o de alianzas, o un caso de éxito conjunto.
2. **Proveedores:** fabricantes de textiles, productos o maquinaria suelen tener directorios de clientes o distribuidores.
3. **Asociaciones empresariales y del sector turístico de Granada:** asociaciones de apartamentos turísticos, federaciones de hostelería, Cámara de Comercio y asociaciones de empresarios del área metropolitana. Afiliarse solo cuando aporte valor real.
4. **Medios locales:** noticias reales, como una nueva ruta de lavandería, contratación de personal, temporada alta o colaboración con una entidad local, en prensa digital granadina.
5. **Directorios profesionales fiables:** pocos y de calidad (Google Business Profile, Bing Places, Apple Business Connect, Páginas Amarillas y directorios sectoriales). El mismo NAP en todos.
6. **Contenido citable:** guías útiles del blog, como el cálculo de juegos de sábanas por apartamento, que otros gestores puedan enlazar.

**No hacer:** comprar enlaces, intercambios masivos, redes de blogs, directorios automáticos de baja calidad, reseñas falsas ni páginas con listas de municipios sin contenido.
