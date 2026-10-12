# Movie Review Application: Verified Project Documentation

> **Scope note.** This guide was written from the current repository source on Day 28. “Implemented” means present in code. “Proposed” means an interview-ready improvement, not a claim about the current application.

## A. Project Overview

**Project name:** Movie Review Application

**Problem statement:** A user needs a simple place to browse a curated movie collection, narrow it by title or genre, inspect one movie, view its scenes and existing reviews, and add a review.

**Objective:** Build a small full-stack web application that connects a React client to a Spring Boot REST API and MongoDB data.

**What it does today**

- Shows a movie collection at `/`.
- Fetches movies from `GET http://localhost:8080/api/v1/movies`.
- Searches titles case-insensitively, filters genres, and sorts by title or release date in the browser.
- Opens a detail route at `/movies/:imdbId`.
- Shows a poster, trailer link when present, a main backdrop, scene gallery, and reviews supplied in the movie response.
- Submits a new review to `POST /api/v1/reviews`.
- Handles loading, common request errors, empty results, and several missing-data fallbacks.

**Users and use cases:** a visitor browses movies; a visitor searches/filter/sorts; a visitor reads movie details; a visitor submits a short review. There is no authentication, user profile, rating system, administrator role, or authorization layer in this repository.

## B. Technology Stack

| Technology | What it is | Why/how it is used here | Problem it solves |
|---|---|---|---|
| JavaScript | Browser programming language | All frontend components are `.jsx`/`.js` | Interactive client behavior |
| React 19 | UI library | Function components, JSX, `useState`, `useEffect` | Declarative UI that reacts to state |
| React DOM | React browser renderer | `createRoot(...).render(...)` in `src/main.jsx` | Mounts React into `#root` |
| React Router DOM 7 | Client-side router | `BrowserRouter`, `Routes`, `Route`, `Link`, `useParams` | URL-based navigation without full reloads |
| Vite 8 | Frontend dev server/bundler | `npm run dev`, `npm run build`, React plugin | Fast local development and production bundles |
| ESLint 10 | Static JavaScript checker | `npm run lint` | Catches code-quality and React-hook issues |
| CSS | Styling language | `src/index.css` | Layout, responsive breakpoints, black/white UI |
| Java 21 | Backend language/runtime target | Maven property `java.version=21` | Runs the REST service |
| Spring Boot 4.1.1 | Java application framework | App bootstrap, MVC controllers, dependency injection | REST application setup and HTTP handling |
| Spring MVC/WebMVC | Web layer dependency | Controllers with `@GetMapping` and `@PostMapping` | Request routing and JSON responses |
| Spring Data MongoDB | Data access dependency | `MongoRepository`, `@Document`, `@DocumentReference` | Maps Java objects to MongoDB collections |
| MongoDB | Document database | `movies` and `reviews` documents | Persists movie and review data |
| MongoDB Atlas-style URI | Managed MongoDB connection style | `mongodb+srv://${...}` in properties | Connects by a DNS SRV connection string; exact provider/cluster is not otherwise verified |
| MongoTemplate | Lower-level Spring Mongo helper | Pushes a new review ObjectId into a movie’s `reviewIds` | Performs the cross-document update |
| Lombok | Compile-time boilerplate generator | `@Data`, constructors on `Movie` and `Review` | Generates getters, setters, etc. |
| Maven + Maven Wrapper | Java build/dependency tooling | `pom.xml`, `mvnw`, `mvnw.cmd` | Reproducible backend commands |
| dotenv helper | Optional backend dependency | `springboot4-dotenv` is in `pom.xml`; `.env.example` exists | Supports environment-based configuration; exact runtime loading behavior was not separately verified |

## C. High-Level Architecture

```text
Browser
  |
  | React UI, React Router, fetch()
  v
Vite frontend (normally http://localhost:5173)
  |
  | JSON over HTTP to http://localhost:8080/api/v1/...
  v
Spring Boot MVC API
  |-- MovieController -> MovieService -> MovieRepository
  |-- ReviewController -> ReviewService -> ReviewRepository/MongoTemplate
  v
MongoDB
  |-- movies collection
  `-- reviews collection
