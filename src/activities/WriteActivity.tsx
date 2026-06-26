import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import type { Category, Level } from '../data/types'
import { useSpeech } from '../hooks/useSpeech'
import { useProgressContext } from '../hooks/ProgressContext'
import { shuffle } from '../utils/shuffle'
import BackButton from '../components/BackButton'
import TracingCanvas from '../components/TracingCanvas'
import Celebration from '../components/Celebration'

// 「かく」アクティビティ。
// うすく表示されたお手本の文字を指やマウスでなぞって書く練習をする。
// 問題はランダムな順番で表示する。
export default function WriteActivity({ category, level }: { category: Category; level: Level }) {
  const navigate = useNavigate()
  const { speak } = useSpeech()
  const { markDone } = useProgressContext()
  // 出題順をランダムにシャッフルして持つ（「もういちど」で並べ直す）。
  const [items, setItems] = useState(() => shuffle(level.items))
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  // なぞり書きをやりなおすためにキャンバスを作り直すキー。
  const [canvasKey, setCanvasKey] = useState(0)

  const item = items[index]
  const isLast = index === items.length - 1

  const handleNext = () => {
    markDone(level.id, item.id)
    if (isLast) {
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
      setCanvasKey((k) => k + 1)
    }
  }

  if (finished) {
    return (
      <Celebration
        color={level.color}
        message={`${level.title}を ぜんぶ かけたね！`}
        onAgain={() => {
          setItems(shuffle(level.items))
          setIndex(0)
          setFinished(false)
          setCanvasKey((k) => k + 1)
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
          {index + 1} / {items.length}
        </span>
      </div>

      <div className="write-head">
        <button
          className="round-button speak small"
          aria-label="おとをきく"
          onClick={() => speak(item.reading)}
        >
          🔊
        </button>
        <span className="write-reading">{item.reading}</span>
      </div>

      <TracingCanvas key={canvasKey} glyph={item.glyph} />

      <div className="write-controls">
        <button className="pill-button" onClick={() => setCanvasKey((k) => k + 1)}>
          けす
        </button>
        <button className="big-next-button inline" onClick={handleNext}>
          {isLast ? 'おわり 🎉' : 'できた →'}
        </button>
      </div>
    </div>
  )
}
