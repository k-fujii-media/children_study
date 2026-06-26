import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Category, Level } from '../data/types'
import { useSpeech } from '../hooks/useSpeech'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { useProgressContext } from '../hooks/ProgressContext'
import { usePointsContext } from '../hooks/PointsContext'
import { shuffle } from '../utils/shuffle'
import { isReadingMatch, pickHeard, toKanaScript } from '../utils/kana'
import type { KanaScript } from '../utils/kana'
import { scoreForSession } from '../utils/score'
import { monsterForPoints } from '../data/monsters'
import type { Monster } from '../data/monsters'
import BackButton from '../components/BackButton'
import Celebration from '../components/Celebration'

// このレベルはといたらポイントがもらえるか（ひらがな・カタカナだけ）。
const SCORING_LEVELS = ['hiragana', 'katakana']

// こたえ判定のじょうたい。
// idle=まだ / listening=きいているところ / correct=せいかい / wrong=ふせいかい
// unclear=うまく聞き取れなかった / denied=マイクが使えない
type JudgeState = 'idle' | 'listening' | 'correct' | 'wrong' | 'unclear' | 'denied'

// 「よむ」アクティビティ。
// 文字や単語を大きく見せ、🔊で読みをきき、🎤で声でこたえてマルバツ判定する。
// 問題はランダムな順番で表示され、最後まで進むとおいわい。
export default function ReadActivity({ category, level }: { category: Category; level: Level }) {
  const navigate = useNavigate()
  const { speak, supported } = useSpeech()
  const {
    supported: micSupported,
    listening,
    listen,
  } = useSpeechRecognition()
  const { markDone } = useProgressContext()
  const { points, addPoints } = usePointsContext()
  // 出題順をランダムにシャッフルして持つ（「もういちど」で並べ直す）。
  const [items, setItems] = useState(() => shuffle(level.items))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)
  const [judge, setJudge] = useState<JudgeState>('idle')
  const [heard, setHeard] = useState('')
  // まちがえた問題のID（最終的な判定で管理。正解しなおせば消える）。
  const [wrongIds, setWrongIds] = useState<Set<string>>(() => new Set())
  // セッション終了時にあたえた得点と、進化したモンスター（あれば）。
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null)
  const [evolvedTo, setEvolvedTo] = useState<Monster | null>(null)

  // このレベルはポイント対象か。
  const earnsPoints = SCORING_LEVELS.includes(level.id)

  const item = items[index]
  const isLast = index === items.length - 1
  const showReading = useMemo(() => item.glyph !== item.reading, [item])
  // カタカナ問題はカタカナ、ひらがな・ことば・かんじ問題はひらがなで「きこえたことば」を表示する。
  const heardScript: KanaScript = level.id === 'katakana' ? 'katakana' : 'hiragana'

  // カードが変わったら判定の表示をリセットする。
  // （問題が表示されたタイミングでは自動で読み上げない。きくときは🔊を押す）
  useEffect(() => {
    setRevealed(false)
    setJudge('idle')
    setHeard('')
  }, [item])

  const handleNext = () => {
    markDone(level.id, item.id)
    if (isLast) {
      // ひらがな・カタカナを最後までといたら得点をあたえる。
      if (earnsPoints) {
        const score = scoreForSession(wrongIds.size)
        const before = monsterForPoints(points)
        const after = monsterForPoints(points + score)
        addPoints(score)
        setEarnedPoints(score)
        if (after.stage > before.stage) setEvolvedTo(after)
      }
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  // 🎤 で声をきき、こたえの読みと照合してマルバツを出す。
  // 認識できなかったときも、必ず「もういちど」などの結果を表示してボタンを押せる状態に戻す。
  const handleListen = () => {
    setHeard('')
    setJudge('listening')
    listen(
      (candidates) => {
        const correct = isReadingMatch(candidates, item.reading)
        setHeard(toKanaScript(pickHeard(candidates, item.reading), heardScript))
        setJudge(correct ? 'correct' : 'wrong')
        // 得点計算のため、まちがえた問題を記録する（正解しなおせば消す）。
        setWrongIds((prev) => {
          const next = new Set(prev)
          if (correct) next.delete(item.id)
          else next.add(item.id)
          return next
        })
        speak(correct ? 'せいかい' : 'もういちど')
      },
      (reason) => {
        if (reason === 'not-allowed') {
          setJudge('denied')
        } else {
          setJudge('unclear')
          speak('もういちど')
        }
      },
    )
  }

  if (finished) {
    return (
      <Celebration
        color={level.color}
        message={`${level.title}を ぜんぶ よめたね！`}
        note={
          earnedPoints !== null && (
            <>
              <div className="celebration-points">⭐ {earnedPoints} てん ゲット！</div>
              {evolvedTo && (
                <div className="celebration-evolve">
                  {evolvedTo.emoji} 「{evolvedTo.name}」に しんかした！
                </div>
              )}
            </>
          )
        }
        onAgain={() => {
          setItems(shuffle(level.items))
          setIndex(0)
          setFinished(false)
          setWrongIds(new Set())
          setEarnedPoints(null)
          setEvolvedTo(null)
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
        {micSupported && (
          <button
            className={`round-button mic${listening ? ' listening' : ''}`}
            aria-label="こえでこたえる"
            disabled={listening}
            onClick={handleListen}
          >
            🎤
          </button>
        )}
        {showReading && !revealed && (
          <button className="pill-button" onClick={() => setRevealed(true)}>
            よみをみる
          </button>
        )}
      </div>

      {micSupported && judge !== 'idle' && (
        <div className={`read-judge ${judge}`}>
          {judge === 'listening' && <span>👂 こえを きいているよ…</span>}
          {judge === 'correct' && (
            <span>⭕ せいかい！{heard && `「${heard}」`}</span>
          )}
          {judge === 'wrong' && (
            <span>
              ❌ もういちど！{heard && `きこえたのは「${heard}」`}
            </span>
          )}
          {judge === 'unclear' && (
            <span>🎤 うまく きこえなかったよ。もういちど はなしてね</span>
          )}
          {judge === 'denied' && (
            <span>🎤 マイクが つかえないみたい。せっていを みてね</span>
          )}
        </div>
      )}

      <button className="big-next-button" onClick={handleNext}>
        {isLast ? 'おわり 🎉' : 'つぎへ →'}
      </button>
    </div>
  )
}