```

The frontend does not access MongoDB directly. Controllers expose HTTP endpoints, services hold application operations, repositories query MongoDB, and JSON returned by Spring becomes React state.

## D. Request and Response Flow

### Startup

1. `npm run dev` starts Vite. `index.html` supplies `<div id="root">` and a viewport meta tag.
2. `src/main.jsx` imports `index.css`, creates a React root, and renders `<App />` under `StrictMode`.
3. `App.jsx` creates a `BrowserRouter`, renders `Header`, and selects the `/` or `/movies/:imdbId` route.
4. The backend is started separately with Maven/Java. `MoviesApplication` uses `@SpringBootApplication` and reads MongoDB settings from `application.properties` and environment variables.

### Collection, search, filter, and sort

1. `Home` starts with `movies=[]`, `loading=true`, and `error=''`.
2. Its `useEffect` calls `GET /api/v1/movies` with an `AbortController` signal.
3. A non-2xx response or non-array JSON becomes an error. A valid array is cleaned to object entries and stored in state.
4. Every render derives `filteredMovies`, then copies it with `[...filteredMovies]` before sorting.
5. `MovieCard` renders one card for each result. A missing title/genre/poster has a small fallback. A missing `imdbId` avoids a broken `/movies/undefined` link.

### Clicking a movie and loading details

1. A valid card uses `<Link to={`/movies/${movie.imdbId}`}>`.
2. React Router reads `imdbId` using `useParams` in `MovieDetails`.
3. `MovieDetails` fetches `GET /api/v1/movies/{imdbId}` with cancellation support.
4. It renders a loading message until completion. `null`, malformed data, and failed requests become an error message.
5. The response drives poster, release date, genres, trailer link, backdrop hero, gallery, and `<Reviews />`.

### Reviews and submission

1. Current review display does **not** issue one GET request per review. It initializes from `movie.reviewIds` returned by the movie-detail endpoint.
2. `Review` documents are referenced from a Movie with `@DocumentReference`; Spring returns resolved review objects in the observed movie responses.
3. The textarea is controlled by `reviewBody`, limited by `maxLength={500}`, and the button is disabled while blank/whitespace-only or submitting.
4. On submit, `Reviews` sends JSON `{ reviewBody, imdbId }` to `POST /api/v1/reviews`.
5. The backend inserts `Review`, pushes its ObjectId to the matching movie’s `reviewIds`, returns the review, and the frontend appends it to local state only if it has a string `body`.

## E. Actual Folder Structure and File Guide

```text
Movie Review Application/
|-- README.md                         # Empty at inspection time
|-- Data/
|   `-- movie.json                    # Sample/import-style movie documents
|-- backend/
|   |-- .env                          # Local secrets; ignored and not documented by value
|   |-- .gitignore
|   |-- HELP.md                       # Generated Spring Boot help
|   |-- mvnw, mvnw.cmd, .mvn/wrapper/ # Maven Wrapper (Maven 3.9.16)
|   |-- pom.xml
|   `-- src/
|       |-- main/
|       |   |-- java/nunna/manideep/movies/
|       |   |   |-- MoviesApplication.java
|       |   |   |-- Movie.java, Review.java
|       |   |   |-- MovieRepository.java, MovieService.java, MovieController.java
|       |   |   `-- ReviewService.java
|       |   |-- java/nunna/manideep/ReviewController.java
|       |   |-- java/nunna/ReviewRepository.java
|       |   `-- resources/application.properties, .env.example
|       `-- test/java/nunna/manideep/movies/MoviesApplicationTests.java
`-- frontend/
    |-- package.json, package-lock.json
    |-- vite.config.js, eslint.config.js, index.html
    |-- README.md                      # Vite starter README
    |-- public/favicon.svg, icons.svg
    `-- src/
        |-- main.jsx, App.jsx, index.css
        |-- components/Header.jsx, Home.jsx, MovieCard.jsx, MovieDetails.jsx, Reviews.jsx
        `-- assets/hero.png, react.svg, vite.svg
