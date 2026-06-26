import { usePointsContext } from '../hooks/PointsContext'
import { STAGE_STEP } from '../data/monsters'

// トップページに表示するユーザのキャラクター。
// いまのモンスター・もっているポイント・つぎの進化までのゲージを見せる。
export default function CharacterCard() {
  const { points, monster, toNext } = usePointsContext()

  // いまの段階のなかでどれだけ進んだか（0〜STAGE_STEP）。
  const inStage = toNext === null ? STAGE_STEP : STAGE_STEP - toNext
  const ratio = Math.min(1, inStage / STAGE_STEP)

  return (
    <section className="character-card">
      <div className="character-emoji">{monster.emoji}</div>
      <div className="character-info">
        <div className="character-name">{monster.name}</div>
        <div className="character-desc">{monster.description}</div>
        <div className="character-points">⭐ {points} てん</div>
        <div className="evo-bar">
          <div className="evo-bar-fill" style={{ width: `${ratio * 100}%` }} />
        </div>
        <div className="character-next">
          {toNext === null
            ? 'さいきょうに なったよ！🎉'
            : `つぎの しんかまで あと ${toNext} てん`}
        </div>
      </div>
    </section>
  )
}
