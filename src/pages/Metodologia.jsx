import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function Metodologia() {
  return (
    <>
      <Helmet>
        <title>Cómo se creó esta información — #PorEstosSi</title>
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
            <li><strong>Declaraciones de ingresos</strong> — Para indicadores de ingreso (I3, I4).</li>
          </ul>
        </section>

        <section className="card metodologia-section">
          <h2>Indicadores (I1 a I8)</h2>
          <p>Cada indicador mide un aspecto distinto. El usuario fija un umbral (o un rango con dos cotas en I2 e I4); los partidos que no lo cumplen se marcan como descartados (acumulados en todos los indicadores).</p>
          <ul className="metodologia-indicadores">
            <li><strong>I1</strong> — Porcentaje de Candidatos Activos con Sentencia Firme (escala 0 a 100%).</li>
            <li><strong>I2</strong> — Índice de Preparación (IP): escala por nivel educativo (0 a 20). Cota mínima 0–8 y cota máxima 8–20; quedan fuera los que están por debajo o por encima del rango.</li>
            <li><strong>I3</strong> — Cantidad de Candidatos que declararon ingreso S/ 0.</li>
            <li><strong>I4</strong> — Promedio de Ingreso Anual por Candidato (sin máx. ni reportes S/ 0). Rango con dos cotas (mínima y máxima).</li>
            <li><strong>I5</strong> — Historial asociado #PorEstosNo (fórmula ponderada por posición en lista; 0–100%).</li>
            <li><strong>I6</strong> — Cantidad de Congresistas que buscan Reelección.</li>
            <li><strong>I7</strong> — Candidatos Hábiles al Senado Nacional (escala 0 a 30).</li>
            <li><strong>I8</strong> — Índice de Presencia de Candidatos en REINFO.</li>
          </ul>
        </section>

        <section className="card metodologia-section">
          <h2>Fórmulas de cálculo</h2>

          <div className="metodologia-formula">
            <h3>I2 — Índice de Preparación (IP)</h3>
            <p className="metodologia-formula-ecuacion">IP = PR + SE + ETC + ENU + EU + EPM + EPD</p>
            <p>El Índice de Preparación (IP) va de 0 (analfabeto) a 20 (estudios en todos los niveles).</p>
            <p><strong>Componentes y puntajes:</strong></p>
            <ul className="metodologia-formula-lista">
              <li><strong>PR</strong> — Educación Básica Primaria: 1 punto</li>
              <li><strong>SE</strong> — Educación Básica Secundaria: 1 punto</li>
              <li><strong>ETC</strong> — Estudios Técnicos completos: 2 puntos</li>
              <li><strong>ENU</strong> — Estudios No Universitarios completos: 2 puntos</li>
              <li><strong>EU</strong> — Grado de Bachiller otorgado: 3 puntos (0 si estudios completos no graduado)</li>
              <li><strong>EPM</strong> — Grado de Maestría otorgado: 5 puntos</li>
              <li><strong>EPD</strong> — Grado de Doctorado, según origen: 10 pts (universidad extranjera); 5 pts (universidad peruana, menos 3 cuestionadas); 3 pts (Univ. Cesar Vallejo, Telesup, Alas Peruanas)</li>
            </ul>
          </div>

          <div className="metodologia-formula">
            <h3>I5 — Historial asociado #PorEstosNo (IF, Índice de Infiltración)</h3>
            <p className="metodologia-formula-ecuacion">IF = ((C₀₀₋₁₀ × 3 + C₁₀₋₂₀ × 2 + C₂₀₋₃₀ × 1) / (T₀₀₋₁₀ × 3 + T₁₀₋₂₀ × 2 + T₂₀₋₃₀ × 1)) × 100</p>
            <p>El IF se expresa en porcentaje (0% a 100%).</p>
            <p><strong>Numerador (C) — Candidatos de partidos con IF = 100% por tramo en la lista:</strong></p>
            <ul className="metodologia-formula-lista">
              <li><strong>C₀₀₋₁₀</strong> — Cantidad de candidatos provenientes de partidos con IF = 100% que ocupan el número 01 a 10 en la lista</li>
              <li><strong>C₁₀₋₂₀</strong> — Cantidad de candidatos provenientes de partidos con IF = 100% que ocupan el número 10 a 20 en la lista</li>
              <li><strong>C₂₀₋₃₀</strong> — Cantidad de candidatos provenientes de partidos con IF = 100% que ocupan el número 20 a 30 en la lista</li>
            </ul>
            <p><strong>Denominador (T) — Total de candidatos por tramo en la lista:</strong></p>
            <ul className="metodologia-formula-lista">
              <li><strong>T₀₀₋₁₀</strong> — Total de candidatos entre el número 01 y 10 en la lista</li>
              <li><strong>T₁₀₋₂₀</strong> — Total de candidatos entre el número 10 y 20 en la lista</li>
              <li><strong>T₂₀₋₃₀</strong> — Total de candidatos entre el número 20 y 30 en la lista</li>
            </ul>
            <p>Los pesos 3, 2 y 1 ponderan más a los candidatos que figuran al inicio de la lista (posiciones 01–10).</p>
          </div>

          <p>
            Los pesos del valor compuesto para el ranking (Sentencias, Preparación, Historial asociado, etc.) están en la página de Ranking y en el README del proyecto.
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
