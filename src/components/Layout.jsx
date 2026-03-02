import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDataStore } from '../store/useDataStore'
import { TITLES, getModalTexto } from '../data/indicadorInfo'

const INDICADORES = [
  { id: '1', label: 'I1 Sentencias' },
  { id: '2', label: 'I2 Preparación' },
  { id: '3', label: 'I3 Ingresos cero' },
  { id: '4b', label: 'I4 Ingresos efectivos' },
  { id: '5', label: 'I5 Historial asociado #PorEstosNo' },
  { id: '6', label: 'I6 Reelección' },
  { id: '7', label: 'I7 Candidatos hábiles' },
  { id: '8', label: 'I8 REINFO' },
]

const PASOS = ['/intervalos', '/intervalos/indicador/1', '/intervalos/indicador/2', '/intervalos/indicador/3', '/intervalos/indicador/4b', '/intervalos/indicador/5', '/intervalos/indicador/6', '/intervalos/indicador/7', '/intervalos/indicador/8', '/ranking']

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const modo = useDataStore((s) => s.modo)
  const setModo = useDataStore((s) => s.setModo)
  const indicadores = useDataStore((s) => s.indicadores)
  const descartadosTotal = useDataStore((s) => s.descartadosTotal)
  const totalPartidos = indicadores?.partidos?.length ?? 0
  const tachados = descartadosTotal?.size ?? 0
  const restantes = totalPartidos - tachados
  const infoIndicadorId = useDataStore((s) => s.infoIndicadorId)
  const setInfoIndicadorId = useDataStore((s) => s.setInfoIndicadorId)
  const ambito = useDataStore((s) => s.ambito)

  const tituloAmbito = ambito === 'regional' ? 'SENADO REGIONAL 2026' : ambito === 'nacional' ? 'SENADO NACIONAL 2026' : 'Elige el ámbito'
  const pasoActual = PASOS.indexOf(location.pathname)
  const tieneAnterior = pasoActual > 0
  const tieneSiguiente = pasoActual >= 0 && pasoActual < PASOS.length - 1
  const pathAnterior = tieneAnterior ? PASOS[pasoActual - 1] : null
  const pathSiguiente = tieneSiguiente ? PASOS[pasoActual + 1] : null

  const tituloModal = infoIndicadorId ? (TITLES[infoIndicadorId] || `Indicador ${infoIndicadorId}`) : ''

  return (
    <>
      <a href="#main" className="skip-link">
        Saltar al contenido
      </a>

      {/* Barra superior: solo logo. Botones y contador van en la barra inferior */}
      <header className="app-topbar">
        <Link to="/intervalos" className="app-logo">
          #PorEstosSi — indicadores por intervalos — {tituloAmbito}
        </Link>
      </header>

      <div className="app-body">
        {/* Nav lateral */}
        <aside className="app-sidebar" aria-label="Navegación">
          <nav className="app-nav-lateral">
            <ul className="app-nav-lateral-list">
              <li>
                <Link to="/intervalos" className={location.pathname === '/intervalos' ? 'active' : ''}>
                  Inicio
                </Link>
              </li>
              {ambito && INDICADORES.map(({ id, label }) => (
                <li key={id} className="app-nav-indicador-item">
                  <Link
                    to={`/intervalos/indicador/${id}`}
                    className={location.pathname === `/intervalos/indicador/${id}` ? 'active' : ''}
                  >
                    {label}
                  </Link>
                  <button
                    type="button"
                    className="indicador-info-btn indicador-info-btn-nav"
                    onClick={(e) => { e.preventDefault(); setInfoIndicadorId(id) }}
                    aria-label={`Información: ${label}`}
                    title={`Información: ${label}`}
                  >
                    i
                  </button>
                </li>
              ))}
              {ambito && (
                <li>
                  <Link to="/ranking" className={location.pathname === '/ranking' ? 'active' : ''}>
                    Ranking
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        <main id="main" className="app-main container">
          {children}
        </main>
      </div>

      {/* Barra inferior: Anterior | restantes/tachados | Continuar; solo visible cuando hay ámbito elegido */}
      {ambito && (
      <div className="app-restantes-bar">
        <nav className="app-topbar-nav" aria-label="Recorrido por indicadores">
          {tieneAnterior ? (
            <Link to={pathAnterior} className="app-topbar-btn app-topbar-prev" title="Ir al paso anterior">
              <span className="app-topbar-btn-icon" aria-hidden="true">←</span>
              <span className="app-topbar-btn-text">Anterior</span>
            </Link>
          ) : (
            <span className="app-topbar-btn app-topbar-btn-disabled" aria-disabled="true">
              <span className="app-topbar-btn-icon" aria-hidden="true">←</span>
              <span className="app-topbar-btn-text">Anterior</span>
            </span>
          )}
          {totalPartidos > 0 ? (
            <div className="app-partidos-resumen" aria-live="polite">
              <span className="app-restantes">{restantes} restantes</span>
              <span className="app-sep">/</span>
              <span className="app-tachados">{tachados} tachados</span>
            </div>
          ) : (
            <span className="app-topbar-resumen-placeholder" aria-hidden="true">—</span>
          )}
          {tieneSiguiente ? (
            <Link to={pathSiguiente} className="app-topbar-btn app-topbar-next" title="Ir al siguiente paso">
              <span className="app-topbar-btn-text">Continuar</span>
              <span className="app-topbar-btn-icon" aria-hidden="true">→</span>
            </Link>
          ) : (
            <span className="app-topbar-btn app-topbar-btn-disabled" aria-disabled="true">
              <span className="app-topbar-btn-text">Continuar</span>
              <span className="app-topbar-btn-icon" aria-hidden="true">→</span>
            </span>
          )}
        </nav>
      </div>
      )}

      {infoIndicadorId && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
          <div className="modal-backdrop" onClick={() => setInfoIndicadorId(null)} aria-hidden="true" />
          <div className="modal-caja">
            <div className="modal-cabecera">
              <h2 id="modal-titulo" className="modal-titulo">{tituloModal}</h2>
              <button
                type="button"
                className="modal-cerrar"
                onClick={() => setInfoIndicadorId(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div className="modal-texto">
              {getModalTexto(infoIndicadorId)
                .split(/\n\n+/)
                .filter((p) => p.trim())
                .map((block, i) => {
                  const boldPhrase = 'sin considerar los que declararon S/ 0 ni valores máximos extremos'
                  const parts = block.split(boldPhrase)
                  const content = parts.length === 2
                    ? <>{parts[0]}<strong>{boldPhrase}</strong>{parts[1]}</>
                    : block
                  return (
                    <p key={i} className={block.startsWith('PR —') || block.startsWith('SE —') || block.startsWith('ETC —') || block.startsWith('ENU —') || block.startsWith('EU —') || block.startsWith('EPM —') || block.startsWith('EPD —') ? 'modal-texto-item' : ''}>
                      {content}
                    </p>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p className="app-footer-line app-footer-modos">
          <span className="app-footer-label">Cambiar de modo: </span>
          <button type="button" className="app-footer-link-btn" onClick={() => { setModo('encuesta'); navigate('/') }}>
            Modo encuesta
          </button>
        </p>
        <p className="app-footer-line">
          Herramienta informativa. Tus criterios se guardan solo en tu navegador.
          <br />
          <span className="app-footer-sep" aria-hidden="true"> · </span>
          <Link to="/metodologia">Metodología</Link>
          <span className="app-footer-sep" aria-hidden="true"> · </span>
          <Link to="/privacidad">Privacidad</Link>
        </p>
        <p className="app-footer-credit">
          Colectivo &quot;La Pelota en Nuestra Cancha&quot; — Grupo ciudadano que busca un voto informado, objetivo y responsable. Desarrollador de metodología.
        </p>
      </footer>
    </>
  )
}
