# Movie Review Application API Documentation

> **Verified from source:** `MovieController`, `ReviewController`, `MovieService`, `ReviewService`, and model classes in the current backend. The frontend uses `http://localhost:8080` directly. This document does not assume APIs that are not present.

## 1. API Basics

### What REST and JSON mean here

**REST** is a resource-oriented HTTP style. This API names movie resources under `/api/v1/movies` and review resources under `/api/v1/reviews`.

**JSON** is the data format sent between the React browser application and Spring Boot. Spring serializes Java `Movie`, `Review`, lists, and `Optional` values into HTTP response bodies; the browser parses them using `response.json()`.

| HTTP method | Meaning in this API |
|---|---|
| `GET` | Read movies or a review without changing data. |
| `POST` | Create a new review and update the movie’s review reference list. |

A **path variable** is a dynamic URL segment, such as `{imdbId}` in `/api/v1/movies/{imdbId}`. Spring reads it using `@PathVariable`.

### Base URLs and CORS

- Backend development base URL: `http://localhost:8080`
- API prefix: `/api/v1`
- Frontend development origin allowed by both controllers: `http://localhost:5173`
- CORS is configured with `@CrossOrigin(origins = "http://localhost:5173")`.

There is no authentication, API key, bearer token, cookie/session requirement, pagination, or query parameter implemented by the controllers.

### Request/response lifecycle

```text
React component -> fetch(url, options)
  -> Spring controller mapping
  -> service method
  -> MongoRepository or MongoTemplate
  -> MongoDB
  -> Java object / ResponseEntity
  -> JSON HTTP response
  -> response.json() and React state update
```

## 2. Data Shapes

### Movie

| Field | Java type | Notes |
|---|---|---|
| `id` | `ObjectId` | MongoDB primary key; serialized form depends on Jackson/Mongo configuration. |
| `imdbId` | `String` | Used for movie lookup and frontend route parameter. |
| `title` | `String` | Displayed and searched client-side. |
| `releaseDate` | `String` | Parsed client-side only when date sorting. |
| `trailerLink` | `String` | Trailer URL. |
| `poster` | `String` | Poster image URL. |
| `genres` | `List<String>` | Filtered and displayed client-side. |
| `backdrops` | `List<String>` | First is hero backdrop; all valid strings are gallery scenes. |
| `reviewIds` | `List<Review>` with `@DocumentReference` | Name suggests IDs, but the Java field is references to `Review` documents. |

### Review

| Field | Java type | Notes |
|---|---|---|
| `id` | `ObjectId` | MongoDB primary key. |
| `body` | `String` | Submitted as `reviewBody` then persisted as `body`. |

## 3. Endpoints

### GET `/api/v1/movies`

| Item | Verified behavior |
|---|---|
| Purpose | Return all Movie documents. |
| Controller | `MovieController.getAllMovies()` |
| Service/repository | `MovieService.allMovies()` -> `MovieRepository.findAll()` |
| Path parameters | None |
| Query parameters | None implemented |
| Request body | None |
| Frontend caller | `Home.jsx` inside `useEffect` |
| Success status | `200 OK` |

Example request:

```http
GET /api/v1/movies HTTP/1.1
Host: localhost:8080
Accept: application/json
```

Example response shape (representative fields from `Data/movie.json`):

```json
[
  {
    "imdbId": "tt3915174",
    "title": "Puss in Boots: The Last Wish",
    "releaseDate": "2022-12-21",
    "trailerLink": "https://www.youtube.com/watch?v=tHb7WlgyaUc",
    "poster": "https://image.tmdb.org/t/p/w500/...jpg",
    "genres": ["Animation", "Action", "Adventure", "Comedy", "Family"],
    "backdrops": ["https://image.tmdb.org/t/p/original/...jpg"],
    "reviewIds": []
  }
]
```

**Frontend handling:** Home checks `response.ok`, parses JSON, requires an array, removes non-object entries, then renders/loading/errors/no-results as appropriate. Network and non-2xx failures are caught. On Day 26, a live request returned `200` and 10 movies.

**Error scenarios:** The controller declares no custom error mapping. Database/runtime failures would use Spring’s default error handling. The frontend reports `Failed to fetch movies` for a non-2xx status and the caught message for a fetch/parse error.

### GET `/api/v1/movies/{imdbId}`

| Item | Verified behavior |
|---|---|
| Purpose | Return one movie found by its `imdbId`. |
| Controller | `MovieController.getSingleMovie(String imdbId)` |
| Service/repository | `MovieService.singleMovie()` -> `MovieRepository.findMovieByImdbId(imdbId)` |
| Path parameter | `imdbId` string, for example `tt8760708` |
| Query parameters | None implemented |
| Request body | None |
| Frontend caller | `MovieDetails.jsx` after reading `useParams().imdbId` |
| Controller success status | Always constructs `200 OK` around `Optional<Movie>` |

Example request:

```http
GET /api/v1/movies/tt8760708 HTTP/1.1
Host: localhost:8080
Accept: application/json
```

Example response shape:

