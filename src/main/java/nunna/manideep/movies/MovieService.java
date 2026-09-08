package nunna.manideep.movies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service

public class MovieService{
    @Autowired
    private MovieRepository movieRepositry;
    public List<Movie> allMovies(){
        return movieRepositry.findAll();
    }
}