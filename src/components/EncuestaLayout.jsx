import { Link, useNavigate } from 'react-router-dom'
import { useDataStore } from '../store/useDataStore'

/**
 * Layout limpio solo para la encuesta: sin navbar, sin sidebar, sin barra inferior.
 * El contenido va a ancho completo y centrado.
 */
export default function EncuestaLayout({ children }) {
  const navigate = useNavigate()
  const setModo = useDataStore((s) => s.setModo)

  const goModoIntervalo = () => {
    setModo('intervalo')
    navigate('/intervalos')
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>

      <div className="encuesta-layout">
        <main id="main" className="encuesta-layout-main container">
          {children}
        </main>
        <footer className="encuesta-layout-footer">
          <p className="encuesta-layout-footer-line encuesta-layout-footer-modos">
            <span className="encuesta-layout-footer-label">Cambiar de modo: </span>
            <button type="button" className="encuesta-layout-link encuesta-layout-mode-btn" onClick={goModoIntervalo}>
              Modo intervalo
            </button>
          </p>
          <p className="encuesta-layout-footer-line">
            <Link to="/metodologia" className="encuesta-layout-link">Metodología</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/privacidad" className="encuesta-layout-link">Privacidad</Link>
          </p>
          <p className="encuesta-layout-footer-credit">
            Colectivo &quot;La Pelota en Nuestra Cancha&quot; — Herramienta informativa. Tus respuestas se guardan solo en tu navegador.
          </p>
        </footer>
      </div>
    </>
  )
}
