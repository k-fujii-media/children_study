// 「よむ」セッションの得点計算。
// ひらがな・カタカナの問題を全問といたときにポイントをあたえる。
// 全問正解で5点、1問まちがえるごとに−1点。ただし全問といたら最低でも1点はもらえる。
export const PERFECT_SCORE = 5

export function scoreForSession(wrongCount: number): number {
  return Math.max(1, PERFECT_SCORE - wrongCount)
}
