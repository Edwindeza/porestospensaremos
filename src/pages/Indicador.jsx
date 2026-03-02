import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { useDataStore } from '../store/useDataStore'
import { TITLES } from '../data/indicadorInfo'

function formatValue(value, unit) {
  if (value == null || Number.isNaN(value)) return '—'
  if (unit === 'S/') return `S/ ${Number(value).toLocaleString('es-PE')}`
  if (typeof value === 'number' && value % 1 !== 0) return value.toFixed(2)
  return String(value)
}

export default function Indicador() {
  const { id } = useParams()
  const indicadores = useDataStore((s) => s.indicadores)
  const umbrales = useDataStore((s) => s.umbrales)
  const setUmbral = useDataStore((s) => s.setUmbral)
  const setUmbralRange = useDataStore((s) => s.setUmbralRange)
  const setInfoIndicadorId = useDataStore((s) => s.setInfoIndicadorId)
  const descartadosPorIndicador = useDataStore((s) => s.descartadosPorIndicador)
  const descartadosTotal = useDataStore((s) => s.descartadosTotal)
  const ambito = useDataStore((s) => s.ambito)
  const tituloSenado = ambito === 'regional' ? 'Senado Regional' : 'Senado Nacional'
  const title = (TITLES[id] || `Indicador ${id}`).replace(/Senado Nacional/g, tituloSenado)

  if (!indicadores) {
    return (
      <>
        <Helmet><title>{title} — #PorEstosSi</title></Helmet>
        <div className="page">
          <h1>{title}</h1>
          <div className="card"><p>Cargando datos…</p></div>
          <p className="page-links"><Link to="/intervalos" className="btn btn-secondary">Volver a intervalos</Link></p>
        </div>
      </>
    )
  }

  const meta = indicadores.meta?.[id]
  const valuesKey = id === '4b' ? 'i4b' : `i${id}`
  const values = indicadores[valuesKey] || {}
  const partidos = indicadores.partidos || []

  if (!meta) {
    return (
      <>
        <Helmet><title>{title} — #PorEstosSi</title></Helmet>
        <div className="page">
          <h1>{title}</h1>
          <div className="card"><p>Indicador no encontrado.</p></div>
          <p className="page-links"><Link to="/intervalos" className="btn btn-secondary">Volver a intervalos</Link></p>
        </div>
      </>
    )
  }

  const min = meta.min ?? 0
  const max = meta.max ?? 100
  const range = max - min || 1
  const useRange = !!meta.rangeFilter
  const defaultUmbral = meta.higherIsBetter ? min : max
  const defaultRange = { min, max }
  const umbral = useRange ? undefined : (umbrales[id] ?? defaultUmbral)
  const rangeVal = useRange ? (umbrales[id] && typeof umbrales[id] === 'object' ? umbrales[id] : defaultRange) : null
  const umbralMin = rangeVal ? rangeVal.min : undefined
  const umbralMax = rangeVal ? rangeVal.max : undefined
  const minSliderBounds = meta.rangeMinSlider || [min, max]
  const maxSliderBounds = meta.rangeMaxSlider || [min, max]
  const minSliderMin = minSliderBounds[0]
  const minSliderMax = minSliderBounds[1]
  const maxSliderMin = maxSliderBounds[0]
  const maxSliderMax = maxSliderBounds[1]
  const descartadosEste = new Set(descartadosPorIndicador[id] || [])

  const filas = partidos
    .map((nombre) => ({ nombre, valor: values[nombre] }))
    .filter((f) => f.valor != null && !Number.isNaN(f.valor))
    .sort((a, b) => (b.valor - a.valor))

  return (
    <>
      <Helmet>
        <title>{title} — #PorEstosSi</title>
        <meta name="description" content={title} />
      </Helmet>
      <div className="page page-indicador">
        <div className="indicador-derecha">
        <div className="card indicador-card">
          <div className="indicador-escala-wrap">
            <div className="indicador-escala">
              {title}.
              <br />
              Escala: {formatValue(min, meta.unit)} a {formatValue(max, meta.unit)}
              {id === '1' && ' — 0 = nadie tiene sentencia / 100 = todos tienen sentencia.'}
              {useRange && ' — Define el rango aceptado (quedan fuera los que están por debajo del mínimo o por encima del máximo).'}
              {id === '2' && (
                <p className="indicador-escala-ref">
                  Referencia: 0 = analfabeto; 2 = secundaria completa; 4 = técnica completa; 5 = bachiller completo; 10 = maestría; 20 = doctorado.
                </p>
              )}
            </div>
            <button
              type="button"
              className="indicador-info-btn indicador-info-btn-page"
              onClick={() => setInfoIndicadorId(id)}
              aria-label={`Información: ${title}`}
              title={`Información: ${title}`}
            >
              i
            </button>
          </div>
          {id === '3' && (
            <p className="indicador-ejemplo">
              Ejemplo: si un partido muestra 5, significa que 5 candidatos de ese partido declararon ingreso S/ 0.00 en sus declaraciones juradas.
            </p>
          )}
          {id === '5' && (
            <p className="indicador-ejemplo">
              100: #PorEstosNo.
              <br />
              Mientras más bajo el número menos candidatos estan asociados a #PorEstosNo.
              <br />
              Con excepción al <b>FREPAP</b>, todos tienen algún candidato con historial político en alguno de los partidos de <b>#PorEstosNo</b>.
            </p>
          )}
          {id === '7' && (
            <p className="indicador-ejemplo">
              Se requiere una lista de 30 candidatos, pero hay partidos que no han podido completar el cuadro y presentan listas incompletas, lo cual reduce su capacidad de participación en el Senado. Es como ir a un partido de 11 con 9 jugadores.
            </p>
          )}
          {useRange ? (
            <div className="indicador-rango-fila">
              <div className="indicador-slider-wrap">
                <label className="indicador-slider-label" htmlFor={`umbral-min-${id}`}>
                  {meta.rangeMinSlider ? `Mín (${minSliderMin}–${minSliderMax}): ` : 'Mín: '}{formatValue(Math.min(minSliderMax, Math.max(minSliderMin, Number(umbralMin))), meta.unit)}
                </label>
                <input
                  id={`umbral-min-${id}`}
                  type="range"
                  className="indicador-slider"
                  min={minSliderMin}
                  max={minSliderMax}
                  step={id === '4b' ? (max - min) / 200 : 1}
                  value={Math.min(minSliderMax, Math.max(minSliderMin, Number(umbralMin)))}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setUmbralRange(id, v, Math.max(v, Number(umbralMax)))
                  }}
                  aria-label={`Cota mínima ${meta.label}`}
                />
              </div>
              <div className="indicador-slider-wrap">
                <label className="indicador-slider-label" htmlFor={`umbral-max-${id}`}>
                  {meta.rangeMaxSlider ? `Máx (${maxSliderMin}–${maxSliderMax}): ` : 'Máx: '}{formatValue(Math.min(maxSliderMax, Math.max(maxSliderMin, Number(umbralMax))), meta.unit)}
                </label>
                <input
                  id={`umbral-max-${id}`}
                  type="range"
                  className="indicador-slider"
                  min={maxSliderMin}
                  max={maxSliderMax}
                  step={id === '4b' ? (max - min) / 200 : 1}
                  value={Math.min(maxSliderMax, Math.max(maxSliderMin, Number(umbralMax)))}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setUmbralRange(id, Math.min(v, Number(umbralMin)), v)
                  }}
                  aria-label={`Cota máxima ${meta.label}`}
                />
              </div>
            </div>
          ) : (
            <div className="indicador-slider-wrap">
              <label className="indicador-slider-label" htmlFor={`umbral-${id}`}>
                Tu umbral (cuánto toleras): {formatValue(umbral, meta.unit)}{id === '1' ? '% candidatos con sentencia firme' : id === '3' ? '  candidatos sin declarar ingresos' : id === '5' ? ' candidatos con historial #PorEstosNo' : id === '6' ? ' congresistas actuales que buscan ser senadores' : id === '7' ? ` candidatos hábiles al ${tituloSenado}` : ''}
              </label>
              <input
                id={`umbral-${id}`}
                type="range"
                className="indicador-slider"
                min={min}
                max={max}
                step={id === '4b' || id === '2' || id === '8' ? (max - min) / 200 : 1}
                value={Number(umbral)}
                onChange={(e) => setUmbral(id, e.target.value)}
                aria-label={`Umbral ${meta.label}`}
              />
            </div>
          )}

          <figure className="indicador-barras" aria-label={`Gráfico de barras: ${meta.label}`}>
            {filas.map(({ nombre, valor }) => {
              const descartado = descartadosEste.has(nombre)
              const descartadoOtro = descartadosTotal.has(nombre) && !descartado
              const pct = Math.min(100, Math.max(0, ((valor - min) / range) * 100))
              let clase = 'indicador-barra'
              if (descartado) clase += ' descartado'
              else if (descartadoOtro) clase += ' descartado-otro'
              else clase += ' siguen'
              return (
                <div key={nombre} className="indicador-fila">
                  <span className="indicador-nombre" title={nombre}>
                    {nombre}
                  </span>
                  <div className="indicador-barra-wrap">
                    <div
                      className={clase}
                      style={{ width: `${pct}%` }}
                      title={`${nombre}: ${formatValue(valor, meta.unit)}`}
                    />
                    <span className="indicador-valor">{formatValue(valor, meta.unit)}</span>
                  </div>
                </div>
              )
            })}
          </figure>

          <p className="indicador-leyenda">
            <span className="indicador-leyenda-item"><span className="indicador-dot siguen" /> Siguen (pasan el umbral)</span>
            <span className="indicador-leyenda-item"><span className="indicador-dot descartado" /> Tachados (en este u otro indicador)</span>
          </p>
        </div>
        </div>
      </div>
    </>
  )
}
