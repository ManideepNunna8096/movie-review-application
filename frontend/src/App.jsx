import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Home from './components/Home'
import MovieDetails from './components/MovieDetails'

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/movies/:imdbId"
          element={<MovieDetails />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
