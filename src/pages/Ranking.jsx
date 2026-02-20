import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useDataStore } from '../store/useDataStore'

function formatValor(v) {
  if (v == null || (typeof v === 'number' && Number.isNaN(v))) return '—'
  return typeof v === 'number' && v % 1 !== 0 ? v.toFixed(2) : String(v)
}

export default function Ranking() {
  const [tabActivo, setTabActivo] = useState('ranking')
  const ranking = useDataStore((s) => s.ranking)
  const descartadosTotal = useDataStore((s) => s.descartadosTotal)
  const reiniciar = useDataStore((s) => s.reiniciar)

  if (!ranking) {
    return (
      <>
        <Helmet><title>Ranking de partidos — Por qué sí</title></Helmet>
        <div className="page">
          <h1>Ranking de partidos</h1>
          <div className="card"><p>Cargando datos…</p></div>
          <p className="page-links"><Link to="/" className="btn btn-secondary">Volver al inicio</Link></p>
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
        <title>Ranking de partidos — Por qué sí</title>
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

        <p className="page-links">
          <Link to="/" className="btn btn-secondary">Volver al inicio</Link>
          <Link to="/indicador/1" className="btn">Indicador 1</Link>
          {descartadosTotal?.size > 0 && (
            <button type="button" className="btn btn-outline" onClick={reiniciar} aria-label="Borrar umbrales y volver a empezar">
              Reiniciar (limpiar todo)
            </button>
          )}
        </p>
      </div>
    </>
  )
}