```json
{
  "imdbId": "tt8760708",
  "title": "M3GAN",
  "releaseDate": "2023-01-06",
  "trailerLink": "https://www.youtube.com/watch?v=BRb4U99OU80",
  "poster": "https://image.tmdb.org/t/p/w500/xBl5AGw7HXZcv1nNXPlzGgO4Cfo.jpg",
  "genres": ["Science Fiction", "Horror", "Comedy"],
  "backdrops": ["https://image.tmdb.org/t/p/original/5kAGbi9MFAobQTVfK4kWPnIfnP0.jpg"],
  "reviewIds": []
}
```

**Important current behavior:** a non-existing `imdbId` was observed on Day 26 to return `200 OK` with the JSON body `null`, not `404`. `MovieDetails` deliberately treats a null/non-object response as `Movie not found` after JSON parsing. This works for the current frontend but is not ideal REST status design.

**Error scenarios:** network/non-2xx/JSON errors are caught by the frontend. No `@ControllerAdvice` or explicit controller error mapping exists.

### POST `/api/v1/reviews`

| Item | Verified behavior |
|---|---|
| Purpose | Create a Review document and push its ObjectId into the matching Movie’s `reviewIds` field. |
| Controller | `ReviewController.createReview(Map<String, String> payload)` |
| Service/data access | `ReviewService.createReview()` -> `ReviewRepository.insert()` then `MongoTemplate.update(Movie.class)...push(...)` |
| Path/query parameters | None |
| Required request header | `Content-Type: application/json` in the frontend |
| Request body keys | `reviewBody`, `imdbId` |
| Frontend caller | `Reviews.jsx` form submission |
| Success status | `200 OK` (the code does not return `201 Created`) |

Example request:

```http
POST /api/v1/reviews HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "reviewBody": "This is an amazing movie!",
  "imdbId": "tt0499549"
}
```

Example success response shape:

```json
{
  "id": "<MongoDB ObjectId serialization>",
  "body": "This is an amazing movie!"
}
```

The exact JSON serialization of `ObjectId` must be taken from a running backend; it is not hard-coded by these controllers. The frontend only requires `data.body` to be a string before appending the response.

**Frontend validation/handling:** The textarea has `maxLength={500}`. Whitespace-only content disables the button and is checked in the submit handler. While pending, the button says `Submitting...`. A non-2xx or malformed response yields `Failed to submit review.`

**Backend limitations:** no DTO, no bean validation, no blank/body length validation, no check that the supplied movie exists, no transaction, and no explicit error statuses are implemented. A review can be inserted before the movie reference update, so the two writes are not presented in code as an atomic transaction.

### GET `/api/v1/reviews/{reviewId}`

| Item | Verified behavior |
|---|---|
| Purpose | Look up a Review document by MongoDB ObjectId string. |
| Controller | `ReviewController.getReview(String reviewId)` |
| Service/repository | `ReviewService.getReview()` -> `ReviewRepository.findById(new ObjectId(reviewId))` |
| Path parameter | `reviewId`, expected by code to be a value accepted by `new ObjectId(reviewId)` |
| Query parameters/body | None |
| Frontend caller | **None.** The current UI obtains review objects through movie detail `reviewIds`. |
| Found status | `200 OK` |
| Empty Optional status | `404 Not Found` |

Example request:

```http
GET /api/v1/reviews/{reviewId} HTTP/1.1
Host: localhost:8080
Accept: application/json
```

Example response shape:

```json
{
  "id": "<MongoDB ObjectId serialization>",
  "body": "This is an amazing movie!"
}
```

**Important invalid-ID behavior:** `new ObjectId(reviewId)` can throw for a syntactically invalid ID before `findById` returns an Optional. Day 26 live testing of a fake review ID observed `500`; this is consistent with no explicit exception handler. A syntactically valid but absent ID follows the controller’s intended `404` branch.

## 4. Frontend-to-Endpoint Map

| Frontend area | Endpoint | Trigger | State/result |
|---|---|---|---|
| `Home.jsx` | `GET /api/v1/movies` | Initial effect | `movies`, `loading`, `error` |
| `MovieDetails.jsx` | `GET /api/v1/movies/{imdbId}` | `imdbId` effect | `movie`, `loading`, `error` |
| `Reviews.jsx` | `POST /api/v1/reviews` | Form submit | `submitting`, `message`, local `reviews` append |
| No current component | `GET /api/v1/reviews/{reviewId}` | Not used | N/A |

## 5. API Error Handling Summary

| Layer | Current behavior |
|---|---|
| Browser `fetch` | Resolves for HTTP 4xx/5xx, so frontend explicitly tests `response.ok`. Rejects for network/abort errors. |
| Home | Throws on non-OK or non-array result; displays error text. |
| Movie details | Throws on non-OK or null/non-object result; displays error text. Ignores intentional aborts. |
| Review submit | Throws on non-OK or malformed response; displays failure message and resets submitting state. |
| Backend controllers | Use `ResponseEntity`; do not have centralized exception handling. |
| CORS | Allows only local Vite origin in controller annotations. |

## 6. Interview-Safe Notes

- Say: “The API is REST-style and JSON-based, with resources under `/api/v1`.”
- Say: “The React UI currently reads reviews as part of the movie-detail response and posts new reviews separately.”
- Do **not** say: “All missing resources return 404.” Movies currently return `200` with `null` when absent, and invalid review ID format was observed as `500`.
- Do **not** say: “Review creation is transactional or validated on the server.” The current code does not show either feature.
- Do **not** say: “The API uses authentication.” It does not.
