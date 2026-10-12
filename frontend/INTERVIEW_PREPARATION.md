# Movie Review Application: Interview Preparation Guide

> Built from the current repository, not from an idealized version. Use the answers as a study guide and personalize only claims that are true about your own contribution.

## A-E. Project Introductions

### 30-second introduction

“I built a full-stack Movie Review Application with React and Vite on the frontend, Spring Boot on the backend, and MongoDB for storage. Users can browse movies, search by title, filter by genre, sort results, open a movie detail page, view trailers and scenes, and submit reviews. React Router handles the movie detail URL, and the frontend communicates with REST-style Spring endpoints.”

### 1-minute introduction

“The application solves a simple movie-discovery and review workflow. The React home page fetches movies from Spring Boot, then derives search, genre-filtered, and sorted results in client state. Each card navigates with an IMDb-style identifier to a details route. Spring Boot follows controller, service, and repository layers, while MongoDB stores Movie and Review documents. When a review is submitted, the service inserts the review and pushes its ObjectId into the matching movie reference list using MongoTemplate. I also added responsive CSS, loading/error/empty states, and defensive rendering for incomplete API data.”

### 2-minute explanation

“This is a small full-stack Movie Review Application. On the frontend I used React function components and React Router. `Home` calls `GET /api/v1/movies`, keeps `movies`, `loading`, `error`, search text, selected genre, and sort option in state, then uses `filter` and a copied array before `sort` to derive what the user sees. `MovieCard` receives one movie as a prop and links to `/movies/:imdbId`. `MovieDetails` reads that parameter through `useParams`, fetches one movie, and renders its poster, metadata, trailer, backdrop gallery, and reviews. `Reviews` has a controlled textarea, a 500-character browser limit, a submitting state, and posts `{ reviewBody, imdbId }`.

On the backend, `MovieController` and `ReviewController` expose `/api/v1` routes. Services contain the operations, repositories use Spring Data MongoDB, and models use `@Document`. Reviews live in a separate collection and are referenced from movies with `@DocumentReference`. I kept the UI responsive at tablet and mobile breakpoints and hardened the frontend against missing titles, images, genres, backdrops, reviews, and aborted requests. The project is intentionally small, so I would clearly explain that authentication, validation DTOs, pagination, and automated browser tests are future work.”

### 5-minute technical explanation outline

1. Start with the user flow: browse -> search/filter/sort -> details -> review submission.
2. Explain React composition: `main.jsx` mounts `App`; `App` supplies routes and `Header`; Home/details compose smaller components.
3. Explain state: Home’s collection and UI controls; details’ movie/loading/error; reviews’ local form/submission state.
4. Explain request flow: `fetch` -> Spring controller -> service -> repository/MongoDB -> JSON -> React setter.
5. Explain Mongo design: `movies` documents and `reviews` documents, connected by `@DocumentReference`/stored ObjectIds.
6. Explain error handling: `response.ok`, `null` movie fallback, loading/empty states, valid-data normalization, and `AbortController` cleanup.
7. Explain responsive CSS: default desktop, 768px tablet, 700px details/reviews, 480px phone controls/gallery.
8. Close with honesty: working small application; no authentication, server validation, pagination, deployment automation, or comprehensive automated test suite yet.

### Polished “Explain your project” answer

“I built a Movie Review Application to practice a complete React-to-Spring-Boot-to-MongoDB flow. The frontend fetches a movie collection, lets users search titles case-insensitively, filter by genres, and sort without mutating source state. React Router carries an `imdbId` into a detail page, where the app fetches one movie and shows its media and referenced reviews. The backend is layered into controllers, services, repositories, and MongoDB document models. A review POST inserts a review document and stores its ObjectId on the related movie. I focused on practical reliability too: loading/error/empty states, safe fallbacks for incomplete response fields, request cancellation, keyboard focus styles, and responsive layouts. I would next improve server-side validation, status codes, authentication, pagination, and automated testing.”

## F-G. Role and Architecture Answers

### “What was your role?”

**Repository-supported answer:** “I worked on the application’s React UI, the Spring Boot/MongoDB integration, and the reliability pass represented in this repository. That includes collection/detail/review flows, responsive CSS, API consumption, loading and error handling, and documentation/testing checks. I would adjust this wording to match the parts I personally implemented in a team setting.”

### “Explain the architecture.”

“The browser runs a Vite-served React client. React components call Spring Boot through JSON HTTP endpoints under `/api/v1`. Spring MVC controllers delegate to services; services use Spring Data repositories or MongoTemplate; MongoDB persists Movie and Review documents. The frontend never accesses MongoDB directly. CORS currently allows the local Vite origin `http://localhost:5173`.”

```text
React components -> fetch() -> Spring Controllers -> Services
       ^                                      |        |
       |                                      v        v
     JSON response <---------------- Mongo repositories / MongoTemplate -> MongoDB
```

## H. Frontend Questions (40)

Each row includes a simple answer, a technical answer, a project example, and a likely follow-up.

