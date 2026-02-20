# Plan: Sitio web “Por qué sí” — descarte de partidos por métricas

## Objetivo

Sitio web donde la persona **descarta partidos** en base a indicadores (I1, I2, I3, I4b, I5, I6, I7, I8 REINFO), usando **barras rojas (sliders)** por indicador. Los partidos que no pasan el umbral se marcan en **gris (plomo)** en las pantallas siguientes; al final puede quedar un conjunto pequeño o un solo partido “en color”, que sería la elección sugerida. Incluye **tablas de valor compuesto** (ranking 1–35 y porcentaje 1–100) y **gráficas por partido**. Todo con **almacenamiento local** (storage del navegador) y **transparencia** sobre el origen de los datos.

---

## Principios

1. **Privacidad:** Solo `localStorage` (y/o `sessionStorage`). No servidor de usuarios, no cookies de tracking.
2. **Transparencia:** Sección clara “Cómo se creó esta información” (metodología, fórmulas, fuentes).
3. **Contexto político:** Texto breve que aclare que es una herramienta informativa, no propaganda.

---

## Funcionalidad por bloques

### 1. Indicadores (pantallas I1, I2, I3, I4b, I5, I6, I7, I8)

- **Una vista/pantalla por indicador** (o pestañas bien diferenciadas).
- En cada pantalla:
  - **Gráfico de barras horizontales** con los partidos y su valor (los datos ya validados en el README).
  - **Línea/slider rojo** que el usuario mueve para fijar un **umbral mínimo** (o máximo, según el indicador).
- **Regla de descarte:**
  - Si el indicador es “mejor si es mayor” (ej. I2 Preparación, I4b Ingresos efectivos): partidos **por debajo** del umbral → se marcan como descartados.
  - Si el indicador es “mejor si es menor” (ej. I1 % con sentencia, I3 candidatos con S/ 0): partidos **por encima** del umbral → descartados.
- **Estado global de “descartados”:**
  - Al mover la raya roja en I1, se guarda en storage qué partidos quedan descartados **por I1**.
  - Esos partidos en **I2, I3, I4b, I5, I6, I7** se muestran en **color plomo (gris)** y opcionalmente con etiqueta “Descartado en I1” (o el indicador que sea).
  - La unión de todos los descartes (I1 ∪ I2 ∪ … ∪ I8) define el conjunto **totalmente descartado**; el resto son los partidos “que siguen en carrera”.

### 2. Comportamiento “más plomos al avanzar”

- En la **primera** pantalla (I1) todos los partidos en color.
- A partir de I2: partidos ya descartados en I1 → gris; el usuario mueve la raya en I2 y descarta más.
- En I3: grises = descartados en I1 o I2; en color = los que aún pasan I1 e I2; el usuario descarta con la raya de I3.
- Así sucesivamente hasta I7. Al final, los que quedan en color son los que pasaron **todos** los umbrales que el usuario fijó.
- Si queda **uno solo en color**, el sitio puede mostrar un mensaje tipo “Según tus criterios, este partido es el que mejor cumple”.

### 3. Tablas resumen (valor compuesto)

- **Tabla “Ranking 1–35”:** misma lógica que “Tabla Ranking” del Excel (35 = óptimo). Filas = partidos; columnas = criterios + Valor Compuesto. Pesos visibles (25%, 20%, etc.).
- **Tabla “Porcentaje 1–100”:** misma lógica que “Tabla 100” (100 = óptimo).
- En ambas tablas:
  - Partidos **descartados** por el usuario (gris en indicadores) se muestran en **gris** también aquí, para coherencia.
  - Opción de ordenar por Valor Compuesto (ranking o %).

### 4. Gráficas por partido

- **Una vista “por partido”:** al elegir un partido (lista o click en una tabla/gráfico), se muestra su **gráfico radar** con los mismos ejes que en el libro (Sin Sentencias, Preparación, Ingresos Nulos, Ingresos Efectivos, Libre del Pacto, Sin Reelección, Equipo Completo).
- Valores ya calculados (ej. Renovación Popular en el README); el resto de partidos se pueden incorporar cuando existan datos en el Excel/JSON.
- Si el partido está descartado, se puede mostrar igual el radar pero con un aviso “Descartado en indicadores X, Y”.

