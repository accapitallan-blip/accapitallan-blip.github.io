# REMATES.PRO — Landing (React + Vite + Tailwind)

Landing comercial oscura y minimalista para remates inmobiliarios. Incluye:
- Catálogo con filtros y tarjetas animadas.
- Botones y microinteracciones con Framer Motion.
- Conector opcional a **Google Sheets** (carga catálogo vía GViz).

## Requisitos
- Node.js 18+
- npm 9+ o pnpm/yarn

## Instalación y arranque
```bash
npm install
npm run dev
# abre http://localhost:5173
```

## Producción
```bash
npm run build
npm run preview
```

## Conectar Google Sheets
1. En tu hoja: **Archivo → Compartir → Publicar en la web** (elige la pestaña).
2. Copia el **ID** del documento (entre `/d/` y `/edit` en la URL).
3. En la sección **Conectar con Google Sheets**, pega el ID y el nombre de la pestaña (p.ej. `Listado`).
4. La hoja debe tener columnas:  
   `titulo, ciudad, tipo, area, habitaciones, banos, descuento, precioBase, fecha, direccion, imagen`.

## Stack
- Vite + React 18
- TailwindCSS 3
- Framer Motion
- lucide-react

## Despliegue
- Sube a GitHub y conecta con **Vercel** o **Netlify**.
- En Vercel: framework **Vite**, comando build `vite build`, directorio `dist`.

---
© 2025 REMATES.PRO
