import { Navigate, Route, Routes } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import LevelScreen from './screens/LevelScreen'
import ActivityScreen from './screens/ActivityScreen'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/:categoryId/:levelId" element={<LevelScreen />} />
      <Route path="/:categoryId/:levelId/:activity" element={<ActivityScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