```

| File | Responsibility and important dependencies |
|---|---|
| `frontend/src/main.jsx` | Browser entry point; imports global CSS and mounts `App` in `StrictMode`. |
| `frontend/src/App.jsx` | Declares `/` -> `Home` and `/movies/:imdbId` -> `MovieDetails`; always shows `Header`. |
| `Header.jsx` | One `Link` to the collection route. |
| `Home.jsx` | Collection fetch, loading/error states, `searchTerm`, `selectedGenre`, `sortOption`, derived filter/sort arrays. |
| `MovieCard.jsx` | Receives one `movie` prop; creates safe detail navigation and display fallbacks. |
| `MovieDetails.jsx` | Reads `imdbId`, requests one movie, normalizes genres/backdrops, composes details and reviews. |
| `Reviews.jsx` | Local review state, controlled textarea, client validation, POST request, submission feedback. |
| `index.css` | All active application CSS, including 768px/700px/480px breakpoints. |
| `backend/.../MoviesApplication.java` | Spring Boot `main` class. |
| `MovieController` / `ReviewController` | HTTP API endpoints and localhost:5173 CORS annotation. |
| `MovieService` / `ReviewService` | Business operations between controllers and MongoDB access. |
| `MovieRepository` / `ReviewRepository` | `MongoRepository` interfaces; movie repository also finds by `imdbId`. |
| `Movie.java` / `Review.java` | MongoDB document mappings. |
| `application.properties` | MongoDB database and URI placeholder configuration. |
| `Data/movie.json` | Ten sample movie records with fields used by the frontend. |
| `pom.xml` / `package.json` | Backend/frontend dependencies and scripts. |

**Repository hygiene observations:** `frontend/src/App.css` was removed during Day 27 because it was unused starter CSS. The React/Vite image assets and `public/icons.svg` have no current source imports. The backend `ReviewController.java` and `ReviewRepository.java` locations do not match their declared `nunna.manideep.movies` package path, although Java compilation can still process source files by declared package; this is a maintainability issue to check manually, not a current documented feature.

## F. Frontend Deep Dive

### React, components, JSX, props, and state

**Simple:** React builds a screen from small reusable functions. JSX looks like HTML but is JavaScript syntax. Props are inputs from a parent; state is data a component remembers.

**Technical:** `Home`, `MovieDetails`, and `Reviews` are function components. `MovieCard({ movie })` receives `movie` as a prop. `useState` returns a state value and setter; a setter triggers a re-render.

**Project examples:** `const [searchTerm, setSearchTerm] = useState('')`; `MovieCard` receives each `movie` from `sortedMovies.map(...)`.

### `useEffect`, async work, fetch, and cleanup

`useEffect` runs side effects after render. `Home` and `MovieDetails` call `fetch` inside effects because HTTP requests are side effects, not render calculations. `fetch` is asynchronous, so Home uses `async/await`; details uses `.then(...).catch(...)`. Both pass an `AbortController` signal and abort in cleanup to avoid updating state after unmount.

### Event handling and controlled inputs

`onChange={(event) => setSearchTerm(event.target.value)}` connects input value to React state. The search input, selects, and review textarea are controlled: displayed `value` comes from state and user input updates that state.

### Conditional rendering, arrays, and keys

`{loading && <p>Loading movies...</p>}` conditionally renders only when true. Ternaries select cards versus `No movies found.` `map` transforms an array into JSX; `filter` selects entries; `sort` orders entries. Keys help React identify siblings: movie cards use `imdbId`, Mongo `id`, then a malformed-data fallback; review cards currently use array indexes.

### Search/filter/sort implementation

1. `getMovieTitle` returns a string, even when an invalid response omits `title`.
2. Search compares lowercase title with lowercase `searchTerm` using `includes`.
3. Genre filter keeps all genres for `All`, otherwise uses `genres.includes(selectedGenre)`.
4. Both predicates must be true, so search and genre filtering combine with logical AND.
5. `[...filteredMovies]` makes a shallow copy before `sort`, because JavaScript `sort` mutates its array. Mutating a state-derived array makes rendering harder to reason about.
6. Sort options use `localeCompare` for titles and `new Date(...)` subtraction for dates.

### Router concepts

`BrowserRouter` watches browser URLs. `Route path="/"` selects the collection. `Route path="/movies/:imdbId"` defines a route parameter. `Link` changes URL client-side; `useParams()` returns `{ imdbId }` in `MovieDetails`.

## G. Backend Deep Dive

### Layers

```text
HTTP request -> Controller -> Service -> Repository/MongoTemplate -> MongoDB
```

- **Controller:** `MovieController` and `ReviewController` translate HTTP requests to service calls and return `ResponseEntity` values.
- **Service:** `MovieService` delegates reads; `ReviewService` inserts a review and updates a movie reference.
- **Repository:** `MongoRepository` provides methods such as `findAll`, `insert`, and `findById`; `MovieRepository` adds `findMovieByImdbId`.
- **Model/document:** `Movie` maps to `movies`; `Review` maps to `reviews`.

### Actual annotations and what they mean

| Annotation | Where | Meaning here |
|---|---|---|
| `@SpringBootApplication` | `MoviesApplication` | Enables Boot configuration, component scanning, and auto-configuration. |
| `@RestController` | Both controllers | Return response bodies, typically JSON. |
| `@RequestMapping` | Both controllers | Sets `/api/v1/movies` or `/api/v1/reviews` base paths. |
| `@GetMapping`, `@PostMapping` | Controller methods | Maps HTTP methods and paths. |
| `@PathVariable` | Detail/review GET | Reads route value into `String`. |
| `@RequestBody` | Review POST | Deserializes JSON into `Map<String, String>`. |
| `@CrossOrigin(origins = "http://localhost:5173")` | Both controllers | Allows that development frontend origin only. |
| `@Service`, `@Repository` | Services/repositories | Marks Spring-managed components. |
| `@Autowired` | Services/controllers | Field-injects dependencies. |
| `@Document`, `@Id` | Models | Maps collection and Mongo ObjectId primary key. |
| `@DocumentReference` | `Movie.reviewIds` | References Review documents rather than embedding review body in the Movie class. |
| Lombok `@Data`, constructors | Models | Generates boilerplate at compile time. |

### Error behavior actually implemented

Controllers do not contain a global exception handler or validation annotations. Movie list always returns `200` when service completes. Single-movie returns `ResponseEntity<Optional<Movie>>` with `200`; an absent movie serializes as `null` in observed testing. Review lookup maps an empty Optional to `404`; invalid ObjectId strings can throw before that mapping and were observed as `500` in Day 26 testing. Review POST returns `200`, not `201`, and has no validation for missing/blank keys at controller/service level.

## H. Database Deep Dive

MongoDB stores JSON-like **documents** in **collections**. This project uses:

| Collection | Java class | Fields verified from code |
|---|---|---|
| `movies` | `Movie` | `_id`/`id` ObjectId, `imdbId`, `title`, `releaseDate`, `trailerLink`, `poster`, `genres`, `backdrops`, `reviewIds` |
| `reviews` | `Review` | `_id`/`id` ObjectId, `body` |

`imdbId` is a string used for application-level movie lookup and frontend routing. It is not annotated as MongoDB’s primary key. `reviewIds` is named like an ID list but declared `List<Review>` with `@DocumentReference`; the service pushes `review.getId()` to MongoDB. This is a referenced one-to-many relationship: one movie can reference many reviews.

`application.properties` uses `spring.mongodb.database=${MONGO_DATABASE:movie-api-db}` and a `mongodb+srv` URI assembled from `MONGO_USER`, `MONGO_PASSWORD`, and `MONGO_CLUSTER`. The `+srv` format is compatible with MongoDB Atlas-style cluster DNS discovery. The actual database name/credentials/cluster are deliberately not included in this guide.

## I. API Architecture

The frontend uses browser `fetch` with full localhost URLs, JSON responses, and a JSON `Content-Type` for POST. The backend exposes REST-style resource paths under `/api/v1`. CORS allows `http://localhost:5173`, matching Vite’s normal development origin. No API base URL environment variable, proxy, authentication header, token, pagination, query parameter, or API version negotiation is implemented.

