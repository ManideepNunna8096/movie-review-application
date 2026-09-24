import { useState, useEffect } from 'react'

import MovieCard from './MovieCard'

function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {

    const getData = async () => {

      try {

        const response = await fetch(
          'http://localhost:8080/api/v1/movies'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }

        const data = await response.json()

        setMovies(data)
        setLoading(false)

      } catch (error) {

        setError(error.message)
        setLoading(false)

      }
    }

    getData()

  }, [])
  

  return (
    <main>
      <h1>Movie Review Application</h1>

      <p>Discover movies and share your reviews.</p>
      {loading && <p>Loading movies...</p>}
      {error && <p>{error}</p>}
      
      <div className="movie-grid">

        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbId}
            movie={movie}
          />
        ))}

      </div>

    </main>
  )
}

export default Home