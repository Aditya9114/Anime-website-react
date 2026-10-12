# 4. Backend Walkthrough

## What the backend is responsible for

The backend is a small Express REST API. It handles:

- registration, login, logout, and refresh-token requests;
- returning the current authenticated user;
- storing and returning favourite/watchlist MAL IDs;
- adding, listing, and deleting comments.

It does **not** fetch anime metadata from AniList. The browser calls AniList directly for public catalogue data.

## Startup sequence

[`Backend/src/index.js`](../Backend/src/index.js) is the executable entry point:

1. `dotenv.config({ path: "./.env" })` loads environment variables from the current working directory's `.env` file.
2. The app imports the Express application and Mongo connection function.
3. It chooses `process.env.PORT || 8000`.
4. It calls `connectDB()`.
5. Only after MongoDB connects does it call `app.listen(port, ...)`.

Because the dotenv path is relative, start the process with `Backend` as the working directory (for example, `npm run dev` from that folder). If the connection fails, `db/index.js` logs the failure and exits with status 1.

## Express application assembly

[`Backend/src/app.js`](../Backend/src/app.js) configures middleware in order:

```js
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

Middleware order matters. `cookieParser()` must run before routes that inspect `req.cookies`; the JSON parser must run before controllers read `req.body`.

The app mounts routers with versioned prefixes:

```text
/api/v1/auth       -> auth.routes.js
/api/v1/user       -> user.route.js
/api/v1/favourites -> favourites.routes.js
/api/v1/watchlist  -> watchlist.routes.js
/api/v1/comments   -> comments.routes.js
```

The root `GET /` route currently returns a simple `hello` string. There is no dedicated readiness or health endpoint.

## Route → middleware → controller → model

Each route file defines a small route table. For example:

```js
router.route("/list").get(verifyJWT, getFav);
```

When the browser calls `GET /api/v1/favourites/list`:

1. Express matches the prefix mounted in `app.js` and then `/list` in the router.
2. `verifyJWT` reads and verifies the access token.
3. Middleware finds the matching `User` and stores it on `req.user`.
4. `getFav` queries MongoDB for that user's `favourites` array.
5. The controller serializes the result in an `ApiResponse` envelope.

The layers have distinct jobs:

| Layer | Job | Example |
|---|---|---|
| `app.js` | Global middleware and route mounting | CORS, body parsing, `/api/v1` prefixes |
| `routes/*.js` | Match HTTP method/path and apply middleware | `POST /` with `verifyJWT` |
| `middlewares/auth.middleware.js` | Shared access-token verification | Populate `req.user` |
| `controllers/*.js` | Business logic and database calls | `$addToSet` a favourite |
| `models/*.js` | MongoDB document rules | `User` arrays and `Comments` fields |
| `utils/*` | Response/error helper objects | `ApiResponse`, `ApiError` |

## Authentication request path

`auth.routes.js` exposes public register/login operations, a protected logout operation, and a refresh operation that validates its refresh cookie inside the controller. The password check uses the `isPasswordCorrect` method on the Mongoose `User` model. Token creation is also implemented as model methods, then orchestrated by `auth.controller.js`.

For a protected route, [`verifyJWT`](../Backend/src/middlewares/auth.middleware.js) accepts either an `accessToken` cookie or a bearer token. It verifies the JWT signature with `ACCESS_TOKEN_SECRET`, fetches the user by the token's `_id`, selects away sensitive properties, attaches the user to the request, and calls `next()`.

## User-owned list path

`addToFavourites` and `addToWatchlist` use MongoDB `$addToSet`. That operation makes repeated requests idempotent: the same ID is not appended multiple times. Removal uses `$pull`. The controllers store only numeric IDs rather than copies of AniList records.

The frontend still resolves those values through AniList after receiving them. This is why a backend response contains a number array such as `[21, 16782]`, not full title/image objects.

## Comment path

The comments router deliberately leaves `GET /:id` public but protects adding and deleting comments. The controller:

- converts the route ID to a number and sorts matching comments newest-first;
- copies `req.user._id` and `req.user.username` into a new comment;
- compares the saved owner ID with the authenticated user before deletion.

The owner comparison is authorization: being logged in is not sufficient to delete another user's comment.

## Error handling as implemented

The repository defines `ApiError` and `ApiResponse`, but `app.js` does not register a final custom Express error middleware. Some controllers throw `ApiError`; others catch errors and send a response directly. Consequently, error shape/status behavior is not perfectly uniform yet. Express 5 forwards rejected async handlers to its default error handler, but a production API would benefit from a single, explicit error middleware.

`ApiError` currently assigns `this.errors = this.errors` rather than using its `error` constructor argument. Treat that helper as an in-progress standardization point, not as a complete validation/error framework.

## CORS and cookies

The configured origins are an allowlist, and `credentials: true` allows browser requests to include cookies. On the frontend, Axios must also set `withCredentials: true`. Both halves are required for cross-origin cookie-based authentication.

The auth controller sets `httpOnly: true`, `secure: true`, and `sameSite: "none"`. This is suitable for HTTPS deployments with separate frontend/backend origins. It can complicate local plain-HTTP testing because browsers require secure cookies for `SameSite=None`.

## Backend design limits visible in this repository

- MongoDB is required for startup; there is no offline mode.
- There is one `refreshToken` field on each user, not a separate per-device session collection.
- No anime collection or AniList proxy exists.
- There is no centralized request-body validation library or global error handler.
- The database `.env` values are secret configuration and must never be copied into docs or logs.
