import { Navigate, useParams } from 'react-router-dom'
import { findLevel } from '../data/curriculum'
import type { ActivityKind } from '../data/types'
import ReadActivity from '../activities/ReadActivity'
import WriteActivity from '../activities/WriteActivity'

// アクティビティ画面。URL の activity に応じて よむ／かく を切り替える。
export default function ActivityScreen() {
  const { categoryId, levelId, activity } = useParams()
  const { category, level } = findLevel(categoryId!, levelId!)

  if (!category || !level) return <Navigate to="/" replace />

  const kind = activity as ActivityKind
  if (!level.activities.includes(kind)) {
    return <Navigate to={`/${category.id}/${level.id}`} replace />
  }

  if (kind === 'read') return <ReadActivity category={category} level={level} />
  return <WriteActivity category={category} level={level} />
}
