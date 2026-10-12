# 1. Architecture Overview

## The big picture

The project has three main runtime pieces:

```text
Browser
  |
  | React UI, React Router, Axios
  |-------------------------------> Jikan API
  |                                  Public anime metadata
  |
  |-------------------------------> Express API
                                     Login, cookies, favourites,
                                     watchlist, comments
                                         |
                                         v
                                      MongoDB
```

The most important architectural decision is that the application does not copy all anime data into MongoDB. It stores only stable identifiers such as a user's `mal_id` values. When the favourites or watchlist page opens, the frontend gets those IDs from the project API and then fetches full anime objects from Jikan.

## Runtime startup

1. [`Frontend/src/main.jsx`](../../Frontend/src/main.jsx) creates the React root and wraps the application in `BrowserRouter`.
2. [`Frontend/src/App.jsx`](../../Frontend/src/App.jsx) maps URLs to page components.
3. [`Backend/src/index.js`](../../Backend/src/index.js) loads environment variables, connects to MongoDB, and only then starts Express listening.
4. [`Backend/src/app.js`](../../Backend/src/app.js) configures CORS, cookies, JSON parsing, and route prefixes.

Starting the server after the database connection is a deliberate fail-fast choice. If MongoDB is unavailable, the API should not pretend that it is healthy.

## Request ownership

Use this rule in an interview:

- Jikan owns anime facts: title, score, synopsis, images, studios, characters, recommendations, and airing information.
- The project backend owns user facts: credentials, access sessions, favourite IDs, watchlist IDs, and comments.
- The React components coordinate the two sources and render the result.

For example, opening `/details/21` calls Jikan for anime `21`. Clicking Add to favorites calls the project backend with `{ "anime_id": 21 }`. The backend stores `21`, not a duplicated anime document.

## Why this architecture?

Storing only IDs avoids stale copies of rapidly changing anime metadata and keeps the database small. The tradeoff is that list pages require extra Jikan requests and can be affected by Jikan rate limits or downtime.

A different design would use a server-side proxy or a local anime catalog. A proxy would centralize rate limiting and hide the external API from the browser. A local catalog would make reads faster and more reliable, but would require synchronization jobs and more storage.

## Main boundaries

- UI and navigation: `Frontend/src/components` and `Frontend/src/App.jsx`
- External data access: Axios calls to `https://api.jikan.moe/v4/...`
- Application API: `/api/v1/auth`, `/api/v1/user`, `/api/v1/favourites`, `/api/v1/watchlist`, `/api/v1/comments`
- Authentication boundary: [`Backend/src/middlewares/auth.middleware.js`](../../Backend/src/middlewares/auth.middleware.js)
- Persistence boundary: [`Backend/src/models/user.models.js`](../../Backend/src/models/user.models.js) and [`Backend/src/models/comments.models.js`](../../Backend/src/models/comments.models.js)

## Interview summary

If asked to describe the architecture in 30 seconds:

> It is a React single-page application backed by an Express REST API and MongoDB. Public anime content comes from Jikan, while the backend stores account data and user-specific references. JWTs are sent through HTTP-only cookies, protected routes use middleware, and React routes map the browser URL to feature components.
