# Vídeo del hero: diagnóstico y corrección (8 nov 2026)

## Diagnóstico

Se analizó el máster `media/originales/granalva-intro.mp4`: 1440×900, 30 fps, unos 1 Mbps, 16 s y 3 escenas con un corte en 10,03 s.

- **Vibración y tirones del zoom.** El máster no tiene movimiento real a 30 fps. Solo trae unos 20–24 fotogramas únicos por segundo, y el resto son duplicados colocados de forma irregular (132 de 479; patrón 2-3-2-3…). Durante el acercamiento al dormitorio (5,5–9,5 s) hay 34 duplicados en 4 s. El movimiento avanza a saltos desiguales, y eso es lo que se percibe como vibración.
- **El zoom es del propio clip.** Ningún CSS escala ni anima el vídeo, y la vibración de cámara medida con `vidstabdetect` es despreciable (0,5 px de media). Por eso no se aplica estabilización, que habría recortado y reescalado la imagen.
- **Borrosidad.** Tiene dos causas:
  1. En pantallas de más de 1280 px se estiraba el archivo de 1280 px.
  2. La compresión anterior (CRF 31) era agresiva sobre un máster de poca tasa.

## Corrección

1. Se eliminan los duplicados (`mpdecimate`).
2. Se interpola el movimiento con compensación (`minterpolate`, modo `mci` con `aobmc` y detección de corte de escena).
3. Se aplica una reducción de ruido suave (`hqdn3d`) y un enfoque ligero (`unsharp` 0,4).

### 25 fps frente a 30 fps (zoom del dormitorio, 5,5–9,5 s)

| Versión | Coeficiente de variación del movimiento | Casi duplicados |
|---|---|---|
| Máster (30 fps) | 0,65 | 34 |
| Corregido a 30 fps | 0,59 | 27 |
| **Corregido a 25 fps** | **0,45** | **7** |

Se elige **25 fps constantes (CFR)**. Revisados fotograma a fotograma los recortes de la persona y de los objetos, no se aprecian artefactos de interpolación.

## Archivos publicados (`public/video/`)

| Archivo | Uso | Resolución | fps | Peso | SSIM respecto al intermedio |
|---|---|---|---|---|---|
| `granalva-hero-720.mp4` | ≤ 760 px | 720×450 | 25 CFR | 728 KB | 0,972 |
| `granalva-hero-1280.mp4` | 761–1280 px | 1280×800 | 25 CFR | 1 870 KB | 0,979 |
| `granalva-hero-1440.mp4` | > 1280 px (resolución nativa del máster) | 1440×900 | 25 CFR | 2 258 KB | — |
| `granalva-hero-poster-1280.webp` | Póster, idéntico al primer fotograma (elemento LCP) | 1280×800 | — | 68 KB | — |

Antes había dos versiones a 30 fps: 1 328 KB (1280) y 600 KB (720).

Parámetros de codificación:

- H.264 High 4.0, `-preset veryslow -tune film`;
- un fotograma clave por segundo (los capítulos 0 / 5,1 / 10,1 s saltan al instante);
- `+faststart` (el índice `moov` va antes de los datos);
- sin audio, metadatos ni capítulos;
- duración de 14,96 s (se quitó la cola estática duplicada).

## Comportamiento

- Empieza a descargarse tras el evento `load`. El LCP es el póster, que se precarga con prioridad alta.
- No se reproduce solo con `prefers-reduced-motion`, `Save-Data` o 2G: se queda el póster y el usuario puede pulsar un capítulo.
- Se pausa fuera de pantalla con IntersectionObserver.
- El fondo de respaldo es azul `#0b2d6c`, nunca negro.

## Verificación

Script: `node tests/visual/video-check.mjs`, con el servidor en `:3000`.

| Viewport | Red | Fuente elegida | Fotogramas en 3 s | Pausa fuera de pantalla | LCP |
|---|---|---|---|---|---|
| 1920 | Rápida | 1440 | 75 (25 fps) | Sí | Póster |
| 1440 | Rápida | 1440 | 75 | Sí | Póster, 192 ms |
| 390 | Rápida | 720 | 75 | Sí | Póster, 140 ms |
| 390 | Lenta (1,6 Mbps, 150 ms) | 720 | 75 | Sí | Póster, 2,0 s |

Los fotogramas perdidos en escritorio (9–17) se deben al Chromium sin GPU del contenedor de pruebas, que decodifica por software. En móvil se perdieron 0.

**Límite real:** el máster solo tiene 1440×900. En pantallas de 1920 px el navegador amplía ×1,33. Para una nitidez total en pantallas grandes hace falta un máster de 1920×1080 o superior.
