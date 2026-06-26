import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { ProgressProvider } from './hooks/ProgressContext'
import './styles.css'

// PWA の自動更新。
// 新しいバージョンを公開したら自動で取り込み、ページを再読み込みして反映する
// （registerType: 'autoUpdate' なので更新検知時に自動リロードされる）。
// アプリを開きっぱなしでも気づけるよう、一定間隔でも更新を確認する。
const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000 // 1時間
registerSW({
  immediate: true,
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return
    setInterval(() => {
      // オフラインのときは確認しない。
      if (navigator.onLine) registration.update()
    }, UPDATE_CHECK_INTERVAL_MS)
    // タブに戻ってきたタイミングでも最新かどうか確認する。
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        registration.update()
      }
    })
  },
})

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
