function MovieCard(props) {

  return (
    <div className="movie-card">

      <img
        src={props.movie.poster}
        alt={props.movie.title}
      />

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