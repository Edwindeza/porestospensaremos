import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { useDataStore } from './store/useDataStore.js'
import App from './App.jsx'
import './index.css'

function DataLoader({ children }) {
  useEffect(() => {
    useDataStore.getState().loadData()
  }, [])
  return children
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <DataLoader>
          <App />
        </DataLoader>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
