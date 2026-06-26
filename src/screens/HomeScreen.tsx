import { useNavigate } from 'react-router-dom'
import { curriculum } from '../data/curriculum'
import { useProgressContext } from '../hooks/ProgressContext'

// ホーム画面。カテゴリごとにレベルのカードをならべる。
export default function HomeScreen() {
  const navigate = useNavigate()
  const { doneCount } = useProgressContext()

  return (
    <div className="screen home">
      <header className="home-header">
        <h1 className="home-title">こどもがくしゅう</h1>
        <p className="home-subtitle">よみかきをたのしくれんしゅう！</p>
      </header>

      {curriculum.map((category) => (
        <section key={category.id} className="category">
          <h2 className="category-title">
            <span className="category-emoji">{category.emoji}</span>
            {category.title}
          </h2>
          <div className="level-grid">
            {category.levels.map((level) => {
              const total = level.items.length
              const done = doneCount(level.id)
              return (
                <button
                  key={level.id}
                  className="level-card"
                  style={{ backgroundColor: level.color }}
                  onClick={() => navigate(`/${category.id}/${level.id}`)}
                >
                  <span className="level-card-emoji">{level.emoji}</span>
                  <span className="level-card-title">{level.title}</span>
                  <span className="level-card-subtitle">{level.subtitle}</span>
                  <span className="level-card-progress">
                    ⭐ {done} / {total}
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}

      <footer className="home-footer">
        <p>あたらしいレベルやカテゴリは これからふえていくよ ✨</p>
      </footer>
    </div>
  )
}
