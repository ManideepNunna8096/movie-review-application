import MovieCard from './MovieCard'

function Home() {
  return (
    <main>
      <h1>Movie Review Application</h1>

      <p>Discover movies and share your reviews.</p>

      <MovieCard
        title="Inception"
        year="2010"
        rating="8.8"
      />

      <MovieCard
        title="The Dark Knight"
        year="2008"
        rating="9.0"
      />

      <MovieCard
        title="Interstellar"
        year="2014"
        rating="8.7"
      />
    </main>
  )
}

export default Home