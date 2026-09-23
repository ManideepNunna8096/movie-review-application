function MovieCard(props) {
  return (
    <div className="movie-card">
      <h2>{props.title}</h2>
      <p>Year: {props.year}</p>
      <p>Rating: {props.rating}</p>
    </div>
  )
}

export default MovieCard