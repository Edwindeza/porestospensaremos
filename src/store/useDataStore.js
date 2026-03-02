import { create } from 'zustand'

const STORAGE_KEY = 'porquiensi_umbrales'
const MODO_KEY = 'porquiensi_modo'
const AMBITO_KEY = 'porquiensi_ambito'

const storage = typeof sessionStorage !== 'undefined' ? sessionStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }

function getStoredModo() {
  try {
    const m = storage.getItem(MODO_KEY)
    if (m === 'encuesta' || m === 'intervalo') return m
    return 'encuesta'
  } catch {
    return 'encuesta'
  }
}

function setStoredModo(modo) {
  try {
    storage.setItem(MODO_KEY, modo)
  } catch (_) {}
}

function getStoredAmbito() {
  try {
    const a = storage.getItem(AMBITO_KEY)
    if (a === 'nacional' || a === 'regional') return a
    return ''
  } catch {
    return ''
  }
}

function setStoredAmbito(ambito) {
  try {
    if (ambito) storage.setItem(AMBITO_KEY, ambito)
    else storage.removeItem(AMBITO_KEY)
  } catch (_) {}
}

function getStoredUmbrales() {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

function setStoredUmbrales(obj) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch (_) {}
}

function clearStored() {
  try {
    storage.removeItem(STORAGE_KEY)
    storage.removeItem(MODO_KEY)
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
    const u = umbrales[id]
    if (meta.rangeFilter) {
      const min = u?.min ?? meta.min
      const max = u?.max ?? meta.max
      const descartados = partidos.filter((p) => {
        const v = values[p]
        if (v == null) return false
        return v < min || v > max
      })
      out[id] = descartados
    } else {
      const umbral = u
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
  encuestaRespuestas: null,
  setEncuestaRespuestas: (answers) => set({ encuestaRespuestas: answers }),
  modo: getStoredModo(),
  ambito: getStoredAmbito(),
  setAmbito: (ambito) => {
    if (ambito !== 'nacional' && ambito !== 'regional' && ambito !== '') return
    setStoredAmbito(ambito)
    set({ ambito })
  },
  setModo: (modo) => {
    if (modo !== 'encuesta' && modo !== 'intervalo') return
    clearStored()
    setStoredModo(modo)
    set((state) => {
      const ind = state.indicadores
      if (!ind?.meta) {
        return { modo, umbrales: {}, descartadosPorIndicador: {}, descartadosTotal: new Set(), encuestaRespuestas: null }
      }
      const nextUmbrales = {}
      for (const id of Object.keys(ind.meta)) {
        const meta = ind.meta[id]
        nextUmbrales[id] = meta.rangeFilter
          ? { min: meta.min, max: meta.max }
          : (meta.higherIsBetter ? meta.min : meta.max)
      }
      const descartadosPorIndicador = computeDescartadosPorIndicador(ind, nextUmbrales)
      const descartadosTotal = computeDescartadosTotal(descartadosPorIndicador)
      return {
        modo,
        umbrales: nextUmbrales,
        descartadosPorIndicador,
        descartadosTotal,
        encuestaRespuestas: null,
      }
    })
  },
  infoIndicadorId: null,
  setInfoIndicadorId: (id) => set({ infoIndicadorId: id }),

  loadData: async () => {
    try {
      const ambito = useDataStore.getState().ambito
      const indicadoresUrl = ambito === 'regional' ? '/data/indicadores-regional.json' : '/data/indicadores.json'
      const rankingUrl = ambito === 'regional' ? '/data/ranking-regional.json' : '/data/ranking.json'
      const [ind, rank] = await Promise.all([
        fetch(indicadoresUrl).then((r) => r.json()),
        fetch(rankingUrl).then((r) => r.json()),
      ])
      set((state) => {
        const nextUmbrales = { ...state.umbrales }
        let changed = false
        if (ind?.meta) {
          for (const id of Object.keys(ind.meta)) {
            const meta = ind.meta[id]
            const valorGuardado = nextUmbrales[id]
            if (meta.rangeFilter) {
              const def = { min: meta.min, max: meta.max }
              if (valorGuardado == null || typeof valorGuardado !== 'object') {
                nextUmbrales[id] = def
                changed = true
              }
            } else {
              const valorPorDefecto = meta.higherIsBetter ? meta.min : meta.max
              if (valorGuardado == null) {
                nextUmbrales[id] = valorPorDefecto
                changed = true
              } else if (meta.higherIsBetter && valorGuardado === meta.max) {
                nextUmbrales[id] = meta.min
                changed = true
              }
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

  /** Limpia umbrales guardados y vuelve a valores por defecto (nadie tachado). */
  reiniciar: () => {
    setStoredUmbrales({})
    set((state) => {
      const ind = state.indicadores
      if (!ind?.meta) {
        return { umbrales: {}, descartadosPorIndicador: {}, descartadosTotal: new Set(), encuestaRespuestas: null }
      }
      const nextUmbrales = {}
      for (const id of Object.keys(ind.meta)) {
        const meta = ind.meta[id]
        nextUmbrales[id] = meta.rangeFilter
          ? { min: meta.min, max: meta.max }
          : (meta.higherIsBetter ? meta.min : meta.max)
      }
      const descartadosPorIndicador = computeDescartadosPorIndicador(ind, nextUmbrales)
      const descartadosTotal = computeDescartadosTotal(descartadosPorIndicador)
      return {
        umbrales: nextUmbrales,
        descartadosPorIndicador,
        descartadosTotal,
        encuestaRespuestas: null,
      }
    })
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

  /** Para indicadores con rangeFilter: actualiza cota mínima y máxima (quedan fuera los que están por debajo del mínimo o por encima del máximo). */
  setUmbralRange: (id, min, max) => {
    set((state) => {
      const nextUmbrales = { ...state.umbrales }
      nextUmbrales[id] = { min: Number(min), max: Number(max) }
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

  /** Reemplaza todos los umbrales (p. ej. desde la encuesta). Los no incluidos en el objeto se dejan como estaban; para "reiniciar" los no respondidos se debe pasar el objeto completo (buildUmbralesFromEncuesta). */
  setUmbralesFromEncuesta: (nextUmbrales) => {
    set((state) => {
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
