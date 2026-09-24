import { Link } from 'react-router-dom'

function MovieCard(props) {
  return (
    <div className="movie-card">
      <Link to={`/movies/${props.movie.imdbId}`}>
        <img
          src={props.movie.poster}
          alt={props.movie.title}
        />
      </Link>

      <h2>{props.movie.title}</h2>

      <p>
        Release Date: {props.movie.releaseDate}
      </p>

      <p>
        Genres: {props.movie.genres.join(', ')}
      </p>
    </div>
  )
}

export default MovieCard