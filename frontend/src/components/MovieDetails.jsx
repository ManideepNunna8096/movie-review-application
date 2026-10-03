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

        if (!data || typeof data !== 'object') {
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

  const genres = Array.isArray(movie?.genres) ? movie.genres : []
  const backdrops = Array.isArray(movie?.backdrops) ? movie.backdrops : []

  return (
    <main>

      {loading && <p>Loading movie...</p>}

      {error && <p>{error}</p>}

      {movie && (
        <>

          {/* Large Movie Backdrop */}

          {backdrops.length > 0 && (
            <div className="movie-backdrop">

              <img
                src={backdrops[0]}
                alt={movie.title}
              />

            </div>
          )}

          {/* Movie Details */}

          <div className="movie-details">

            <div className="movie-details-poster">

              {movie.poster ? (
                <img
                  src={movie.poster}
                  alt={movie.title}
                />
              ) : (
                <div className="movie-details-poster-placeholder">
                  Poster unavailable
                </div>
              )}

            </div>

            <div className="movie-details-info">

              <h1>{movie.title || 'Untitled movie'}</h1>

              <p>
                <strong>Release Date:</strong> {movie.releaseDate || 'Unavailable'}
              </p>

              <p>
                <strong>Genres:</strong> {genres.length > 0 ? genres.join(', ') : 'Unavailable'}
              </p>

              {movie.trailerLink ? (
                <a
                  className="trailer-button"
                  href={movie.trailerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ▶ Watch Trailer
                </a>
              ) : (
                <p>Trailer unavailable.</p>
              )}

            </div>

          </div>

          {/* Backdrop Gallery */}

          {backdrops.length > 0 && (
            <div className="backdrop-gallery">

              <h2>Scenes</h2>

              <div className="backdrop-grid">

                {backdrops.map((backdrop, index) => (
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
            key={imdbId}
            imdbId={imdbId}
            reviewIds={movie.reviewIds}
          />

        </>
      )}

    </main>
  )
}

export default MovieDetails
