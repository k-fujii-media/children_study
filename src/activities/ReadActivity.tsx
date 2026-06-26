import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Category, Level } from '../data/types'
import { useSpeech } from '../hooks/useSpeech'
import { useProgressContext } from '../hooks/ProgressContext'
import BackButton from '../components/BackButton'
import Celebration from '../components/Celebration'

// 「よむ」アクティビティ。
// 文字や単語を大きく見せ、🔊で読みをきき、めくって すすむ。最後まで進むとおいわい。
export default function ReadActivity({ category, level }: { category: Category; level: Level }) {
  const navigate = useNavigate()
  const { speak, supported } = useSpeech()
  const { markDone } = useProgressContext()
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)

  const item = level.items[index]
  const isLast = index === level.items.length - 1
  const showReading = useMemo(() => item.glyph !== item.reading, [item])

  // カードが変わったら自動で読み上げる。
  useEffect(() => {
    setRevealed(false)
    speak(item.reading)
  }, [item, speak])

  const handleNext = () => {
    markDone(level.id, item.id)
    if (isLast) {
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  if (finished) {
    return (
      <Celebration
        color={level.color}
        message={`${level.title}を ぜんぶ よめたね！`}
        onAgain={() => {
          setIndex(0)
          setFinished(false)
        }}
        onHome={() => navigate('/')}
      />
    )
  }

  return (
    <div className="screen activity" style={{ background: level.color }}>
      <div className="activity-top">
        <BackButton to={`/${category.id}/${level.id}`} />
        <span className="activity-counter">
          {index + 1} / {level.items.length}
        </span>
      </div>

      <div className="read-card" onClick={() => speak(item.reading)}>
        {item.hint && <span className="read-hint">{item.hint}</span>}
        <span className="read-glyph">{item.glyph}</span>
        {showReading && (
          <span className="read-reading">{revealed ? item.reading : '　'}</span>
        )}
      </div>

      <div className="read-controls">
        <button
          className="round-button speak"
          aria-label="おとをきく"
          disabled={!supported}
          onClick={() => speak(item.reading)}
        >
          🔊
        </button>
        {showReading && !revealed && (
          <button className="pill-button" onClick={() => setRevealed(true)}>
            よみをみる
          </button>
        )}
      </div>

      <button className="big-next-button" onClick={handleNext}>
        {isLast ? 'おわり 🎉' : 'つぎへ →'}
      </button>
    </div>
  )
}
