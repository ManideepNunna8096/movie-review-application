import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Header from './components/Header'
import Home from './components/Home'
import Movies from './components/Movies'
import MovieDetails from './components/MovieDetails'

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/movies"
          element={<Movies />}
        />

        <Route
          path="/movies/:imdbId"
          element={<MovieDetails />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App