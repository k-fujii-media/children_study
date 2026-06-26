import { createContext, useContext, type ReactNode } from 'react'
import { usePoints } from './usePoints'

// usePoints をアプリ全体で共有するための Context。
type PointsValue = ReturnType<typeof usePoints>

const PointsContext = createContext<PointsValue | null>(null)

export function PointsProvider({ children }: { children: ReactNode }) {
  const value = usePoints()
  return <PointsContext.Provider value={value}>{children}</PointsContext.Provider>
}

export function usePointsContext(): PointsValue {
  const ctx = useContext(PointsContext)
  if (!ctx) throw new Error('usePointsContext must be used within PointsProvider')
  return ctx
}
