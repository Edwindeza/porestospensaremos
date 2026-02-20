# Por qué sí — App (React + Vite)

Sitio web para descartar partidos según indicadores. Los datos y la metodología están documentados en el [README principal](../README.md) del repo.

## Cómo correr

```bash
cd app
npm install   # si aún no instalaste
npm run dev   # desarrollo (http://localhost:5173)
npm run build # build estático para producción
npm run preview # previsualizar el build
```

## Rutas

- `/` — Inicio
- `/indicador/1` … `/indicador/7`, `/indicador/4b` — Pantallas de indicadores (barras + raya roja)
- `/ranking` — Tablas valor compuesto (35 y 100)
- `/metodologia` — Cómo se creó la información
- `/privacidad` — Uso de localStorage, sin tracking

## Stack

- React 18 + Vite 7
- react-router-dom, react-helmet-async
- Datos: JSON estático (por agregar en `/public` o `/src/data`)
