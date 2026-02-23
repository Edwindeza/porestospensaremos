import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function Privacidad() {
  return (
    <>
      <Helmet>
        <title>Privacidad — #PorEstosSi</title>
        <meta name="description" content="Solo usamos almacenamiento local (localStorage). No recopilamos datos personales ni usamos cookies de seguimiento." />
      </Helmet>
      <div className="page">
        <h1>Privacidad</h1>
        <div className="card">
          <p style={{ marginTop: 0 }}>
            Solo usamos el <strong>almacenamiento local</strong> de tu navegador (localStorage)
            para guardar los umbrales que eliges en cada indicador y qué partidos quedaron
            descartados. Así puedes cerrar y volver más tarde sin perder tu progreso.
          </p>
          <p style={{ marginBottom: 0 }}>
            No recopilamos datos personales, no usamos cookies de seguimiento y no enviamos
            nada a ningún servidor. Todo queda en tu dispositivo.
          </p>
        </div>
        <p className="page-links">
          <Link to="/" className="btn btn-secondary">Volver al inicio</Link>
        </p>
      </div>
    </>
  )
}
