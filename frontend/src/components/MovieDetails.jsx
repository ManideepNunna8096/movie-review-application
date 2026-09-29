import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Reviews from './Reviews'

function MovieDetails() {

  const { imdbId } = useParams()

  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    fetch(`http://localhost:8080/api/v1/movies/${imdbId}`)
      .then(response => {

        if (!response.ok) {
          throw new Error('Failed to fetch movie')
        }

        return response.json()
      })
      .then(data => {

        if (!data) {
          throw new Error('Movie not found')
        }

        setMovie(data)
        setLoading(false)
      })
      .catch(error => {
        setError(error.message)
        setLoading(false)
      })

  }, [imdbId])

  return (
    <main>

      {loading && <p>Loading movie...</p>}

      {error && <p>{error}</p>}

      {movie && (
        <>

          {/* Large Movie Backdrop */}

          {movie.backdrops && movie.backdrops.length > 0 && (
            <div className="movie-backdrop">

              <img
                src={movie.backdrops[0]}
                alt={movie.title}
              />

            </div>
          )}

          {/* Movie Details */}

          <div className="movie-details">

            <div className="movie-details-poster">

              <img
                src={movie.poster}
                alt={movie.title}
              />

            </div>

            <div className="movie-details-info">

              <h1>{movie.title}</h1>

              <p>
                <strong>Release Date:</strong> {movie.releaseDate}
              </p>

              <p>
                <strong>Genres:</strong> {movie.genres.join(', ')}
              </p>

              <a
                className="trailer-button"
                href={movie.trailerLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                ▶ Watch Trailer
              </a>

            </div>

          </div>

          {/* Backdrop Gallery */}

          {movie.backdrops && movie.backdrops.length > 0 && (
            <div className="backdrop-gallery">

              <h2>Scenes</h2>

              <div className="backdrop-grid">

                {movie.backdrops.map((backdrop, index) => (
                  <img
                    key={index}
                    src={backdrop}
                    alt={`${movie.title} scene ${index + 1}`}
                  />
                ))}

              </div>

            </div>
          )}

          {/* Reviews */}

          <Reviews
            imdbId={imdbId}
            reviewIds={movie.reviewIds}
          />

        </>
      )}

    </main>
  )
}

export default MovieDetails