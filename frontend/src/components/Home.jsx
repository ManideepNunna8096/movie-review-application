import { useState, useEffect } from 'react'

import MovieCard from './MovieCard'

function Home() {
  const [count, setCount] = useState(0)
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {

  const getData = async () => {

    const response = await fetch(
      'http://localhost:8080/api/v1/movies'
    )

    const data = await response.json()

    setMovies(data)
  }

  getData()

  }, [])
  

  return (
    <main>
      <h1>Movie Review Application</h1>

      <p>Discover movies and share your reviews.</p>
      <p>Likes: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Like
      </button>
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