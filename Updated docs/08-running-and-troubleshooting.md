# 8. Running, Configuration, and Troubleshooting

## Local development commands

Run commands from the folder whose package file they use.

### Frontend

```powershell
cd Frontend
npm install
npm run dev
```

The Vite development server normally uses `http://localhost:5173`.

Useful checks:

```powershell
npm run build
npx eslint src
```

There is no `lint` script or test script declared in `Frontend/package.json`. `npx eslint src` runs the installed linter directly.

### Backend

```powershell
cd Backend
npm install
npm run dev
```

The development command uses Nodemon and starts `src/index.js`. The process needs a reachable MongoDB instance and its backend environment configuration before it can listen.

## Environment variable names

The repository currently has these variable names in its local environment files. Values are intentionally not documented here.

| File | Names | Used for |
|---|---|---|
| `Frontend/.env` | `VITE_API_URL` | Base address for the Express API |
| `Frontend/.env` | `VITE_YT_API_KEY` | Legacy YouTube Search API integration; current trailer component no longer reads it |
| `Backend/.env` | `PORT` | Express listening port; default is 8000 |
| `Backend/.env` | `MONGO_URI` | MongoDB connection |
| `Backend/.env` | `ACCESS_TOKEN_SECRET`, `ACCESS_TOKEN_EXPIRY` | Access JWT signing and expiry |
| `Backend/.env` | `REFRESH_TOKEN_SECRET`, `REFRESH_TOKEN_EXPIRY` | Refresh JWT signing and expiry |

### Important environment distinction

Vite exposes variables prefixed with `VITE_` to browser code. `VITE_API_URL` is intended to be public. Never place MongoDB credentials or JWT signing secrets in a `VITE_` variable. A build embeds frontend configuration, so changing a deployed frontend variable normally requires a new frontend build/deploy.

`Backend/src/index.js` loads `.env` using the relative path `./.env`; start the backend with `Backend` as the current working directory. Do not print `.env` contents into a terminal transcript or commit them.

## API destinations

| Request kind | Destination source |
|---|---|
| Anime GraphQL | Fixed endpoint `https://graphql.anilist.co` in `Frontend/src/services/anilist.js` |
| Accounts, lists, comments | `${VITE_API_URL}/api/v1/...` |
| Trailers | iframe URL constructed from AniList trailer metadata |

The API data flow no longer calls Jikan from active frontend source. `Frontend/vercel.json` still rewrites `/api/*` to a Jikan URL; that appears to be left over from the earlier integration and should be reviewed when deploying. The active account requests use `VITE_API_URL`, so do not assume the rewrite is the backend proxy.

## Common troubleshooting checklist

### Home page has empty anime sections

1. Open browser DevTools → Network.
2. Look for a POST to `graphql.anilist.co`.
3. Inspect the HTTP status and GraphQL response body.
4. Check the Console for “Top anime request failed” or airing request errors.
5. If the request succeeded but the list is still empty, check whether the app returned to a cached empty list in `animeCache`.

### Search does not find a movie

Search now searches all anime formats. If it still reports no match, check spelling and the `Page.media` result from AniList. The component only opens the first match and requires that match to have a MAL ID; a result with no `idMal` triggers a deliberate route-compatibility alert.

### Login works but list calls return 401

Check all of the following together:

- The browser has cookies for the backend domain.
- The frontend Axios call uses `withCredentials: true`.
- Express CORS allows the exact frontend origin and `credentials: true`.
- Deployed requests use HTTPS because cookies are `Secure` and `SameSite=None`.
- The refresh token is present, unexpired, and still matches the value stored on the User document.

Registration currently omits `withCredentials` on its Axios request. Its UI routes the user to login, which is why that page asks them to authenticate again after creating an account.

### A direct URL works after clicking but fails on page refresh

This is usually a static-host routing/rewrite issue rather than a React component issue. Check that the production host serves the SPA entry point for `/details/:id`, `/favourites`, and other client-side routes. The Vercel configuration has a catch-all rewrite to `/`, but it also has a legacy Jikan `/api/*` rewrite; verify the deployed rules against the actual backend setup.

### Saved list appears incomplete

The backend list endpoint only returns IDs. The frontend fetches each anime separately. Inspect each GraphQL response and check rate-limit status. Current code retries a 429 once, but skips other failed entries rather than showing a per-item error card.

### Trailer is missing or refuses to play

1. Inspect the AniList detail response's `trailer` object.
2. Confirm `site` is `youtube` or `dailymotion` and `id` is non-empty.
3. Open the embed URL in a browser. A valid trailer can still refuse embedding if the video owner disabled embeds or the video is region-restricted.
4. A title with no AniList trailer currently shows “Trailer not available”; no YouTube search fallback runs.

### Backend does not start

- Run `npm run dev` from the `Backend` directory so `dotenv` resolves `./.env` as intended.
- Check whether `MONGO_URI` exists without printing its value.
- Verify MongoDB is reachable and credentials/network access are correct.
- Check the terminal for the Mongo connection failure; the current startup exits instead of starting a partially working API.

## A practical tracing method

When learning or debugging a feature, follow one user action in this order:

1. Find the button/input in JSX and identify its handler.
2. Find the request URL and request body in that handler.
3. Match the URL to the router mounted in `Backend/src/app.js`.
4. Follow the route to middleware and then controller.
5. Follow controller queries to the Mongoose model.
6. Follow the response back to the component's state setter and render branch.

For example, to understand favourite removal, start in `Card.jsx`, follow the DELETE URL to `favourites.routes.js`, check `verifyJWT`, read `removeFav`, then inspect the `User.favourites` array in `user.models.js`.

## Glossary

| Term | Meaning in this app |
|---|---|
| AniList ID (`id`) | AniList's internal numeric media identifier; used as a React key, not the current detail route ID |
| MAL ID (`idMal`) | MyAnimeList numeric identifier; used by existing `/details/:id` URLs, saved lists, and comments |
| GraphQL | API style where the client posts a query describing the fields it needs |
| REST route | An Express URL selected by HTTP method and path, such as `GET /api/v1/user/me` |
| Middleware | Express function that runs before the controller, such as authentication or body parsing |
| Controller | Function that handles a route's business logic and response |
| Mongoose model | JavaScript interface to a MongoDB collection and its validation rules |
| JWT | Signed token containing identity/expiry claims; the app sends access and refresh JWTs in cookies |
| CORS | Browser policy configured by the server to permit requests from selected origins |
| `withCredentials` | Axios option that includes cookies on a cross-origin browser request |
