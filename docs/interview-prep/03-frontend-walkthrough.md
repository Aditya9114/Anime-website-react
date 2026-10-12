# 3. Frontend Walkthrough

## Entry point and routes

[`Frontend/src/main.jsx`](../../Frontend/src/main.jsx) mounts `App` inside `BrowserRouter`. [`Frontend/src/App.jsx`](../../Frontend/src/App.jsx) defines the page-level routes:

| URL | Component | Purpose |
|---|---|---|
| `/` | `HomePage` | Top airing and top-rated anime |
| `/details/:id` | `Details` | Anime detail sections |
| `/All-Characters/:id` | `AllCharacters` | Full character view |
| `/login` | `Login isLogin={true}` | Login form |
| `/register` | `Login isLogin={false}` | Registration form |
| `/favourites` | `Grid` | Current user's favourites |
| `/watchlist` | `WatchListGrid` | Current user's watchlist |

This is client-side routing: navigation changes the rendered component without a full browser reload.

## Home page data flow

[`HomePage.jsx`](../../Frontend/src/components/homepage/HomePage.jsx) has three independent effects:

1. Fetch the current user from `/api/v1/user/me`.
2. Fetch top-rated anime from Jikan.
3. Fetch top-airing anime from Jikan.

The module-level cache in [`cache.js`](../../Frontend/src/components/homepage/cache.js) prevents repeated top-list requests during the current browser session. It is a simple cache, not a server cache: a reload clears it, and it has no expiry.

A stronger cache would store timestamps, use React Query, or move caching to the backend. The current approach is easy to understand and sufficient for a small app.

## Detail page flow

`Details` reads `id` from `useParams()`, clears the old anime, and requests `https://api.jikan.moe/v4/anime/{id}`. It then composes focused children such as `Media`, `AnimeInfo`, `Characters`, `Comments`, and `Recommendations`.

Clearing old data when `id` changes prevents the previous anime from appearing while the next request is loading. A production version should also render explicit loading, empty, and error states.

## Reusable cards

`CardGrid` converts Jikan objects into the props needed by `Card`. `Card` owns navigation to `/details/{id}` and, for favourites/watchlist pages, the remove action.

This is a useful presentation/container split:

- list components fetch or prepare data;
- `CardGrid` maps data into UI props;
- `Card` renders one item and emits user actions.

## Frontend design questions

### What if Jikan returns HTTP 429?

The favourites and watchlist screens already fetch in small batches and retry once after a delay. This protects the external API but increases wait time. Better options include a backend proxy with rate limiting, request deduplication, exponential backoff, and a visible progress indicator.

### Why use `withCredentials: true`?

The browser does not send cross-origin cookies unless Axios requests opt in and the server allows credentials through CORS. Both sides must agree: the client sends credentials and Express returns a specific allowed origin, not `*`.

### What if a user double-clicks Add to favorites?

The backend uses `$addToSet`, so duplicate database values are prevented. The UI should still disable the button while the request is pending and show a clear success or error state.

### Why not put all state in one global store?

The current page-local state keeps the app simple. A global store becomes valuable when many unrelated components need the same user/session state or when optimistic updates must synchronize across routes. React Context, Zustand, Redux Toolkit, or React Query would be alternatives depending on the problem.