| # | Question | Beginner-friendly answer | Technical answer | Project example | Likely follow-up |
|---:|---|---|---|---|---|
| 1 | What is the frontend? | The part users see and use. | A React SPA rendered in the browser. | `frontend/src`. | How does it reach the backend? |
| 2 | Why React? | It builds screens from reusable pieces. | Components re-render from state/props. | Home, Card, Details, Reviews. | What is a component? |
| 3 | What is JSX? | HTML-like syntax in JavaScript. | It compiles to React element creation. | `<MovieCard movie={movie} />`. | Is it HTML? |
| 4 | What is a component? | A reusable UI function. | A function returning JSX. | `Header()` and `Reviews()`. | Props versus state? |
| 5 | What are props? | Inputs from a parent. | Read-only component arguments. | `MovieCard({ movie })`. | Can props be changed? |
| 6 | What is state? | Data a component remembers. | Reactive values managed by hooks. | `searchTerm`, `movies`. | What triggers re-render? |
| 7 | Why `useState`? | To update the screen after user/API changes. | It stores local reactive state. | `setMovies(data)`. | Why not a normal variable? |
| 8 | Why `useEffect`? | To do work after rendering. | Runs side effects by dependency lifecycle. | Collection/detail fetches. | Why not fetch in render? |
| 9 | What is a controlled input? | React owns its value. | `value` plus `onChange` binds DOM to state. | Search and review textarea. | Benefit over uncontrolled? |
| 10 | How does search work? | It compares typed text with title. | Lowercased title `includes` lowercased term. | `Home.filteredMovies`. | Is it server-side? |
| 11 | How does genre filtering work? | It keeps selected genre movies. | Array `includes`, with `All` bypass. | `selectedGenre`. | How do filters combine? |
| 12 | How do filters combine? | A movie must match both. | Logical AND returns `matchesSearch && matchesGenre`. | Home predicate. | What about no results? |
| 13 | Why copy before sort? | Sorting changes an array. | `[...filteredMovies]` prevents mutation. | `sortedMovies`. | What bugs can mutation cause? |
| 14 | What does `map` do? | Makes one output per item. | Transforms arrays into JSX nodes. | Cards and scenes. | Why a key? |
| 15 | Why use keys? | React tracks repeated items. | Stable keys preserve item identity. | `imdbId`/`id` card key. | Why avoid index? |
| 16 | What is conditional rendering? | Show UI only when needed. | JSX uses `&&` and ternaries. | Loading/error/no-results. | Example of a fallback? |
| 17 | What is a loading state? | A message while waiting. | Boolean state controls interim JSX. | `Loading movies...`. | Why important? |
| 18 | What is an empty state? | Message for no data/result. | Rendered when not loading/error and list empty. | `No movies found.` | Empty API vs no search match? |
| 19 | What is an error state? | Feedback when something fails. | Catch sets message state. | Fetch failure UI. | Does fetch reject on 404? |
| 20 | Why check `response.ok`? | HTTP failures still need handling. | Fetch resolves for 4xx/5xx. | All frontend API calls. | What does non-OK do now? |
| 21 | What is `AbortController` for? | Stops a request no longer needed. | Cleanup aborts fetch on unmount. | Home/Details effects. | Why ignore AbortError? |
| 22 | How is a missing poster handled? | A message appears instead. | Conditional JSX chooses a placeholder. | Poster fallback classes. | What about a broken URL? |
| 23 | How are missing genres handled? | Display says unavailable. | `Array.isArray` normalizes safely. | Card/details genres. | Why is this needed? |
| 24 | What is responsive design? | UI adapts to screen sizes. | CSS media queries alter layout. | 768/700/480px rules. | Give one mobile change. |
| 25 | How is the grid responsive? | Cards reflow instead of overflowing. | CSS Grid auto-fill plus phone one column. | `.movie-grid`. | Why Grid not Flex? |
| 26 | How do controls adapt on mobile? | Filters stack vertically. | 480px sets column direction/full select width. | `.movie-filter`, `.movie-sort`. | Why improves usability? |
| 27 | What is CSS `:focus-visible`? | Keyboard focus indicator. | Shows outline for keyboard interaction. | Links/trailer navigation. | Why not outline none? |
| 28 | How is a trailer opened? | User clicks its link. | Anchor uses target blank and noopener. | `trailer-button`. | Security reason for noopener? |
| 29 | Why use semantic `main`, `nav`, `header`? | They describe page areas. | Semantic landmarks aid structure/accessibility. | Header/Home markup. | What more accessibility work? |
| 30 | How are images constrained? | CSS keeps them within containers. | `object-fit`, fluid widths, gallery grid. | Poster/backdrop CSS. | Does it handle image load errors? |
| 31 | What is Vite? | Frontend tooling/dev server. | Bundles modules and runs HMR development. | `npm run dev/build`. | Why not Webpack? |
| 32 | What does `StrictMode` do? | Helps expose development issues. | Adds development checks around component tree. | `main.jsx`. | Does it change production output? |
| 33 | What does ESLint do? | Finds code problems early. | Static rule-based analysis. | `npm run lint`. | What did it catch recently? |
| 34 | How are reviews rendered? | From the movie’s review list. | Local state starts from valid `reviewIds`. | `Reviews.jsx`. | Is review GET called? |
| 35 | How is submitting UI handled? | Button changes and disables. | `submitting` state gates form. | `Submitting...`. | Why use `finally`? |
| 36 | Why validate a POST response? | Success status alone may not give usable data. | Requires `data.body` string before append. | Reviews POST handling. | What should backend validate? |
| 37 | How does detail navigation work? | URL includes the movie identifier. | Link and dynamic route parameter. | `/movies/:imdbId`. | Why not pass whole object? |
| 38 | What if `imdbId` is absent? | Card is not clickable. | Link renders conditionally. | MovieCard defensive path. | Why better than `/undefined`? |
| 39 | Where is active CSS? | In one global stylesheet. | `main.jsx` imports `index.css`. | `src/index.css`. | What happened to App.css? |
| 40 | What frontend improvement comes next? | Make larger data smoother and safer. | Env API URL, tests, caching, pagination. | Not yet implemented. | Which first and why? |

