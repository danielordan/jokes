import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/heebo/400.css'
import '@fontsource/heebo/700.css'
import '@fontsource/assistant/400.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
