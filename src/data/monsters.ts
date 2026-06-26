// ユーザのキャラクター（モンスター）の定義。
// ポイントが STAGE_STEP（10点）たまるごとに次のモンスターへ進化する。
// 最初は「たまご」、100点で最後の10番目のモンスターになる。

export interface Monster {
  /** 進化段階（0始まり）。 */
  stage: number
  /** このモンスターになるのに必要なポイント。 */
  threshold: number
  /** 名前。 */
  name: string
  /** 見た目（絵文字）。 */
  emoji: string
  /** ひとことせつめい。 */
  description: string
}

/** 1段階進化するのに必要なポイント。 */
export const STAGE_STEP = 10

// 10種類のモンスター（たまご → どんどん強いモンスター）。
export const MONSTERS: Monster[] = [
  { stage: 0, threshold: 0, name: 'たまご', emoji: '🥚', description: 'なにが うまれるのかな？' },
  { stage: 1, threshold: 10, name: 'ぴよすけ', emoji: '🐣', description: 'たまごから かえったよ！' },
  { stage: 2, threshold: 20, name: 'ことりん', emoji: '🐤', description: 'げんき いっぱい' },
  { stage: 3, threshold: 30, name: 'とかげん', emoji: '🦎', description: 'しっぽが のびてきた' },
  { stage: 4, threshold: 40, name: 'へびすけ', emoji: '🐍', description: 'にょろにょろ つよい' },
  { stage: 5, threshold: 50, name: 'わにどん', emoji: '🐊', description: 'がぶりと かみつくぞ' },
  { stage: 6, threshold: 60, name: 'くびなが', emoji: '🦕', description: 'おおきく そだった' },
  { stage: 7, threshold: 70, name: 'がおりゅう', emoji: '🦖', description: 'するどい きば！' },
  { stage: 8, threshold: 80, name: 'どらごん', emoji: '🐉', description: 'そらを とべるよ' },
  { stage: 9, threshold: 90, name: 'キングドラゴン', emoji: '🐲', description: 'さいきょうの モンスター！' },
]

/** 最後（最強）の段階かどうか。 */
export const MAX_STAGE = MONSTERS.length - 1

/** ポイントから、いまのモンスターを返す。 */
export function monsterForPoints(points: number): Monster {
  const stage = Math.min(Math.floor(points / STAGE_STEP), MAX_STAGE)
  return MONSTERS[stage]
}

/** 次の進化までに必要なポイント。最強のときは null。 */
export function pointsToNextEvolution(points: number): number | null {
  const current = monsterForPoints(points)
  if (current.stage >= MAX_STAGE) return null
  return (current.stage + 1) * STAGE_STEP - points
}
