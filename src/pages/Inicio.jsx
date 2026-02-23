import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useDataStore } from '../store/useDataStore'

export default function Inicio() {
  const reiniciar = useDataStore((s) => s.reiniciar)
  const setModo = useDataStore((s) => s.setModo)
  const descartadosTotal = useDataStore((s) => s.descartadosTotal)
  const hayAlgoQueLimpiar = descartadosTotal?.size > 0

  useEffect(() => { setModo('intervalo') }, [setModo])

  return (
    <>
      <Helmet>
        <title>#PorEstosSi — Indicadores por partido</title>
        <meta name="description" content="Explora partidos políticos según indicadores: sentencias, preparación, ingresos. Mueve la raya roja en cada indicador y quédate con los que pasan tu filtro." />
      </Helmet>
      <div className="page">
        <h1>#PorEstosSi</h1>
        <p>
          Herramienta informativa para explorar partidos según indicadores. En cada pantalla
          mueve la <strong>raya roja</strong> según tu criterio: los partidos que no pasen
          quedarán en gris en las siguientes y al final puedes ver cuáles cumplen todos tus indicadores.
        </p>
        <div className="card">
          <div className="inicio-actions">
            <Link to="/intervalos/indicador/1" className="btn">
              Comenzar por Indicador 1 (Sentencias)
            </Link>
            <Link to="/ranking" className="btn btn-secondary">
              Ver ranking
            </Link>
          </div>
          {hayAlgoQueLimpiar && (
            <p className="inicio-reiniciar-wrap">
              <button type="button" className="btn btn-outline" onClick={reiniciar} aria-label="Borrar umbrales y volver a empezar">
                Reiniciar (limpiar todo)
              </button>
            </p>
          )}
        </div>
      </div>
    </>
  )
}