## I. JavaScript Questions (30)

| # | Question | Answer and project connection | Follow-up |
|---:|---|---|---|
| 1 | `let` vs `const`? | `const` prevents rebinding; this code uses it for state tuple variables and arrays. | Can const objects change? |
| 2 | What is an arrow function? | Compact function syntax used in handlers and array callbacks. | How does `this` differ? |
| 3 | What is a template literal? | Backtick string interpolation, used for detail route and fetch URL. | Why not concatenate? |
| 4 | What is destructuring? | Extracting values, e.g. `MovieCard({ movie })`. | Object vs array destructuring? |
| 5 | What is spread syntax? | Expands/copies iterable values; `[...filteredMovies]` copies before sorting. | Is it deep copy? |
| 6 | `map` vs `forEach`? | `map` returns a new array; JSX rendering needs it. | When use forEach? |
| 7 | What does `filter` return? | A new array of entries meeting a predicate. | Does it mutate? |
| 8 | What does `sort` do? | Orders an array in place, hence copy first. | Comparator return meaning? |
| 9 | What is `localeCompare`? | Locale-aware string comparison for title sorting. | Why not `<`? |
| 10 | `includes` use? | Checks a substring or array member. | Search vs genre example? |
| 11 | What is optional chaining? | Safely accesses nullable values. | `movie?.genres` in Details. |
| 12 | What is nullish/false fallback? | Current code uses `||` for visible string fallbacks. | When prefer `??`? |
| 13 | What is `Array.isArray`? | Safe runtime array check. | Why use before `join`? |
| 14 | Promise? | Represents future async result. | How does fetch return one? |
| 15 | async/await? | Syntax to await a Promise in Home fetch. | How catch errors? |
| 16 | `.then/.catch`? | Promise chaining style in MovieDetails. | Is it equivalent to async/await? |
| 17 | `try/catch/finally`? | Handles success/failure and resets submit state. | Why `finally`? |
| 18 | What does `fetch` reject for? | Network/abort errors, not normal HTTP errors. | Why `response.ok`? |
| 19 | What is JSON serialization? | Converts review payload object to request text. | `JSON.stringify`. |
| 20 | What is JSON parsing? | Converts response text to JS data. | `response.json()`. |
| 21 | What is a closure? | Function retaining surrounding values. | Event/effect callbacks access state. |
| 22 | Event object? | Browser event passed to handler. | `event.preventDefault()`. |
| 23 | Why prevent default? | Stops form page navigation/reload. | What would happen otherwise? |
| 24 | What is `trim`? | Removes edge whitespace. | Blank review protection. |
| 25 | What is `typeof` used for? | Runtime type guard. | Verify title/body string. |
| 26 | Why filter invalid values? | Prevent rendering crashes from malformed API data. | Movies/reviews/backdrops. |
| 27 | What is immutability? | Do not modify source state directly. | Copy before sort/append review. |
| 28 | What is `new Date` subtraction? | Numeric timestamp difference. | Release-date sorting. |
| 29 | What is `AbortController`? | Browser API to cancel fetch. | Effect cleanup. |
| 30 | What is a module import? | Imports code from another file/package. | React, router, components. |

## J. React Questions (40)

