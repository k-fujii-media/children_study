// レベルを最後までやりきったときのおいわい画面。
export default function Celebration({
  color,
  message,
  onAgain,
  onHome,
}: {
  color: string
  message: string
  onAgain: () => void
  onHome: () => void
}) {
  return (
    <div className="screen celebration" style={{ background: color }}>
      <div className="celebration-emoji">🎉</div>
      <h1 className="celebration-title">よくできました！</h1>
      <p className="celebration-message">{message}</p>
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
