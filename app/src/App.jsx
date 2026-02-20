import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Indicador from './pages/Indicador'
import Ranking from './pages/Ranking'
import Metodologia from './pages/Metodologia'
import Privacidad from './pages/Privacidad'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/indicador/:id" element={<Indicador />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/metodologia" element={<Metodologia />} />
        <Route path="/privacidad" element={<Privacidad />} />
      </Routes>
    </Layout>
  )
}
