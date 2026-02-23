import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import EncuestaLayout from './components/EncuestaLayout'
import Encuesta from './pages/Encuesta'
import Inicio from './pages/Inicio'
import Indicador from './pages/Indicador'
import Ranking from './pages/Ranking'
import Metodologia from './pages/Metodologia'
import Privacidad from './pages/Privacidad'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EncuestaLayout><Encuesta /></EncuestaLayout>} />
      <Route path="/umbrales" element={<Layout><Inicio /></Layout>} />
      <Route path="/umbrales/indicador/:id" element={<Layout><Indicador /></Layout>} />
      <Route path="/ranking" element={<EncuestaLayout><Ranking /></EncuestaLayout>} />
      <Route path="/metodologia" element={<Layout><Metodologia /></Layout>} />
      <Route path="/privacidad" element={<Layout><Privacidad /></Layout>} />
    </Routes>
  )
}