## J. Review System

Reviews are displayed from the `reviewIds` property of the fetched `Movie`. `Reviews` initializes an array only from valid review objects having a string `body`. A `key={imdbId}` on the component causes local review state to reset when the movie route changes.

Validation is client-side: blank/whitespace content disables the submit button and `handleSubmit` also checks `trim()`. `maxLength={500}` limits normal textarea entry. During the POST, `submitting=true` changes the label to `Submitting...` and disables submission. Non-2xx, network, JSON, or malformed-response failures show `Failed to submit review.` The component logs the caught error with `console.error` for developer diagnostics.

There is no separate loading state for review retrieval because the current frontend does not fetch reviews independently. It waits for the parent movie-detail fetch.

## K. Responsive Design

All active CSS is in `frontend/src/index.css`.

| Width rule | Current behavior |
|---|---|
| Desktop/default | Header has 40px horizontal padding; grid auto-fills approximately 262px cards; movie details use row layout; gallery has 3 columns. |
| `max-width: 768px` | Page/header spacing is reduced; details gap/backdrop height shrink; gallery uses 2 columns. |
| `max-width: 700px` | Details become a centered vertical layout; review spacing/card text/button adapt. |
| `max-width: 480px` | Header stacks; page padding decreases; card grid becomes one column; filter/sort stack; details title/backdrop/galleries adapt to phone width. |

