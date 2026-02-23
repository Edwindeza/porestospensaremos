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
  const [tabActivo, setTabActivo] = useState('ranking')
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
  const ordenados100 = [...partidos].sort((a, b) => (b.valor100 ?? -1) - (a.valor100 ?? -1))

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

        <div className="ranking-tabs" role="tablist" aria-label="Ranking y Porcentaje">
          <button
            type="button"
            role="tab"
            aria-selected={tabActivo === 'ranking'}
            aria-controls="panel-ranking"
            id="tab-ranking"
            className={`ranking-tab ${tabActivo === 'ranking' ? 'ranking-tab-activo' : ''}`}
            onClick={() => setTabActivo('ranking')}
          >
            Ranking
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tabActivo === 'porcentaje'}
            aria-controls="panel-porcentaje"
            id="tab-porcentaje"
            className={`ranking-tab ${tabActivo === 'porcentaje' ? 'ranking-tab-activo' : ''}`}
            onClick={() => setTabActivo('porcentaje')}
          >
            Porcentaje
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

        {tabActivo === 'ranking' && (
        <div className="card" id="panel-ranking" role="tabpanel" aria-labelledby="tab-ranking">
          <div className="ranking-tabla-header">
            <h2 className="ranking-tabla-titulo">Ranking (escala 22 — 35 = óptimo)</h2>
            <div className="ranking-leyenda" aria-label="Leyenda por colores">
              <span className="ranking-leyenda-item">
                <span className="ranking-leyenda-dot ranking-leyenda-top1" aria-hidden="true" />
                Primero
              </span>
              <span className="ranking-leyenda-item">
                <span className="ranking-leyenda-dot ranking-leyenda-siguen" aria-hidden="true" />
                Siguen
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
                  const descartado = descartadosTotal.has(nombre)
                  const top1 = index === 0
                  const siguen = !descartado
                  return (
                    <tr key={nombre} className={[descartado ? 'fila-descartada' : '', siguen ? 'fila-siguen' : '', top1 ? 'ranking-top1' : ''].filter(Boolean).join(' ')}>
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

        {tabActivo === 'porcentaje' && (
        <div className="card" id="panel-porcentaje" role="tabpanel" aria-labelledby="tab-porcentaje">
          <div className="ranking-tabla-header">
            <h2 className="ranking-tabla-titulo">Porcentaje (escala 86 — 100 = óptimo)</h2>
            <div className="ranking-leyenda" aria-label="Leyenda por colores">
              <span className="ranking-leyenda-item">
                <span className="ranking-leyenda-dot ranking-leyenda-top1" aria-hidden="true" />
                Primero
              </span>
              <span className="ranking-leyenda-item">
                <span className="ranking-leyenda-dot ranking-leyenda-siguen" aria-hidden="true" />
                Siguen
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
                {ordenados100.map(({ nombre, valor100 }, index) => {
                  const descartado = descartadosTotal.has(nombre)
                  const top1 = index === 0
                  const siguen = !descartado
                  return (
                    <tr key={nombre} className={[descartado ? 'fila-descartada' : '', siguen ? 'fila-siguen' : '', top1 ? 'ranking-top1' : ''].filter(Boolean).join(' ')}>
                      <td>{nombre}</td>
                      <td className="ranking-valor">{formatValor(valor100)}</td>
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