### 5. Almacenamiento en storage del usuario

- **Qué guardar en `localStorage`:**
  - Por cada indicador (I1…I8): valor del **umbral** (posición de la raya roja) y, derivado, el **conjunto de partidos descartados** en ese indicador.
  - Opcional: última pantalla visitada, orden de tablas, tema claro/oscuro.
- **Qué no guardar:** datos de identificación del usuario, nada que se envíe a servidor.
- Al abrir el sitio: leer storage y aplicar de nuevo los umbrales para pintar grises/colores y filtrar tablas.

### 6. Transparencia y contexto (“Cómo se creó esta información”)

- **Página o sección fija** (ej. “Metodología” / “Fuentes”) con:
  - Breve descripción del proyecto y que los datos son calculados a partir de información pública (candidatos, declaraciones, etc.).
  - **Fuentes de datos:** mención explícita de **REINFO** (registro de candidatos por partido y tipo de elección: Senador Nacional, Diputado, Senador Regional, Senador, Parlam Andino) y de las **tablas de sentencias** (Totales y Porcentaje por partido, alineadas con la hoja “Ordenando Data” / libro PorEstos). Ver README sección “Datos de sentencias (ampliados) y REINFO”.
  - Referencia a los **indicadores** (qué mide I1, I2, I3, I4b, I5, I6, I7, I8 REINFO) y a las **fórmulas** cuando aplique (IP, IF, valor compuesto con pesos).
  - Enlace o mención al **README** (o versión resumida en la web) para quien quiera el detalle técnico.
  - Aviso de que es una **herramienta informativa**, no vinculante ni propaganda.

---

## Steps sugeridos (orden de implementación)

