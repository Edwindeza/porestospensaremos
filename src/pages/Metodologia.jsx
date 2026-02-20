import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function Metodologia() {
  return (
    <>
      <Helmet>
        <title>Cómo se creó esta información — Por qué sí</title>
        <meta name="description" content="Metodología, fuentes (REINFO, tablas de sentencias), fórmulas de los indicadores y aviso: herramienta informativa, no propaganda." />
      </Helmet>
      <div className="page">
        <h1>Cómo se creó esta información</h1>
        <div className="card">
          <p style={{ marginTop: 0 }}>
            Los datos son calculados a partir de información pública (candidatos, declaraciones,
            sentencias). Fuentes: <strong>REINFO</strong> (registro de candidatos por partido y
            tipo de elección) y tablas de sentencias (Total y Porcentaje por partido).
          </p>
          <p>
            Cada indicador (I1 a I7) mide un aspecto distinto; las fórmulas del Índice de
            Preparación (IP) y del Índice de Infiltración (#PorEstosNo) están documentadas
            en el README del proyecto.
          </p>
          <p style={{ marginBottom: 0 }}>
            Esta es una <strong>herramienta informativa</strong>, no vinculante ni propaganda.
          </p>
        </div>
        <p className="page-links">
          <Link to="/" className="btn btn-secondary">Volver al inicio</Link>
        </p>
      </div>
    </>
  )
}
