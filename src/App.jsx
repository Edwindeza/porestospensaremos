import { Routes, Route } from 'react-router-dom'
import { useDataStore } from './store/useDataStore'
import Layout from './components/Layout'
import EncuestaLayout from './components/EncuestaLayout'
import Encuesta from './pages/Encuesta'
import Inicio from './pages/Inicio'
import Indicador from './pages/Indicador'
import Ranking from './pages/Ranking'
import Metodologia from './pages/Metodologia'
import Privacidad from './pages/Privacidad'

function RankingWithLayout() {
  const modo = useDataStore((s) => s.modo)
  return modo === 'intervalo'
    ? <Layout><Ranking /></Layout>
    : <EncuestaLayout><Ranking /></EncuestaLayout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EncuestaLayout><Encuesta /></EncuestaLayout>} />
      <Route path="/intervalos" element={<Layout><Inicio /></Layout>} />
      <Route path="/intervalos/indicador/:id" element={<Layout><Indicador /></Layout>} />
      <Route path="/ranking" element={<RankingWithLayout />} />
      <Route path="/metodologia" element={<Layout><Metodologia /></Layout>} />
      <Route path="/privacidad" element={<Layout><Privacidad /></Layout>} />
    </Routes>
  )
}
