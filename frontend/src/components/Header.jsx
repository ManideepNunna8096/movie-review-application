import { Link } from 'react-router-dom'

function Header() {
  return (
    <header>
      <h2>Movie Review</h2>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
      </nav>
    </header>
  )
}

export default Header