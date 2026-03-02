import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useDataStore } from '../store/useDataStore'

export default function Inicio() {
  const navigate = useNavigate()
  const reiniciar = useDataStore((s) => s.reiniciar)
  const setModo = useDataStore((s) => s.setModo)
  const setAmbito = useDataStore((s) => s.setAmbito)
  const descartadosTotal = useDataStore((s) => s.descartadosTotal)
  const hayAlgoQueLimpiar = descartadosTotal?.size > 0

  useEffect(() => { setModo('intervalo') }, [setModo])

  const loadData = useDataStore((s) => s.loadData)

  const goAmbito = (ambito) => {
    setAmbito(ambito)
    loadData().then(() => navigate('/intervalos/indicador/1'))
  }

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
          <p className="inicio-elegir-ambito">Elige el ámbito:</p>
          <div className="inicio-actions inicio-actions-ambito">
            <button type="button" className="btn" onClick={() => goAmbito('nacional')}>
              SENADO NACIONAL
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => goAmbito('regional')}>
              SENADO REGIONAL
            </button>
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
