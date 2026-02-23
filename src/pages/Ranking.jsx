import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useDataStore } from '../store/useDataStore'
import { ENCUESTA } from '../data/encuestaConfig'

function formatValor(v) {
  if (v == null || (typeof v === 'number' && Number.isNaN(v))) return '—'
  return typeof v === 'number' && v % 1 !== 0 ? v.toFixed(2) : String(v)
}

export default function Ranking() {
  const navigate = useNavigate()
  const [tabActivo, setTabActivo] = useState('mis-resultados')
  const ranking = useDataStore((s) => s.ranking)
  const descartadosTotal = useDataStore((s) => s.descartadosTotal)
  const reiniciar = useDataStore((s) => s.reiniciar)
  const encuestaRespuestas = useDataStore((s) => s.encuestaRespuestas)

  if (!ranking) {
    return (
      <>
        <Helmet><title>Ranking de partidos — #PorEstosSi</title></Helmet>
        <div className="page">
          <h1>Ranking de partidos</h1>
          <div className="card"><p>Cargando datos…</p></div>
          <p className="page-links"><button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Ir a encuesta</button></p>
        </div>
      </>
    )
  }

  const partidos = ranking.partidos || []
  const pesos = ranking.pesos || {}
  const ordenados35 = [...partidos].sort((a, b) => (b.valor35 ?? -1) - (a.valor35 ?? -1))
  const sobrevivientes35 = ordenados35.filter((p) => !descartadosTotal.has(p.nombre))

  const etiquetasPesos = {
    sentencias: 'Sentencias (I1)',
    preparacion: 'Preparación (I2)',
    ingresosNulos: 'Ingresos cero (I3)',
    ingresosEfectivos: 'Ingresos efectivos (I4)',
    infiltracion: 'Historial asociado #PorEstosNo (I5)',
    reeleccion: 'Reelección (I6)',
    equipoCompleto: 'Candidatos hábiles / equipo completo (I7)',
    reinfo: 'REINFO (I8)'
  }
  const textoPesos = Object.entries(pesos)
    .filter(([k]) => k !== 'total' && etiquetasPesos[k] != null)
    .map(([k, v]) => `${etiquetasPesos[k]} ${v}%`)
    .join(', ')

  return (
    <>
      <Helmet>
        <title>Ranking de partidos — #PorEstosSi</title>
        <meta name="description" content="Tablas de valor compuesto: ranking 1–35 y porcentaje sobre 100. Partidos descartados en los indicadores se muestran en gris." />
      </Helmet>
      <div className="page">
        <h1>Ranking de partidos</h1>
        <p className="page-subtitle">
          Valor compuesto según pesos: {textoPesos}.
          <br />
          Los partidos que descartaste en los indicadores se muestran en gris.
        </p>

        {partidos.length > 0 && descartadosTotal.size >= partidos.length && (
          <div className="ranking-alert ranking-alert--cero" role="alert">
            <p className="ranking-alert-text">
              Tus tolerancias indican que no aceptas a ninguno, pero eso genera un voto nulo o blanco que favorece a los #PorEstosNo.
            </p>
            <p className="ranking-alert-text">
              Reconfigura tus tolerancias para ver qué partidos podrías aceptar.
            </p>
          </div>
        )}

        <div className="ranking-tabs" role="tablist" aria-label="Mis resultados, Ranking y más">
          <button
            type="button"
            role="tab"
            aria-selected={tabActivo === 'mis-resultados'}
            aria-controls="panel-mis-resultados"
            id="tab-mis-resultados"
            className={`ranking-tab ${tabActivo === 'mis-resultados' ? 'ranking-tab-activo' : ''}`}
            onClick={() => setTabActivo('mis-resultados')}
          >
            Mis resultados
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tabActivo === 'ranking'}
            aria-controls="panel-ranking"
            id="tab-ranking"
            className={`ranking-tab ${tabActivo === 'ranking' ? 'ranking-tab-activo' : ''}`}
            onClick={() => setTabActivo('ranking')}
          >
            Ranking de partidos
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tabActivo === 'respuestas'}
            aria-controls="panel-respuestas"
            id="tab-respuestas"
            className={`ranking-tab ${tabActivo === 'respuestas' ? 'ranking-tab-activo' : ''}`}
            onClick={() => setTabActivo('respuestas')}
          >
            Respuestas
          </button>
        </div>

        {tabActivo === 'mis-resultados' && (
        <div className="card" id="panel-mis-resultados" role="tabpanel" aria-labelledby="tab-mis-resultados">
          <div className="ranking-tabla-header">
            <h2 className="ranking-tabla-titulo">Según tu prioridad: partidos que sobrevivieron tu tacha (escala 22 — 35 = óptimo)</h2>
            <div className="ranking-leyenda" aria-label="Leyenda por colores">
              <span className="ranking-leyenda-item">
                <span className="ranking-leyenda-dot ranking-leyenda-top1" aria-hidden="true" />
                Primero
              </span>
              <span className="ranking-leyenda-item">
                <span className="ranking-leyenda-dot ranking-leyenda-top5" aria-hidden="true" />
                Top 5
              </span>
            </div>
          </div>
          <div className="table-wrap">
            <table className="ranking-tabla">
              <thead>
                <tr>
                  <th scope="col">Partido</th>
                  <th scope="col">Valor compuesto</th>
                </tr>
              </thead>
              <tbody>
                {sobrevivientes35.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="ranking-sin-resultados">Ningún partido pasó tus filtros. Reconfigura tus tolerancias.</td>
                  </tr>
                ) : (
                  sobrevivientes35.map(({ nombre, valor35 }, index) => {
                    const top1 = index === 0
                    const top5 = index < 5
                    const clase = top1 ? 'ranking-top1' : top5 ? 'ranking-top5' : ''
                    return (
                      <tr key={nombre} className={clase}>
                        <td>{nombre}</td>
                        <td className="ranking-valor">{formatValor(valor35)}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {tabActivo === 'ranking' && (
        <div className="card" id="panel-ranking" role="tabpanel" aria-labelledby="tab-ranking">
          <div className="ranking-tabla-header">
            <h2 className="ranking-tabla-titulo">Ranking de partidos (escala 22 — 35 = óptimo)</h2>
            <div className="ranking-leyenda" aria-label="Leyenda por colores">
              <span className="ranking-leyenda-item">
                <span className="ranking-leyenda-dot ranking-leyenda-top1" aria-hidden="true" />
                Primero
              </span>
              <span className="ranking-leyenda-item">
                <span className="ranking-leyenda-dot ranking-leyenda-top5" aria-hidden="true" />
                Top 5
              </span>
              <span className="ranking-leyenda-item">
                <span className="ranking-leyenda-dot ranking-leyenda-descartado" aria-hidden="true" />
                Tachados
              </span>
            </div>
          </div>
          <div className="table-wrap">
            <table className="ranking-tabla">
              <thead>
                <tr>
                  <th scope="col">Partido</th>
                  <th scope="col">Valor compuesto</th>
                </tr>
              </thead>
              <tbody>
                {ordenados35.map(({ nombre, valor35 }, index) => {
                  const tachado = descartadosTotal.has(nombre)
                  const top1 = index === 0
                  const top5 = index < 5
                  const clase = [
                    tachado ? 'fila-tachado' : '',
                    top1 ? 'ranking-top1' : top5 ? 'ranking-top5' : ''
                  ].filter(Boolean).join(' ')
                  return (
                    <tr key={nombre} className={clase}>
                      <td>{nombre}</td>
                      <td className="ranking-valor">{formatValor(valor35)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {tabActivo === 'respuestas' && (
          <div className="card" id="panel-respuestas" role="tabpanel" aria-labelledby="tab-respuestas">
            <h2 className="ranking-tabla-titulo">Tus respuestas de la encuesta</h2>
            {encuestaRespuestas && Object.keys(encuestaRespuestas).some((id) => {
              const a = encuestaRespuestas[id]
              return Array.isArray(a) ? a.length > 0 : a !== '' && a != null
            }) ? (
              <ul className="ranking-respuestas-list">
                {ENCUESTA.map((block) => {
                  const ans = encuestaRespuestas[block.id]
                  const selected = block.type === 'checkbox'
                    ? (Array.isArray(ans) ? ans : [])
                    : (ans ? [ans] : [])
                  const labels = selected
                    .map((v) => block.options.find((o) => o.value === v)?.label)
                    .filter(Boolean)
                  if (labels.length === 0) return null
                  return (
                    <li key={block.id} className="ranking-respuestas-item">
                      <span className="ranking-respuestas-title">{block.title}</span>
                      <p className="ranking-respuestas-question">{block.question}</p>
                      <p className="ranking-respuestas-answer">{labels.join(', ')}</p>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="ranking-respuestas-empty">Completa la encuesta para ver un resumen de tus respuestas aquí.</p>
            )}
          </div>
        )}

        <p className="page-links page-links-ranking">
          <button
            type="button"
            className="btn"
            onClick={() => { reiniciar(); navigate('/') }}
            aria-label="Reiniciar encuesta y volver al inicio"
          >
            Reiniciar encuesta
          </button>
        </p>
      </div>
    </>
  )
}
