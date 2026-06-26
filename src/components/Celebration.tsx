import type { ReactNode } from 'react'

// レベルを最後までやりきったときのおいわい画面。
export default function Celebration({
  color,
  message,
  note,
  onAgain,
  onHome,
}: {
  color: string
  message: string
  /** 得点や進化など、追加で見せたい内容（任意）。 */
  note?: ReactNode
  onAgain: () => void
  onHome: () => void
}) {
  return (
    <div className="screen celebration" style={{ background: color }}>
      <div className="celebration-emoji">🎉</div>
      <h1 className="celebration-title">よくできました！</h1>
      <p className="celebration-message">{message}</p>
      {note && <div className="celebration-note">{note}</div>}
      <div className="celebration-buttons">
        <button className="pill-button big" onClick={onAgain}>
          もういちど
        </button>
        <button className="pill-button big light" onClick={onHome}>
          ホームへ
        </button>
      </div>
    </div>
  )
}
