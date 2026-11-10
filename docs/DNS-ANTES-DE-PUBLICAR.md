# Zona DNS de limpiezasgranalva.com antes de publicar (copia de seguridad)

Captura del panel DNS de Hostinger del 10 nov 2026, facilitada por el propietario. Todos los datos son públicos.

| Tipo | Nombre | Prioridad | Contenido | TTL | ¿Se toca al publicar? |
|---|---|---|---|---|---|
| CNAME | www | 0 | ghs.googlehosted.com | 14400 | **Sí:** pasa a `granalva.netlify.app` |
| CNAME | vztmdv3q75sf | 0 | gv-5gybj4el6e2ioq.dv.googlehosted.com | 60 | No (verificación de Google Workspace) |
| TXT | @ | 0 | "google-site-verification=DZNV5Dnq72Bibguh2PRkctHucCaoDCvXnh9txxj0Ea4" | 60 | No (verificación de Google) |
| MX | @ | 1 | SMTP.GOOGLE.COM | 60 | **No** (correo de Google Workspace) |
| A | @ | 0 | 144.76.199.3 | 14400 | **Sí:** pasa a `75.2.60.5` (Netlify) |

## Volver atrás

Para revertir, basta con restaurar los dos valores anteriores:

- registro A de `@` → `144.76.199.3`;
- CNAME de `www` → `ghs.googlehosted.com`.

WordPress sigue intacto en su servidor.

## Observaciones

No hay registros SPF, DKIM ni DMARC. Añadirlos mejoraría la entrega del correo de `info@`, pero exige una autorización aparte: son registros nuevos y no forman parte de la publicación.
