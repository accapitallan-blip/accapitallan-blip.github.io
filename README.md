# REMATES.PRO — Static Landing (GitHub Pages Ready)

Sitio **estático** (sin build) listo para subir a **GitHub Pages**. Incluye:
- Estilo oscuro y minimalista (Tailwind CDN).
- Catálogo con filtros y tarjetas.
- Animaciones sutiles (CSS + IntersectionObserver).
- Íconos (lucide) vía CDN.
- **Conector a Google Sheets** (GViz JSON): pega el *Sheet ID* y la pestaña.

## Cómo publicarlo
1. Descomprime este ZIP.
2. Sube **todo el contenido** a tu repositorio `USERNAME.github.io` en la **raíz** (no dentro de carpetas).
3. Asegúrate de tener un archivo vacío llamado `.nojekyll` en la raíz (ya incluido).
4. En **Settings → Pages**, selecciona: *Branch* = `main`, *Folder* = `/ (root)`.
5. Abre `https://USERNAME.github.io/`.

> No requiere Node ni build. GitHub Pages servirá `index.html` directamente.

## Google Sheets
- Publica tu hoja: **Archivo → Compartir → Publicar en la web** (o compártela como “Cualquiera con el enlace – lector”).
- Columnas esperadas: `titulo, ciudad, tipo, area, habitaciones, banos, descuento, precioBase, fecha, direccion, imagen`.
- En la sección “Conectar con Google Sheets”, pega el **Sheet ID** y el **nombre de la pestaña** y presiona **Cargar desde Sheets**.

---
© 2025 REMATES.PRO
