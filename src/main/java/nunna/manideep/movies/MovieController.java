package nunna.manideep.movies;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/movies")
public class MovieController{
    @GetMapping
    public ResponseEntity<String> allMovies(){
        return new ResponseEntity<String>( "All Movies!",HttpStatus.OK); 
    }
}