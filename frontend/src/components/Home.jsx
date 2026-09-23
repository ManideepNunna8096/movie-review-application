import MovieCard from './MovieCard'

function Home() {

  const movies = [
    {
      title: "Inception",
      year: 2010,
      rating: 8.8
    },
    {
      title: "The Dark Knight",
      year: 2008,
      rating: 9.0
    },
    {
      title: "Interstellar",
      year: 2014,
      rating: 8.7
    }
  ]

  return (
    <main>
      <h1>Movie Review Application</h1>

      <p>Discover movies and share your reviews.</p>

      {movies.map((movie) => (
        <MovieCard
          key={movie.title}
          title={movie.title}
          year={movie.year}
          rating={movie.rating}
        />
      ))}

    </main>
  )
}

export default Home