| # | Question | Answer and project connection | Follow-up |
|---:|---|---|---|
| 1 | Function component? | JS function returning JSX; all UI pieces use this style. | Class component difference? |
| 2 | Render? | React calculates UI from current state/props. | What triggers it? |
| 3 | Re-render trigger? | State setter or parent prop change. | Is DOM rebuilt fully? |
| 4 | `useState` setter? | Schedules state update and re-render. | Why not mutate state? |
| 5 | Initial state? | Value used on first mount. | Home begins `[]`, `true`, `''`. |
| 6 | `useEffect` dependency `[]`? | Runs after initial mount; cleanup on unmount. | Home collection request. |
| 7 | Dependency `[imdbId]`? | Runs when route id changes. | Details request. |
| 8 | Effect cleanup? | Function invoked before unmount/next effect. | Abort fetch. |
| 9 | Why no async effect function directly? | Effect callback should return cleanup, not Promise. | Inner async in Home. |
| 10 | Props are immutable? | Child should not change parent inputs. | MovieCard reads movie. |
| 11 | Lifting state? | Move shared state to common parent. | Not needed for current filters. |
| 12 | Derived state? | Compute from existing state rather than store duplicates. | Filtered/sorted movies. |
| 13 | Why avoid storing sorted movies? | Avoid synchronization bugs. | Derived each render. |
| 14 | Conditional `&&` risk? | Falsy left side renders nothing; numbers need care. | Loading/error booleans safe. |
| 15 | Ternary in JSX? | Chooses one UI branch. | Cards vs no results. |
| 16 | Key purpose? | Stable item identity in lists. | Movie key fields. |
| 17 | Index key drawback? | Reordering/removal can associate state incorrectly. | Reviews currently append-only but IDs would be better. |
| 18 | React Router role? | Maps URLs to components. | App routes. |
| 19 | `Link` versus `<a>`? | Link performs client navigation. | Movie cards/header. |
| 20 | `useParams`? | Reads dynamic path variables. | `imdbId`. |
| 21 | BrowserRouter? | Uses History API for browser URLs. | App wrapper. |
| 22 | StrictMode? | Dev-only checks for unsafe patterns. | main entry. |
| 23 | Controlled textarea? | State supplies value and handler updates it. | Review body. |
| 24 | Form submit handling? | `onSubmit` centralizes submit/Enter behavior. | Reviews form. |
| 25 | Disabled button condition? | Prevents invalid/duplicate submit. | blank or submitting. |
| 26 | Local review state? | Enables immediate append after POST. | `setReviews(prev => ...)`. |
| 27 | Functional state update? | Uses freshest previous value. | Review append. |
| 28 | Component `key={imdbId}`? | Forces new Reviews instance per movie id. | Resets local reviews/form. |
| 29 | What is reconciliation? | React compares old/new trees. | Keys improve list matching. |
| 30 | Why normalize API data? | UI should not call methods on wrong types. | `Array.isArray`. |
| 31 | What is a fallback UI? | Safe alternative for absent data. | Poster/trailer unavailable. |
| 32 | What is error boundary? | Catches render errors in descendants. | Not implemented. |
| 33 | What is Suspense? | Coordinates async/lazy UI boundaries. | Not implemented. |
| 34 | What is memoization? | Cache work/references across renders. | Not implemented; small dataset. |
| 35 | Why componentize cards? | Reuse consistent movie display. | `MovieCard`. |
| 36 | Why not fetch in MovieCard? | Parent owns collection/data flow. | Home fetches once. |
| 37 | How is request race avoided? | Cleanup aborts obsolete request. | Details abort controller. |
| 38 | How would you test components? | Render with mocked fetch/router and assert UI. | Proposed only. |
| 39 | How would context help? | Share app-wide values without prop drilling. | Not currently needed. |
| 40 | What React improvement next? | Query cache, tests, error boundary as needs grow. | Not implemented. |

## K. Spring Boot Questions (30)

| # | Question | Answer tied to this project | Follow-up |
|---:|---|---|---|
| 1 | What is Spring Boot? | Framework that configures/runs Java web apps. | Entry annotation? |
| 2 | Entry point? | `MoviesApplication.main` calls `SpringApplication.run`. | What does it start? |
| 3 | `@SpringBootApplication`? | Combines core Boot configuration/scanning abilities. | What packages scanned? |
| 4 | `@RestController`? | Controller whose returns become HTTP bodies. | Difference from Controller? |
| 5 | `@RequestMapping`? | Base route prefix. | Movie base path? |
| 6 | `@GetMapping`? | Maps HTTP GET. | List/detail examples? |
| 7 | `@PostMapping`? | Maps HTTP POST. | Review create route? |
| 8 | `@PathVariable`? | Reads URL segment into argument. | `imdbId`/`reviewId`. |
| 9 | `@RequestBody`? | Converts JSON request to Java value. | Review payload Map. |
| 10 | `ResponseEntity`? | Body plus status/headers container. | Controllers return it. |
| 11 | Why service layer? | Separates HTTP code from operations. | MovieService/ReviewService. |
| 12 | Why repository? | Abstracts database access. | MongoRepository interfaces. |
| 13 | Dependency injection? | Spring supplies dependencies. | `@Autowired` fields. |
| 14 | `@Service`? | Registers business component. | Both service classes. |
| 15 | `@Repository`? | Registers persistence component. | MovieRepository. |
| 16 | `@CrossOrigin`? | Controls browser cross-origin access. | Allows Vite localhost. |
| 17 | What is Lombok? | Generates boilerplate at compile time. | `@Data`, constructors. |
| 18 | `@Document`? | Maps class to Mongo collection. | movies/reviews. |
| 19 | `@Id`? | Marks Mongo identifier field. | ObjectId `id`. |
| 20 | `@DocumentReference`? | References other Mongo documents. | Movie reviews. |
| 21 | What is MongoTemplate? | Lower-level Mongo operations API. | Push review id. |
| 22 | Why MongoTemplate here? | Repository insert plus targeted update. | Criteria + Update push. |
| 23 | What does `Optional` express? | Result may be present or absent. | Movie/review lookup. |
| 24 | Current missing movie status? | 200 with null observed, due ResponseEntity Optional. | What improve? |
| 25 | Current review create status? | 200, not 201. | What is REST ideal? |
| 26 | Backend validation present? | No validation annotations/DTOs. | What add? |
| 27 | Global exceptions present? | No `@ControllerAdvice` found. | Why useful? |
| 28 | Maven role? | Builds Java/dependencies/tests. | `pom.xml` Java version? |
| 29 | DevTools role? | Runtime development dependency. | Is it production feature? |
| 30 | Dotenv role? | Optional dependency plus env example. | How protect actual .env? |

