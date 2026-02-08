import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Docs } from './pages/Docs'
import { Events } from './pages/Events'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/events" element={<Events />} />
      </Route>
    </Routes>
  )
}
