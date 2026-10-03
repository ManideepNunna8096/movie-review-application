import { useState, useEffect } from 'react'
import MovieCard from './MovieCard'

function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [sortOption, setSortOption] = useState('default')

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

        if (!Array.isArray(data)) {
          throw new Error('Invalid movie data received')
        }

        setMovies(data)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    getData()
  }, [])

  // Search and genre filtering
  const filteredMovies = movies.filter((movie) => {
    const title = typeof movie.title === 'string' ? movie.title : ''
    const genres = Array.isArray(movie.genres) ? movie.genres : []
    const matchesSearch = title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesGenre =
      selectedGenre === 'All' ||
      genres.includes(selectedGenre)

    return matchesSearch && matchesGenre
  })

  // Sorting logic
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortOption) {
      case 'title-asc':
        return (a.title || '').localeCompare(b.title || '')

      case 'title-desc':
        return (b.title || '').localeCompare(a.title || '')

      case 'date-newest':
        return new Date(b.releaseDate) - new Date(a.releaseDate)

      case 'date-oldest':
        return new Date(a.releaseDate) - new Date(b.releaseDate)

      default:
        return 0
    }
  })

  // Get available genres
  const availableGenres = [
    ...new Set(
      movies.flatMap((movie) =>
        Array.isArray(movie.genres) ? movie.genres : []
      )
    )
  ].sort()

  return (
    <main>
      <h1>Movie Review Application</h1>

      <p>Discover movies and share your reviews.</p>

      <div className="movie-search">
        <input
          type="text"
          placeholder="Search movies by title..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <div className="movie-filter">
        <label htmlFor="genre">Filter by Genre:</label>

        <select
          id="genre"
          value={selectedGenre}
          onChange={(event) => setSelectedGenre(event.target.value)}
        >
          <option value="All">All Genres</option>

          {availableGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="movie-sort">
        <label htmlFor="sort">Sort by:</label>

        <select
          id="sort"
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value)}
        >
          <option value="default">Default Order</option>
          <option value="title-asc">Title: A to Z</option>
          <option value="title-desc">Title: Z to A</option>
          <option value="date-newest">Release Date: Newest First</option>
          <option value="date-oldest">Release Date: Oldest First</option>
        </select>
      </div>

      {loading && <p>Loading movies...</p>}
      {error && <p>{error}</p>}

      <div className="movie-grid">
        {sortedMovies.length > 0 ? (
          sortedMovies.map((movie) => (
            <MovieCard
              key={movie.imdbId || movie.id}
              movie={movie}
            />
          ))
        ) : (
          !loading && !error && <p>No movies found.</p>
        )}
      </div>
    </main>
  )
}

export default Home