## L. MongoDB Questions (25)

| # | Question | Answer tied to this project | Follow-up |
|---:|---|---|---|
| 1 | What is MongoDB? | Document-oriented NoSQL database. | SQL difference? |
| 2 | Collection? | Group of documents. | `movies`, `reviews`. |
| 3 | Document? | JSON-like stored record. | Movie fields. |
| 4 | ObjectId? | MongoDB identifier type. | Model `id`. |
| 5 | Why MongoDB here? | Flexible movie/media arrays fit documents. | Trade-offs? |
| 6 | Movie schema? | IDs, metadata, arrays, review references. | Which route uses imdbId? |
| 7 | Review schema? | ObjectId plus body string. | Is user stored? |
| 8 | Why `imdbId`? | Stable external-style lookup/routing string. | Is it primary key? |
| 9 | What is `MongoRepository`? | Spring Data CRUD abstraction. | `findAll`. |
| 10 | Derived query method? | Method name creates query. | `findMovieByImdbId`. |
| 11 | Reference relationship? | Documents point to others. | `@DocumentReference`. |
| 12 | Embedded vs referenced? | Embed data inside parent vs store separately. | Reviews are referenced. |
| 13 | Why name `reviewIds` confusing? | Field type is `List<Review>`, not ObjectId list. | Improvement? |
| 14 | What does push update do? | Appends a value to an array. | New review ObjectId. |
| 15 | Is review creation transactional? | Not shown as transactional. | Failure risk? |
| 16 | What is Atlas? | Managed MongoDB platform. | What indicates it? |
| 17 | `mongodb+srv`? | DNS SRV connection URI format. | Where configured? |
| 18 | Where are secrets? | Real `.env` is ignored. | What variables? |
| 19 | Database name config? | `MONGO_DATABASE`, fallback `movie-api-db`. | URI components? |
| 20 | What if DB unavailable? | Backend request fails; no custom handler shown. | Frontend result? |
| 21 | Indexes declared? | None in current Java code. | Future index? |
| 22 | Pagination implemented? | No. | Why needed later? |
| 23 | Data import sample? | `Data/movie.json` contains sample movies. | Is loader code present? |
| 24 | Validation in database model? | No schema validation in code. | Improve how? |
| 25 | How scale reads? | Measure, index, paginate/cache appropriately. | Avoid premature optimization? |

## M. REST/API Questions (25)

| # | Question | Answer tied to this project | Follow-up |
|---:|---|---|---|
| 1 | What is REST? | Resource-oriented HTTP API style. | Resource paths here? |
| 2 | What is JSON? | Text data format exchanged by API. | How parsed? |
| 3 | GET semantics? | Read without intended mutation. | Movie routes. |
| 4 | POST semantics? | Create/process supplied data. | Review route. |
| 5 | HTTP 200? | Successful response. | Current create also uses it. |
| 6 | HTTP 201 ideal use? | New resource created. | Proposed for review POST. |
| 7 | HTTP 404? | Resource absent. | Review lookup’s Optional branch. |
| 8 | Current movie absent response? | 200/null observed. | Why improve? |
| 9 | HTTP 400? | Bad client request. | Invalid ObjectId candidate. |
| 10 | HTTP 500? | Unexpected server failure. | Fake review ID observed. |
| 11 | Path parameter? | Dynamic resource identifier in URL. | `imdbId`. |
| 12 | Query parameter? | Optional `?key=value`; none implemented. | Future pagination? |
| 13 | Request body? | JSON data sent with POST. | reviewBody/imdbId. |
| 14 | Content-Type? | Describes body format. | application/json. |
| 15 | Response lifecycle? | Fetch -> controller -> DB -> JSON -> state. | Where errors handled? |
| 16 | CORS? | Browser-origin access rule. | localhost:5173 allowed. |
| 17 | Why check response.ok? | Fetch does not reject normal 4xx/5xx. | Which components check? |
| 18 | What is idempotence? | Repeating request has same intended effect. | GET vs POST. |
| 19 | API versioning? | Version segment signals contract evolution. | `/api/v1`. |
| 20 | DTO? | Request/response-specific class. | Not used currently. |
| 21 | Server validation? | Enforce input correctness at API. | Not implemented. |
| 22 | Error format? | Structured error JSON convention. | Not centralized currently. |
| 23 | Authentication? | Proves caller identity. | Not implemented. |
| 24 | Pagination? | Return limited page of large results. | Not implemented. |
| 25 | How test API? | HTTP client/integration test plus status/body checks. | What was actually tested? |

