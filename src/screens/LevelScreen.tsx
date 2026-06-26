import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { findLevel } from '../data/curriculum'
import { ACTIVITY_INFO } from '../data/types'
import { useProgressContext } from '../hooks/ProgressContext'
import BackButton from '../components/BackButton'

// レベル画面。そのレベルでできるアクティビティ（よむ・かく）をえらぶ。
export default function LevelScreen() {
  const { categoryId, levelId } = useParams()
  const navigate = useNavigate()
  const { doneCount } = useProgressContext()
  const { category, level } = findLevel(categoryId!, levelId!)

  if (!category || !level) return <Navigate to="/" replace />

  const total = level.items.length
  const done = doneCount(level.id)

  return (
    <div className="screen level" style={{ background: level.color }}>
      <BackButton to="/" />
      <div className="level-hero">
        <span className="level-hero-emoji">{level.emoji}</span>
        <h1 className="level-hero-title">{level.title}</h1>
        <p className="level-hero-subtitle">{level.subtitle}</p>
        <p className="level-hero-progress">⭐ {done} / {total}</p>
      </div>

      <p className="level-prompt">なにをする？</p>
      <div className="activity-grid">
        {level.activities.map((activity) => {
          const info = ACTIVITY_INFO[activity]
          return (
            <button
              key={activity}
              className="activity-card"
              onClick={() => navigate(`/${category.id}/${level.id}/${activity}`)}
            >
              <span className="activity-card-emoji">{info.emoji}</span>
              <span className="activity-card-label">{info.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
