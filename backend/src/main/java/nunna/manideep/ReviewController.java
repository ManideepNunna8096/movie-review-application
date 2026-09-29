package nunna.manideep.movies;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService service;

    @PostMapping()
    public ResponseEntity<Review> createReview(
            @RequestBody Map<String, String> payload) {

        return new ResponseEntity<>(
                service.createReview(
                        payload.get("reviewBody"),
                        payload.get("imdbId")
                ),
                HttpStatus.OK
        );
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<Review> getReview(
            @PathVariable String reviewId) {

        return service.getReview(reviewId)
                .map(review -> new ResponseEntity<>(review, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}