## N. Project-Specific Questions (40)

| # | Question | Accurate answer |
|---:|---|---|
| 1 | Why React and Vite? | React composes stateful UI; Vite supplies dev/build tooling. |
| 2 | Why Spring Boot? | It provides MVC routing, DI, and MongoDB integration in Java. |
| 3 | Why MongoDB? | Movie media and genre arrays map naturally to documents. |
| 4 | Why React Router? | Details need a shareable URL containing the movie ID. |
| 5 | Why `imdbId` route parameter? | It is a readable, stable lookup value used by repository query. |
| 6 | How is Home loaded? | Effect fetches all movies on mount. |
| 7 | Is search server-side? | No; current loaded array is filtered in browser. |
| 8 | How is search case-insensitive? | Both title and term are lowercased. |
| 9 | What does All Genres do? | It bypasses genre restriction. |
| 10 | How are filter and search combined? | Both must match. |
| 11 | Why copy before sort? | JavaScript sort mutates arrays. |
| 12 | What sort choices exist? | Default, title ascending/descending, date newest/oldest. |
| 13 | How does card navigation work? | A Link points to `/movies/{imdbId}`. |
| 14 | How is details data requested? | `useParams` supplies ID to fetch URL. |
| 15 | How are scenes rendered? | Valid backdrop URLs map to images. |
| 16 | How is trailer handled? | Link renders only when `trailerLink` exists. |
| 17 | How are reviews loaded? | From movie detail `reviewIds`, not review GET. |
| 18 | How is a review posted? | JSON body with reviewBody and imdbId. |
| 19 | What happens while posting? | Button disables and says Submitting. |
| 20 | What prevents empty reviews? | trim guard and disabled condition. |
| 21 | What limits length? | Textarea `maxLength={500}`. |
| 22 | What happens if collection API fails? | Home catches and displays error. |
| 23 | What happens if movie missing? | Backend observed 200/null; frontend says Movie not found. |
| 24 | What happens if image field absent? | Poster fallback or omitted backdrop/gallery. |
| 25 | Why AbortController? | Avoid obsolete request state updates. |
| 26 | What responsive breakpoints exist? | 768, 700, and 480 pixels. |
| 27 | What changed at 480px? | Stacked header/filters, one-column grids, reduced spacing. |
| 28 | What was Day 24 work? | CSS responsiveness verification/improvements. |
| 29 | What was Day 25 work? | UI polish: focus/hover, spacing, typography. |
| 30 | What was Day 26 work? | API/error auditing and defensive rendering. |
| 31 | What was Day 27 work? | Cleanup, cancellation, dead CSS removal. |
| 32 | Why is `reviewIds` odd? | Name says IDs, Java field resolves Review references. |
| 33 | Is POST review transactional? | No transaction is shown. |
| 34 | Is backend input validated? | Not with DTO/bean validation in current code. |
| 35 | Is auth implemented? | No. |
| 36 | Is pagination implemented? | No. |
| 37 | Is deployment configured? | No deployment artifacts are verified. |
| 38 | What tests ran? | Frontend lint/build/diff and selected live GET API checks. |
| 39 | What tests did not run? | Browser E2E, Maven test session, live POST review in Day 26. |
| 40 | What would you improve first? | Backend validation/statuses plus automated tests. |

## O. Why Questions: Design Decisions

| Decision | Why it makes sense now | Trade-off / future |
|---|---|---|
| Keep collection at `/` | One clear browse entry point. | Label says Movies while URL remains root. |
| Use `imdbId` in URL | Readable lookup and repository query key. | Enforce uniqueness/index later. |
| Client-side search/filter/sort | Simple and fast for ten loaded movies. | Move to API for large datasets. |
| Reference reviews | Reviews are separate reusable documents. | Need robust retrieval contract/transactions. |
| `MongoTemplate` push | Precisely updates one movie array after insert. | Add atomicity/error policy later. |
| Controlled form | Enables validation, counter, and submit state. | More state code than uncontrolled form. |
| `AbortController` | Avoids stale updates from obsolete fetches. | Consider query library for retries/caching later. |
| Defensive normalization | UI should survive partial data. | Backend schema validation remains needed. |
| CSS media queries | No dependency needed for current layout. | Visual E2E tests should verify future changes. |

## P. Debugging Scenarios

