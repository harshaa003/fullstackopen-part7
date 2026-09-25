import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AnecdoteList from './components/AnecdoteList'
import About from './components/About'
import CreateNew from './components/CreateNew'
import Menu from './components/Menu'
import Footer from './components/Footer'

const App = () => {
  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>

        <Menu />

        <Routes>
          <Route
            path="/"
            element={<AnecdoteList />}
          />

          <Route
            path="/create"
            element={<CreateNew />}
          />

          <Route
            path="/about"
            element={<About />}
          />
        </Routes>

        <Footer />
      </div>
    </Router>
  )
}

export default App