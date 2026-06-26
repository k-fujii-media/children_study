import { useCallback, useEffect, useState } from 'react'

// 学習の進捗を localStorage に保存するフック。
// 「どの項目をクリアしたか」をレベルごとに記録し、ホーム画面で星の数を表示する。

const STORAGE_KEY = 'children-study:progress:v1'

// { [levelId]: itemId[] } の形でクリア済み項目を保存する。
type ProgressMap = Record<string, string[]>

function load(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProgressMap) : {}
  } catch {
    return {}
  }
}

function save(map: ProgressMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
  } catch {
    // 保存できなくても学習は続けられるので無視する。
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(load)

  useEffect(() => {
    save(progress)
  }, [progress])

  /** 1つの項目をクリア済みにする。 */
  const markDone = useCallback((levelId: string, itemId: string) => {
    setProgress((prev) => {
      const done = prev[levelId] ?? []
      if (done.includes(itemId)) return prev
      return { ...prev, [levelId]: [...done, itemId] }
    })
  }, [])

  /** あるレベルでクリアした数を返す。 */
  const doneCount = useCallback(
    (levelId: string) => progress[levelId]?.length ?? 0,
    [progress],
  )

  /** その項目がクリア済みか。 */
  const isDone = useCallback(
    (levelId: string, itemId: string) => progress[levelId]?.includes(itemId) ?? false,
    [progress],
  )

  return { markDone, doneCount, isDone }
}