1. **Estructura y datos**
   - Definir estructura del proyecto (HTML/JS/CSS o framework ligero; sin backend de usuarios).
   - Convertir los datos validados (README / Excel) a **JSON estático** (partidos, valores por indicador, tablas ranking/100, radares por partido).
   - Incluir en el JSON (o en un archivo asociado) los **datos ampliados de sentencias** por partido (Sentencias Total, Sentencias Porcentaje, y si aplica #Candidatos, #Cand Efec) según tabla “Ordenando Data” / PorEstos, para mostrar en metodología o en detalle por partido.
   - Opcional: estructura para **REINFO** (candidato, partido, elección, #en Lista, #Cantidad) si se quiere mostrar lista de candidatos por partido en el sitio; si no, al menos citar REINFO como fuente en la página de metodología.
   - Subir o servir ese JSON desde el mismo sitio (ej. `/data/indicadores.json`).

2. **Indicadores y slider**
   - Implementar **una pantalla por indicador** (I1, I2, I3, I4b, I5, I6, I7, I8) con gráfico de barras horizontales y **slider rojo**.
   - Definir para cada indicador si “mejor = mayor” o “mejor = menor” y calcular “descartados” según umbral.
   - Guardar en `localStorage` el umbral (y opcionalmente la lista de descartados por indicador).

3. **Estado global “descartados” y color plomo**
   - Mantener un estado (en memoria + storage) con “descartados por I1”, “… por I2”, etc.
   - En cada pantalla de indicador: pintar en **gris** los partidos que ya están descartados en indicadores anteriores (o en el actual si no pasan la raya).
   - Asegurar que al cargar la página se reaplican los umbrales guardados y se actualizan los grises.

4. **Navegación y flujo**
   - Navegación clara entre I1 → I2 → … → I8 (y opcionalmente “Resumen” y “Por partido”).
   - Texto corto en cada pantalla explicando qué mide el indicador y cómo usar la raya.

5. **Tablas resumen**
   - Vista “Ranking (1–35)” y “Porcentaje (1–100)” con los datos del JSON.
   - Aplicar mismo criterio de gris a partidos descartados; ordenación por Valor Compuesto.

6. **Gráficas por partido**
   - Vista “Por partido”: selector de partido + gráfico radar con los ejes definidos.
   - Reutilizar datos del JSON; si hace falta, librería ligera de gráficos (Chart.js, Apache ECharts, o SVG a mano).

7. **Metodología y privacidad**
   - Página “Cómo se creó esta información” con metodología, fórmulas y aviso de herramienta informativa.
   - Página o bloque “Privacidad”: explicar que solo se usa storage local, sin tracking, sin enviar datos a servidor.

8. **Ajustes y accesibilidad**
   - Revisar contraste (gris vs color), etiquetas para lectores de pantalla, y que el slider sea usable por teclado.

---

## Resumen de pantallas/vistas

| Vista | Contenido |
|-------|------------|
| Inicio / Indicador 1 | Barras I1 + slider rojo; todos en color al inicio. |
| Indicadores 2–8 | Barras del indicador + slider; partidos ya descartados en gris. |
| Tabla Ranking (1–35) | Tabla valor compuesto escala 35; filas en gris si descartadas. |
| Tabla 100 | Tabla valor compuesto escala 100; mismo criterio de gris. |
| Por partido | Selector + radar del partido elegido. |
| Metodología / Fuentes | Cómo se creó la información, fórmulas, aviso político. |
| Privacidad | Uso de localStorage, sin servidor de usuarios. |

---

## Stack técnico

- **Front:** **React + Vite** (SPA con rutas client-side).
- **Datos:** JSON estático generado a partir del README/Excel.
- **Gráficos:** Chart.js, ECharts, o D3/SVG para barras y radar.
- **Hosting:** estático (GitHub Pages, Netlify, Vercel) sin base de datos ni backend de usuarios.

---

## SEO (importante)

Aunque sea una SPA, conviene que buscadores indexen bien la herramienta y sobre todo la página de metodología/fuentes. Medidas recomendadas:

1. **Meta tags por ruta**
   - Usar `react-helmet-async` (o similar) para definir por vista: `<title>`, `<meta name="description">`, `<meta property="og:title">`, `og:description`, `og:type`. La página **Metodología / Cómo se creó esta información** debe tener título y descripción claros (qué es el proyecto, fuentes, REINFO, indicadores).

2. **HTML base (`index.html`)**
   - Título y descripción por defecto coherentes con el sitio.
   - Canonical si aplica; lang en `<html>`.

3. **Contenido visible para crawlers**
   - **Pre-renderizado** de las rutas que más interesan para SEO (al menos `/metodologia` o `/fuentes`): generar HTML estático en build para que el crawler vea el texto sin depender del JS. Con Vite se puede usar p. ej. `vite-plugin-prerender` o un script que renderice React a HTML en build y guarde esa ruta como `metodologia/index.html`.
   - Alternativa: si el host lo permite, considerar solo para la ruta de metodología una página HTML estática (sin React) con el mismo contenido, enlazada desde la SPA.

4. **Estructura y accesibilidad**
   - Rutas con URLs legibles: `/indicador/1`, `/indicador/2`, …, `/ranking`, `/metodologia`, `/privacidad`.
   - Uso de `<main>`, `<nav>`, encabezados `<h1>`–`<h2>` y texto en la página de metodología (no solo imágenes ni gráficos) para que haya contenido indexable.

5. **Sitemap y robots**
   - `sitemap.xml` con las URLs principales (inicio, indicadores, ranking, metodología, privacidad).
   - `robots.txt` que permita rastreo y apunte al sitemap.

Con esto se mantiene React + Vite y a la vez se cuida que la parte de transparencia y fuentes sea encontrable e indexable.

---

## Siguiente paso

Con este plan se puede pasar a **diseño de datos (schema del JSON)** y luego a **maquetado y flujo de la primera pantalla (I1 + slider + storage)**. Si quieres, el siguiente documento puede ser el schema del JSON y el wireframe de una sola pantalla (I1) para implementar primero.
