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

        <section className="card metodologia-section">
          <h2>Fuentes de datos</h2>
          <p>
            Los cálculos se basan en <strong>información pública</strong>: candidatos, declaraciones juradas y sentencias. Las fuentes utilizadas son:
          </p>
          <ul>
            <li><strong>REINFO</strong> — Registro de candidatos por partido y tipo de elección (Senador Nacional, Diputado, Parlamento Andino, etc.).</li>
            <li><strong>Tablas de sentencias</strong> — Totales y porcentaje por partido (candidatos con sentencia firme), alineadas con fuentes oficiales.</li>
            <li><strong>Declaraciones de ingresos</strong> — Para indicadores de ingreso (I3, I4, I4b).</li>
          </ul>
        </section>

        <section className="card metodologia-section">
          <h2>Indicadores (I1 a I8)</h2>
          <p>Cada indicador mide un aspecto distinto. El usuario fija un umbral por indicador; los partidos que no lo cumplen se marcan como descartados (acumulados en todos los indicadores).</p>
          <ul className="metodologia-indicadores">
            <li><strong>I1</strong> — Porcentaje de Candidatos Activos con Sentencia Firme.</li>
            <li><strong>I2</strong> — Índice de Preparación (IP): escala por nivel educativo (fórmula IP = PR + SE + ETC + ENU + EU + EPM + EPD; 0 a 24).</li>
            <li><strong>I3</strong> — Cantidad de Candidatos que declararon ingreso S/ 0.</li>
            <li><strong>I4b</strong> — Promedio de Ingreso Anual por Candidato (sin máx. ni reportes S/ 0).</li>
            <li><strong>I5</strong> — Índice de Infiltración de Partidos #PorEstosNo en otros partidos (fórmula ponderada por posición en lista; 0–100%).</li>
            <li><strong>I6</strong> — Cantidad de Congresistas que buscan Reelección.</li>
            <li><strong>I7</strong> — Cantidad de Candidatos al Senado Nacional.</li>
            <li><strong>I8</strong> — Índice de Presencia de Candidatos en REINFO.</li>
          </ul>
        </section>

        <section className="card metodologia-section">
          <h2>Fórmulas de cálculo</h2>
          <p>
            Las fórmulas detalladas del <strong>Índice de Preparación (IP)</strong> y del <strong>Índice de Infiltración (IF)</strong> (#PorEstosNo), así como los pesos del valor compuesto para el ranking, están documentadas en el README del proyecto.
          </p>
        </section>

        <section className="card metodologia-section">
          <p style={{ margin: 0 }}>
            Esta es una <strong>herramienta informativa</strong>, no vinculante ni propaganda.
          </p>
        </section>

        <p className="page-links">
          <Link to="/" className="btn btn-secondary">Volver al inicio</Link>
        </p>
      </div>
    </>
  )
}
