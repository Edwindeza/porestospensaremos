/**
 * Configuración de la encuesta: preguntas, opciones y mapeo a umbrales del store.
 * Valores convertidos a la misma escala que indicadores.json (meta min/max).
 */

export const ENCUESTA = [
  {
    id: '1',
    title: 'Indicador 1',
    question: '¿Cuántos candidatos, de los 30 al Senado Nacional, son aceptables con *sentencia firme*?',
    type: 'radio',
    options: [
      { value: 'A', label: 'A) Ninguno', umbral: 0 },
      { value: 'B', label: 'B) 1 a 2', umbral: 7 },
      { value: 'C', label: 'C) 3 a 4', umbral: 13 },
      { value: 'D', label: 'D) Más de 5', umbral: 20 },
    ],
  },
  {
    id: '2',
    title: 'Indicador 2',
    question: '¿Qué nivel de preparación, como grupo, espera de los candidatos al Senado Nacional?',
    type: 'radio',
    // Escala 0–20: aceptamos partidos con índice >= mínimo (referencia: secundaria≈2, técnico≈4, bachiller≈5–8, posgrado≈12+)
    options: [
      { value: 'A', label: 'A) Por lo menos secundaria completa', umbral: { min: 2, max: 20 } },
      { value: 'B', label: 'B) Por lo menos técnico completo', umbral: { min: 4, max: 20 } },
      { value: 'C', label: 'C) Por lo menos bachiller completo', umbral: { min: 5, max: 20 } },
      { value: 'D', label: 'D) Con al menos la mitad con bachiller completo y estudios de posgrado', umbral: { min: 7, max: 20 } },
    ],
  },
  {
    id: '3',
    title: 'Indicador 3',
    question: '¿Cuántos candidatos, de los 30 al Senado Nacional, acepta que no hayan declarado sus ingresos en 2025?',
    type: 'radio',
    options: [
      { value: 'A', label: 'A) Ninguno', umbral: 0 },
      { value: 'B', label: 'B) 1 a 3', umbral: 3 },
      { value: 'C', label: 'C) 3 a 6', umbral: 6 },
      { value: 'D', label: 'D) 7 a 10', umbral: 10 },
      { value: 'E', label: 'E) 11 o más', umbral: 30 },
    ],
  },
  {
    id: '4b',
    title: 'Indicador 4',
    question: '¿Qué nivel de ingresos, como promedio, espera de los 30 candidatos al Senado Nacional? (puede escoger más de una)',
    type: 'checkbox',
    options: [
      { value: 'A', label: 'A) Bajo, menos de 3000 mensual', umbral: { min: 0, max: 5000 } },
      { value: 'B', label: 'B) Medio bajo, de 3000 a 6000 mensual', umbral: { min: 5000, max: 10000 } },
      { value: 'C', label: 'C) Medio, de 6000 a 9000 mensual', umbral: { min: 10000, max: 15000 } },
      { value: 'D', label: 'D) Medio alto, de 9000 a 12000 mensual', umbral: { min: 15000, max: 20000 } },
      { value: 'E', label: 'E) Alto, más de 12000 mensual', umbral: { min: 20000, max: 25000 } },
    ],
  },
  {
    id: '5',
    title: 'Indicador 5',
    question: '¿Cuántos candidatos, de los 30 al Senado Nacional, acepta con participación pasada en los partidos de #PorEstosNo?',
    type: 'radio',
    options: [
      { value: 'A', label: 'A) Ninguno', umbral: 0 },
      { value: 'B', label: 'B) 1 a 3', umbral: 10 },
      { value: 'C', label: 'C) 4 a 7', umbral: 23 },
      { value: 'D', label: 'D) 8 a 11', umbral: 37 },
      { value: 'E', label: 'E) 11 a 20', umbral: 67 },
      { value: 'F', label: 'F) Voy a votar por #PorEstosNo', umbral: 100 },
    ],
  },
  {
    id: '6',
    title: 'Indicador 6',
    question: '¿Cuántos candidatos, de los 30 al Senado Nacional, acepta que sean actualmente Congresistas en busca de su reelección?',
    type: 'radio',
    options: [
      { value: 'A', label: 'A) Ninguno', umbral: 0 },
      { value: 'B', label: 'B) 1 a 2', umbral: 2 },
      { value: 'C', label: 'C) 3 a 4', umbral: 4 },
      { value: 'D', label: 'D) Más de 5', umbral: 7 },
    ],
  },
  {
    id: '7',
    title: 'Indicador 7',
    question: 'Los partidos deberían tener listas completas de 30 candidatos, pero algunos no completaron. ¿Cuál es el número mínimo de candidatos que usted aceptaría?',
    type: 'radio',
    options: [
      { value: 'A', label: 'A) Por lo menos 15', umbral: 15 },
      { value: 'B', label: 'B) Por lo menos 20', umbral: 20 },
      { value: 'C', label: 'C) Por lo menos 25', umbral: 25 },
      { value: 'D', label: 'D) Tienen que tener el equipo completo', umbral: 30 },
    ],
  },
  {
    id: '8',
    title: 'Indicador 8',
    question: '¿Cuántos candidatos, de los 30 al Senado Nacional, acepta con REINFO (minería en proceso de formalización)?',
    type: 'radio',
    options: [
      { value: 'A', label: 'A) Ninguno', umbral: 0 },
      { value: 'B', label: 'B) 1 a 2', umbral: 2 },
      { value: 'C', label: 'C) 3 a 4', umbral: 4 },
      { value: 'D', label: 'D) Más de 5', umbral: 9 },
    ],
  },
]

/** Devuelve umbral "acepta todos" para un indicador según su meta. */
function defaultUmbralForMeta(meta) {
  if (meta.rangeFilter) return { min: meta.min, max: meta.max }
  return meta.higherIsBetter ? meta.min : meta.max
}

/** Construye el objeto umbrales completo: por defecto "acepta todos" y solo los indicadores respondidos se aplican. Así no arrastramos filtros viejos de otros indicadores. */
export function buildUmbralesFromEncuesta(answers, meta) {
  if (!meta || typeof meta !== 'object') return {}
  const next = {}
  for (const id of Object.keys(meta)) {
    next[id] = defaultUmbralForMeta(meta[id])
  }
  for (const block of ENCUESTA) {
    const ans = answers[block.id]
    if (ans == null || ans === '') continue
    if (Array.isArray(ans) && ans.length === 0) continue
    if (block.type === 'checkbox') {
      const selected = Array.isArray(ans) ? ans : [ans]
      if (selected.length === 0) continue
      const opts = block.options.filter((o) => selected.includes(o.value))
      if (opts.length === 0) continue
      const mins = opts.map((o) => o.umbral.min)
      const maxs = opts.map((o) => o.umbral.max)
      next[block.id] = { min: Math.min(...mins), max: Math.max(...maxs) }
    } else {
      const opt = block.options.find((o) => o.value === ans)
      if (!opt) continue
      next[block.id] = typeof opt.umbral === 'object' ? { ...opt.umbral } : opt.umbral
    }
  }
  return next
}

/** Aplica las respuestas de la encuesta al store. Usa buildUmbralesFromEncuesta + setUmbralesFromEncuesta para que los indicadores no respondidos queden en "acepta todos" y no se arrastren filtros viejos. */
export function applyEncuestaToStore(answers, meta, setUmbralesFromEncuesta) {
  const next = buildUmbralesFromEncuesta(answers, meta)
  if (Object.keys(next).length > 0) setUmbralesFromEncuesta(next)
}