| Scenario | Expected current behavior | How to debug | Likely root cause | Practical solution |
|---|---|---|---|---|
| Backend unavailable | Fetch catch displays error. | Check Network tab and port 8080. | Spring app stopped/port mismatch. | Start backend, configure API URL. |
| MongoDB unavailable | Backend request fails; no custom backend response contract. | Backend logs, env variables, URI. | Credentials/network/cluster issue. | Fix secrets/Atlas access and add handling. |
| Invalid movie ID | Current endpoint may return 200/null; UI shows Movie not found. | Inspect response body/status. | Repository Optional empty. | Backend should return 404. |
| Malformed movie response | Frontend avoids unsafe common fields; invalid top-level non-array errors. | Log/test mocked payload. | Contract drift/bad data. | DTO/schema validation and contract tests. |
| Missing image | Poster placeholder or no gallery item. | Inspect field/URL and browser image request. | Missing/bad media URL. | Validate URLs; add image error fallback. |
| Empty search | All movies matching selected genre remain. | Inspect `searchTerm` and filter predicate. | Expected empty string behavior. | No change needed. |
| Slow API | Loading message remains. | Network timing/backend logs. | Latency/database/network. | Add timeout, skeleton, cache later. |
| Duplicate movie data | Cards can show repeats. | Inspect Mongo collection/imdbId. | No uniqueness constraint visible. | Add unique index/data cleanup. |
| Review submission failure | Failure message; button re-enables. | Inspect POST request/status/body. | Backend/db/CORS/invalid response. | Improve backend validation/error payload. |

## Q. “What Would You Do If...” Scenarios (20)

1. **10,000 movies?** Add server pagination, query parameters, indexes, debounced search, and possibly list virtualization.
2. **Many users submit reviews together?** Add authentication, validation, rate limits, transactions/consistency policy, and monitoring.
3. **Need ratings?** Extend Review with rating through a validated DTO and decide aggregate strategy.
4. **Need edit/delete reviews?** Add ownership/auth and REST endpoints with authorization checks.
5. **Backend response changes?** Version/contract-test it, introduce DTOs, update frontend safely.
6. **CORS fails in production?** Configure allowed origin from environment, not hard-coded localhost.
7. **Mongo query becomes slow?** Measure first, index `imdbId` and actual query fields, paginate.
8. **Movie has 1,000 scenes?** Limit/paginate/gallery lazy-load and use thumbnails.
9. **External poster fails?** Add image `onError` fallback and perhaps trusted media proxy.
10. **User submits only spaces?** Current frontend blocks it; backend must also validate it.
11. **Review body exceeds 500 by API client?** Server validation must enforce the same rule.
12. **A route is manually changed to nonsense?** Details requests it and shows current not-found error for null response.
13. **Need accessibility audit?** Test keyboard/screen reader, labels, focus order, contrast, image alternatives.
14. **Need reliable tests?** Add unit tests, MockMvc/service integration tests, and browser E2E tests.
15. **Need observability?** Add structured logs, request IDs, health checks, error tracking, metrics.
16. **Need secure secrets?** Use host secret manager; never commit `.env`.
17. **Need offline support?** Add cache/service-worker strategy after defining stale-data policy.
18. **Need multilingual text?** Extract UI strings and use an i18n library/configuration.
19. **Need CDN delivery?** Host static assets/frontend behind CDN and optimize image strategy.
20. **Need production deployment?** Build frontend, deploy backend with env configuration/HTTPS, update CORS/base URL.

## R-T. Scaling, Security, and Database Follow-ups

### System design/scaling answer

Start by separating static frontend hosting from stateless API instances. Put MongoDB behind managed backups and monitoring. Add indexed, paginated movie queries; cache popular reads; serve resized images; add a queue only when asynchronous work exists; and use load balancing after measured demand. Protect write endpoints with user identity, validation, rate limits, and observability. These are proposals, not current architecture.

### Security follow-ups

- Current security: local-only CORS annotation, ignored backend `.env`, `noopener noreferrer` trailer link.
- Not current: login, JWT/OAuth, authorization, validation, rate limiting, HTTPS configuration, sanitizer, security headers, audit logs.
- Strong answer: “Client validation improves experience; backend validation and authorization enforce trust boundaries.”

### Database design follow-ups

- Movies have arrays for genres/backdrops and references to reviews.
- Reviews lack author, timestamp, rating, ownership, moderation, or schema constraints in current code.
- The creation flow is two writes; discuss recovery/transaction approach if consistency requirements become strict.
- Add indexes after query measurement; `imdbId` is a likely candidate because it is looked up by detail route.

## U. Final Rapid Revision

### 50 one-line facts

