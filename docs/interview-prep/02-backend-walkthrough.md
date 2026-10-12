# 2. Backend Walkthrough

## Application assembly

[`Backend/src/app.js`](../../Backend/src/app.js) is the composition root for Express. It:

- allows requests from the configured frontend origins;
- enables `credentials: true` so cookies can cross the frontend/backend origin boundary;
- parses cookies, JSON bodies, and URL-encoded bodies;
- mounts routers under `/api/v1/...`.

The route prefix is useful because it gives the API a version boundary. A future breaking API can be mounted under `/api/v2` without immediately breaking the existing client.

## Startup and dependency order

[`Backend/src/index.js`](../../Backend/src/index.js) calls `connectDB()` before `app.listen()`. The sequence is:

```js
connectDB()
  .then(() => app.listen(port))
  .catch((error) => console.error(error));
```

If the database connection fails, the process does not accept requests that cannot be completed. An alternative is to start first and use a health/readiness endpoint, which is more flexible in container orchestration but needs careful readiness handling.

## Route to controller to model

A typical protected request has this shape:

```text
POST /api/v1/favourites
  -> favourites.routes.js
  -> verifyJWT
  -> addToFavourites controller
  -> User.findByIdAndUpdate
  -> ApiResponse JSON
```

The router chooses the endpoint and middleware. The controller validates the request and coordinates work. The model describes the MongoDB data shape. Keeping these responsibilities separate makes a controller easier to test than putting database calls directly in route declarations.

## Response helpers

[`Backend/src/utils/apiResponse.js`](../../Backend/src/utils/apiResponse.js) standardizes successful responses with `statusCode`, `data`, `message`, and `success`. [`Backend/src/utils/apiError.js`](../../Backend/src/utils/apiError.js) attempts to standardize errors.

Example success shape:

```json
{
  "statusCode": 200,
  "data": [21, 199],
  "message": "User's Favourite Anime fetched Successfully",
  "success": true
}
```

A consistent envelope makes frontend code predictable. The next improvement would be a single Express error-handling middleware so thrown `ApiError` values are converted into responses consistently.

## Backend design questions

### What if MongoDB is temporarily unavailable?

The current startup catches connection failure, but runtime database failures should be handled by centralized error middleware. For production, add a health endpoint, connection retry/backoff, structured logging, and graceful shutdown.

### Why use `findByIdAndUpdate` with `$addToSet`?

`$addToSet` adds an ID only if it is not already present. It makes the endpoint idempotent: submitting the same favourite twice does not create duplicates. `$push` would be simpler but would allow duplicate values.

### Why is there no anime collection?

The app treats Jikan as the source of truth for public metadata. That reduces synchronization work. If rate limits become a problem, introduce a cache or an `Anime` collection with a refresh policy.

### What if two devices update a list at once?

MongoDB atomic update operators such as `$addToSet` and `$pull` are safer than reading an array, changing it in JavaScript, and writing the whole document back. For more complex list ordering or metadata, use a separate collection with a compound unique index on `{ userId, animeId }`.
