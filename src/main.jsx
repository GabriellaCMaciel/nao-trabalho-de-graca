import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fontes empacotadas com o app (nada é carregado de sites externos).
import '@fontsource/young-serif/400.css'
import '@fontsource-variable/figtree'
import App from './App.jsx'
import './styles/tokens.css'
import './styles/base.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