1. Frontend uses React 19 and Vite 8.
2. Backend targets Java 21.
3. Spring Boot parent is 4.1.1.
4. Root route `/` is the movie collection.
5. Detail route is `/movies/:imdbId`.
6. Header’s Movies link points to `/`.
7. Home fetches all movies once per mount.
8. Home uses `useState` for collection and controls.
9. Home uses `useEffect` for its request.
10. Search lowercases title and term.
11. Genre filtering uses `includes`.
12. All Genres bypasses genre restriction.
13. Search and genre predicates combine with AND.
14. Sorting copies before mutation.
15. Title sorting uses `localeCompare`.
16. Date sorting subtracts Date values.
17. Movie cards receive a `movie` prop.
18. Valid cards use a Router Link.
19. Missing imdbId avoids `/undefined` route.
20. Details reads `imdbId` with `useParams`.
21. Details fetches one movie endpoint.
22. Fetch non-2xx is manually checked with `response.ok`.
23. Fetch network failures enter catch.
24. AbortController cancels obsolete movie requests.
25. Collection has loading/error/empty UI.
26. Details has loading/error UI.
27. Missing poster gets a placeholder.
28. Missing trailer renders unavailable text.
29. Invalid backdrop values are excluded.
30. Reviews are supplied through movie `reviewIds`.
31. Frontend does not call review GET.
32. Review textarea is controlled.
33. Review textarea has a 500-char maxLength.
34. Blank review submit is blocked.
35. Submit state disables duplicate form actions.
36. POST payload has reviewBody and imdbId.
37. Backend creates review then pushes reference to movie.
38. Movies use Mongo `@Document` collection `movies`.
39. Reviews use Mongo `@Document` collection `reviews`.
40. `imdbId` is not Mongo `@Id`.
41. CORS allows localhost:5173.
42. No auth is implemented.
43. No DTO validation is implemented.
44. Unknown movie currently observed as 200/null.
45. Invalid review ID format was observed as 500.
46. CSS lives in index.css.
47. Key responsive breakpoints are 768, 700, and 480px.
48. App.css was removed as unused Day 27.
49. `npm run lint` and `npm run build` passed in documented maintenance work.
50. Browser E2E visual verification was not completed in documented sessions.

### 30 one-line interview answers

1. “React state drives what the user sees.”
2. “Effects handle HTTP work because rendering must stay pure.”
3. “I copy before sort because sort mutates arrays.”
4. “Controlled inputs make validation and UI feedback straightforward.”
5. “Route parameters make detail pages linkable and refreshable.”
6. “`response.ok` matters because fetch resolves on 4xx/5xx.”
7. “AbortController prevents obsolete requests from updating UI.”
8. “I normalize untrusted response fields before rendering.”
9. “The collection’s search/filter/sort are client-side today.”
10. “React keys give repeated elements stable identity.”
11. “Movie cards use `imdbId` as their primary stable UI key.”
12. “The backend separates controller, service, and repository concerns.”
13. “Spring dependency injection supplies those collaborators.”
14. “MongoRepository provides common CRUD methods.”
15. “MongoTemplate performs the targeted review-reference update.”
16. “Reviews are separate documents referenced by movies.”
17. “CORS currently only allows the local Vite origin.”
18. “Client validation is helpful, but server validation is still needed.”
19. “There is no authentication in the current implementation.”
20. “I would return 404 rather than 200/null for missing movie.”
21. “I would return 201 for successful review creation.”
22. “I would add DTOs to stabilize request and response contracts.”
23. “I would add pagination when the collection grows.”
24. “I would add indexes after measuring real queries.”
25. “Responsive CSS adapts grid, details, gallery, and controls.”
26. “The 480px breakpoint favors one-column, touch-friendly controls.”
27. “Lint/build checks prove static quality and bundle validity, not full UX.”
28. “Live GET API tests verified current development behavior.”
29. “I avoid claiming unimplemented security or deployment features.”
30. “My next priority is backend validation/status codes and automated tests.”

### Key technology/API/file/algorithm reminders

- **Technologies:** React, React Router, Vite, Java 21, Spring Boot, Spring Data MongoDB, MongoTemplate, Lombok, Maven, CSS.
- **APIs:** `GET /api/v1/movies`, `GET /api/v1/movies/{imdbId}`, `POST /api/v1/reviews`, `GET /api/v1/reviews/{reviewId}`.
- **Key files:** `Home.jsx`, `MovieDetails.jsx`, `Reviews.jsx`, `MovieController.java`, `ReviewService.java`, `Movie.java`, `index.css`, `application.properties`.
- **Key algorithms:** lowercase title search; AND-combined genre filter; copy-before-sort; ObjectId push to `reviewIds`.
- **Key limitations:** no auth, server validation, pagination, deployment config, browser E2E suite, or robust status contract.

## V. Interview Red Flags: Do Not Claim These

- “Users can log in, own reviews, edit reviews, or delete reviews.”
- “The API validates body length and blank reviews on the server.”
- “Every missing resource returns 404.”
- “Review POST returns 201 and is transactional.”
- “The frontend fetches every review through `GET /api/v1/reviews/{id}`.”
- “This app has a complete automated unit/integration/E2E test suite.”
- “Responsive behavior was visually tested in browser automation at every breakpoint.”
- “The app is deployed with Docker, CI/CD, HTTPS, cloud hosting, or monitoring.”
- “MongoDB fields are indexed/validated by code in this repository.”
- “The application uses JWT, OAuth, rate limiting, sanitization, or a security framework.”
- “App.css is active.” It was removed as unused.
- “The backend uses DTOs or constructor injection.” It currently uses `Map<String, String>` and field `@Autowired` injection.

## Study Method

Practice the 30-second answer first. Then trace one real action aloud: search in Home, open `/movies/tt8760708`, fetch details, submit a review, and follow controller -> service -> MongoDB. For every improvement you mention, say “I would add...” rather than presenting it as existing functionality.
