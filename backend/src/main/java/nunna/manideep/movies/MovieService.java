package nunna.manideep.movies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepositry;

    public List<Movie> allMovies() {
        return movieRepositry.findAll();
    }

    public Optional<Movie> singleMovie(String imdbId) {
        return movieRepositry.findMovieByImdbId(imdbId);
    }
}