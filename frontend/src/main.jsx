import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { TranslationProvider } from './context/TranslationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TranslationProvider>
      <ThemeProvider>
    <App />
      </ThemeProvider>
    </TranslationProvider>
  </StrictMode>,
)
