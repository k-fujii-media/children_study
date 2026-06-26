import { useNavigate } from 'react-router-dom'

// 戻るボタン。to を指定すればそこへ、なければ1つ前へ。
export default function BackButton({ to }: { to?: string }) {
  const navigate = useNavigate()
  return (
    <button
      className="back-button"
      aria-label="もどる"
      onClick={() => (to ? navigate(to) : navigate(-1))}
    >
      ← もどる
    </button>
  )
}
