import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function Inicio() {
  return (
    <>
      <Helmet>
        <title>Por qué sí — Indicadores por partido</title>
        <meta name="description" content="Explorá partidos políticos según indicadores: sentencias, preparación, ingresos. Mové la raya roja en cada indicador y quedate con los que pasan tu filtro." />
      </Helmet>
      <div className="page">
        <h1>Por qué sí</h1>
        <p>
          Herramienta informativa para explorar partidos según indicadores. En cada pantalla
          mové la <strong>raya roja</strong> según tu criterio: los partidos que no pasen
          quedarán en gris en las siguientes y al final podés ver cuáles cumplen todos.
        </p>
        <div className="card">
          <p style={{ marginTop: 0 }}>
            <Link to="/indicador/1" className="btn">
              Comenzar por Indicador 1 (Sentencias)
            </Link>
          </p>
          <p>
            <Link to="/ranking" className="btn btn-secondary">
              Ver tablas de ranking (1–35 y sobre 100)
            </Link>
          </p>
        </div>
        <p className="page-links" style={{ marginTop: '1.5rem' }}>
          <Link to="/metodologia">Cómo se creó esta información</Link>
          <Link to="/privacidad">Privacidad</Link>
        </p>
      </div>
    </>
  )
}
