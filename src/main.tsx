import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import { ProgressProvider } from './hooks/ProgressContext'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* GitHub Pages などサブパス配信でも動くよう HashRouter を使う。 */}
    <HashRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </StrictMode>,
)
