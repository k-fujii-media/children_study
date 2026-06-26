import { useCallback, useEffect, useState } from 'react'
import { monsterForPoints, pointsToNextEvolution } from '../data/monsters'

// ユーザポイントを localStorage に保存するフック。
// ポイントによっていまのモンスター（キャラクター）が決まる。

const STORAGE_KEY = 'children-study:points:v1'

function load(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const n = raw != null ? Number(raw) : 0
    return Number.isFinite(n) && n >= 0 ? n : 0
  } catch {
    return 0
  }
}

function save(points: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(points))
  } catch {
    // 保存できなくても学習は続けられるので無視する。
  }
}

export function usePoints() {
  const [points, setPoints] = useState<number>(load)

  useEffect(() => {
    save(points)
  }, [points])

  /** ポイントを足す。 */
  const addPoints = useCallback((amount: number) => {
    setPoints((p) => p + amount)
  }, [])

  return {
    points,
    addPoints,
    /** いまのモンスター。 */
    monster: monsterForPoints(points),
    /** 次の進化まであと何点か（最強のときは null）。 */
    toNext: pointsToNextEvolution(points),
  }
}
