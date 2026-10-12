import { Link } from 'react-router-dom'

function MovieCard({ movie }) {
  const title = movie.title || 'Untitled movie'
  const genres = Array.isArray(movie.genres) ? movie.genres : []
  const poster = movie.poster ? (
    <img
      src={movie.poster}
      alt={title}
    />
  ) : (
    <div className="movie-card-poster-placeholder">
      Poster unavailable
    </div>
  )

  return (
    <div className="movie-card">
      {movie.imdbId ? (
        <Link to={`/movies/${movie.imdbId}`}>
          {poster}
        </Link>
      ) : (
        poster
      )}

      <h2>{title}</h2>

      <p>
        Release Date: {movie.releaseDate || 'Unavailable'}
      </p>

      <p>
        Genres: {genres.length > 0 ? genres.join(', ') : 'Unavailable'}
      </p>
    </div>
  )
}

export default MovieCard