CSS safeguards include fluid search input, `width: min(300px, 100%)` for the poster, responsive gallery columns, and `overflow-wrap: anywhere` for small detail headings.

## L. Error Handling and Fallbacks

| Situation | Actual behavior |
|---|---|
| Collection loading | `Loading movies...` |
| Collection non-2xx/network/invalid array | Error text from thrown error; no empty result message while error exists |
| Empty collection or no search/filter matches | `No movies found.` |
| Details loading | `Loading movie...` |
| Details non-2xx/network/null/malformed result | Error text, including `Movie not found` for null |
| Missing title/release date/genres | Text fallbacks (`Untitled movie`, `Unavailable`) |
| Missing poster | Text placeholder box |
| Missing trailer | `Trailer unavailable.` instead of a link |
| Missing/invalid backdrops | No backdrop/gallery is rendered |
| Invalid movie card id | Card image is not a navigable link |
| Invalid review entries | Omitted from displayed review list |
| Review blank | Submit disabled and handler has a guard |
| Review request failure | Failure message and submitting state resets |

## M. Testing: What Was Actually Performed

| Type | Verified activity | Result/status |
|---|---|---|
| Frontend static checks | `npm run lint` | Passed during Days 25-27 after changes |
| Frontend build | `npm run build` | Passed during Days 24-27 |
| Diff whitespace | `git diff --check` | Passed during Days 24-27 |
| API list request | Live `GET /api/v1/movies` | `200`, 10 movies during Day 26 |
| Valid detail request | Live GET for `tt8760708` | `200` with expected movie fields |
| Unknown movie | Live GET for `not-a-real-imdb-id` | `200` body `null`; frontend recognizes it as not found |
| Unknown review | Live GET with fake review id | Observed `500` |
| Network simulation | Request to unused localhost port | Connection refused; frontend catch paths inspected |
| Responsive UI | CSS inspected at requested breakpoints | Browser automation timed out; visual viewport verification was **not** claimed |
| Review POST | Not executed in Day 26 | Avoided creating persistent test review data |

`MoviesApplicationTests` contains only `contextLoads()`. This guide does **not** claim Maven tests were run in the documented sessions.

## N. Bugs and Fixes Recorded in This Repository Work

| Problem | Cause | Solution | Why it worked | How tested |
|---|---|---|---|---|
| Duplicate navigation concepts | `/` had Home list and `/movies` only static text | Made `/` the collection and header label `Movies`; removed unused route/component | One collection entry point, detail route preserved | Frontend lint/build |
| Mobile layout pressure | Fixed padding/cards and 3-column scenes gallery | Added 768px/480px responsive CSS | Widths stack/reflow rather than overflow | CSS inspection; no visual automation claim |
| Missing API fields could crash UI | Direct `join`, `includes`, title access | Normalized titles, genres, backdrops, reviews; added fallbacks | Render code receives safe types | Lint/build and source inspection |
| Stale request state | Effects could finish after unmount | Added `AbortController` cleanup | Intentional abort is ignored; stale completion is prevented | Lint/build/source inspection |
| Invalid card path | Missing `imdbId` interpolated as `undefined` | Only render `<Link>` when `imdbId` exists | Avoids broken route | Source inspection |
| Unused starter styling | `App.css` was not imported | Removed it during Day 27 | Eliminates dead CSS without affecting active `index.css` | Import search, lint/build |

