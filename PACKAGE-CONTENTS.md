# Contenido del paquete de traspaso

El ZIP contiene:

- código fuente completo de la versión 10 publicada;
- las once rutas SEO y su contenido;
- componentes, estilos, comportamiento y pruebas;
- logotipo, fuente Granaina, tres vídeos y tres imágenes principales;
- configuración de build y despliegue de origen;
- `package.json` y `package-lock.json` reproducibles;
- documentación de marca, SEO, CMS, auditoría y publicación;
- plantilla de variables de entorno sin credenciales;
- prompt inicial listo para copiar en Claude.

Se excluyen deliberadamente:

- `node_modules/` y cachés reinstalables;
- `dist/`, `.next/` y otros resultados de compilación;
- credenciales, tokens y archivos `.env` reales;
- metadatos internos del repositorio remoto de ChatGPT.

## Verificación antes de empaquetar

Ejecutada el 7 de noviembre de 2026:

```text
npm run lint  -> correcto
npm test      -> correcto
11 rutas      -> título, descripción, canonical y H1 únicos
robots/sitemap -> correctos en la línea base
```

Commit de la fuente recuperada: `eec1d255558c5b82ed2f4968b4292ff4ad8b3614`.

