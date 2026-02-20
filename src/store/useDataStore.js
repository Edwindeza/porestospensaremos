import { create } from 'zustand'

const STORAGE_KEY = 'porquiensi_umbrales'

function getStoredUmbrales() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function setStoredUmbrales(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch (_) {}
}

function valuesKey(id) {
  return id === '4b' ? 'i4b' : `i${id}`
}

/** Por cada indicador, quiénes no pasan ese umbral (tachados en ese indicador). */
function computeDescartadosPorIndicador(indicadoresData, umbrales) {
  if (!indicadoresData?.meta || !indicadoresData?.partidos) return {}
  const out = {}
  const partidos = indicadoresData.partidos
  for (const id of Object.keys(indicadoresData.meta)) {
    const meta = indicadoresData.meta[id]
    const values = indicadoresData[valuesKey(id)] || {}
    const umbral = umbrales[id]
    if (umbral == null) {
      out[id] = []
      continue
    }
    const descartados = partidos.filter((p) => {
      const v = values[p]
      if (v == null) return false
      if (meta.higherIsBetter) return v < umbral
      return v > umbral
    })
    out[id] = descartados
  }
  return out
}

/** Acumulación grupal: unión de todos los tachados de todos los indicadores. */
function computeDescartadosTotal(descartadosPorIndicador) {
  const set = new Set()
  for (const arr of Object.values(descartadosPorIndicador || {})) {
    for (const p of arr) set.add(p)
  }
  return set
}

export const useDataStore = create((set) => ({
  indicadores: null,
  ranking: null,
  umbrales: getStoredUmbrales(),
  descartadosPorIndicador: {},
  descartadosTotal: new Set(),

  loadData: async () => {
    try {
      const [ind, rank] = await Promise.all([
        fetch('/data/indicadores.json').then((r) => r.json()),
        fetch('/data/ranking.json').then((r) => r.json()),
      ])
      set((state) => {
        const nextUmbrales = { ...state.umbrales }
        let changed = false
        if (ind?.meta) {
          for (const id of Object.keys(ind.meta)) {
            const meta = ind.meta[id]
            const valorGuardado = nextUmbrales[id]
            // Valor por defecto: nadie tachado → higherIsBetter false → max; true → min
            const valorPorDefecto = meta.higherIsBetter ? meta.min : meta.max
            if (valorGuardado == null) {
              nextUmbrales[id] = valorPorDefecto
              changed = true
            } else if (meta.higherIsBetter && valorGuardado === meta.max) {
              // Migración: si estaba en max (tachaba a todos), pasar a min para que nadie tachado
              nextUmbrales[id] = meta.min
              changed = true
            }
          }
        }
        if (changed) setStoredUmbrales(nextUmbrales)
        const descartadosPorIndicador = computeDescartadosPorIndicador(ind, nextUmbrales)
        const descartadosTotal = computeDescartadosTotal(descartadosPorIndicador)
        return {
          indicadores: ind,
          ranking: rank,
          umbrales: nextUmbrales,
          descartadosPorIndicador,
          descartadosTotal,
        }
      })
    } catch (_) {
      // datos en /public
    }
  },

  /** Actualiza solo el umbral del indicador indicado (id). Cada indicador es independiente. */
  setUmbral: (id, value) => {
    const num = value === '' || value == null ? undefined : Number(value)
    set((state) => {
      const nextUmbrales = { ...state.umbrales }
      if (num == null || (typeof num === 'number' && Number.isNaN(num))) {
        delete nextUmbrales[id]
      } else {
        nextUmbrales[id] = num
      }
      setStoredUmbrales(nextUmbrales)
      const descartadosPorIndicador = computeDescartadosPorIndicador(state.indicadores, nextUmbrales)
      const descartadosTotal = computeDescartadosTotal(descartadosPorIndicador)
      return {
        umbrales: nextUmbrales,
        descartadosPorIndicador,
        descartadosTotal,
      }
    })
  },
}))