## O. Security: Actual State and Production Improvements

**Implemented:** CORS permits only `http://localhost:5173` in both controllers. The real backend `.env` is ignored by `backend/.gitignore`; `.env.example` provides placeholders. External trailer/poster/backdrop URLs are rendered as data returned from MongoDB. Trailer uses `target="_blank"` plus `rel="noopener noreferrer"`.

**Not implemented:** authentication, authorization, user ownership, passwords, sessions, JWT/OAuth, request validation annotations, rate limiting, CSRF strategy, content moderation, HTML sanitization policy, HTTPS configuration, secrets manager, audit logging, centralized exception handling, security headers, or production CORS configuration.

**Proposed:** validate review input server-side; use DTOs; return appropriate statuses; authenticate users; restrict CORS by environment; keep secrets only in deployment secret stores; use HTTPS; validate/allowlist external media URLs; add rate limiting and observability.

## P. Performance: Current Behavior and Honest Improvements

Current collection behavior fetches every movie once and performs search/filter/sort in memory on every relevant render. The app has no pagination, caching library, debouncing, server-side query/filter, image optimization proxy, lazy loading, memoization, database index declared in code, or CDN configuration. The current small dataset makes this acceptable.

For growth: add API pagination and server-side filtering/sorting; index `imdbId` and query fields after measuring; debounce search; cache requests; virtualize long lists; use responsive image sizes/lazy loading; add request timeouts/retries thoughtfully; and monitor database/query performance.

## Q. Limitations and Future Improvements

| Current limitation | Possible future improvement |
|---|---|
| No authentication or review ownership | Accounts, JWT/session auth, edit/delete authorization |
| Review POST has no backend validation | DTO + bean validation + useful 4xx responses |
| Movie missing returns `200 null` | Return `404 Not Found` with structured error JSON |
| Invalid review id can produce `500` | Validate ObjectId and return `400`/`404` |
| No review GET used by frontend | Decide on embedded/resolved review data or stable review endpoint contract |
| No tests beyond context-load source | Unit, integration, API, and browser E2E tests |
| Hard-coded localhost frontend API URLs | Environment-based API base URL/proxy |
| No pagination/caching | Paginated API and client cache strategy |
| Generic root/frontend README files | Replace with project-specific setup docs |

## R. Deployment

**Actual deployment:** none is configured in this repository. There are no Dockerfiles, CI workflows, environment-specific frontend builds, hosting manifests, or production URLs verified from code.

**A reasonable proposed path:** build frontend with `npm run build` and host `dist` on static hosting; run Spring Boot as a Java service with environment-provided Mongo URI components; configure production CORS to the real frontend origin; store secrets in the host’s secret manager; serve HTTPS; and set the frontend API base URL through build-time/runtime configuration. These are recommendations, not current features.

## S. Git/GitHub and Configuration Hygiene

The repository has a configured GitHub `origin` remote. Root `.gitignore` ignores frontend `node_modules`, `dist`, logs, and `*.local`; backend `.gitignore` ignores `.env`, build output, and IDE artifacts. Never commit `backend/.env`, MongoDB credentials, tokens, or production URLs containing secrets. Commit `.env.example` placeholders, lockfiles, source, tests, and project-specific documentation. Use small focused commits, review diffs, and keep generated `target`/`dist` files out of source control.

## Study Summary

This is a deliberately small React/Spring Boot/MongoDB REST application. Its strongest interview story is the complete request path: controlled React inputs derive a local movie view; React Router sends a stable `imdbId` to the detail component; Spring controllers/services/repositories obtain MongoDB documents; review submission writes a review then stores its reference on the movie. Be equally ready to explain what is **not** implemented: auth, robust backend validation/statuses, independent review fetching, automated tests beyond context loading, pagination, and deployment automation.
