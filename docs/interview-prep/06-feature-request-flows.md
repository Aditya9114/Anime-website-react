# 6. Feature Request Flows

## Home page

```text
HomePage mounts
  -> GET /api/v1/user/me with cookies
  -> if 401, refresh once and retry
  -> GET Jikan /v4/top/anime for rated list
  -> GET Jikan /v4/top/anime?filter=airing&type=tv&limit=10
  -> cache results in module-level animeCache
  -> render LoginBar, Header, TopAiringGrid, TopRatedAnime
```

The user request and public content requests are independent. A failed login check should not prevent public anime lists from rendering.

## Search

`SearchBar` waits for the Enter key, rejects empty input, calls Jikan search with `q`, `limit=1`, and a type inferred from whether the query contains the word “movie”. It navigates to `/details/{mal_id}` for the first match.

The current heuristic is simple but imperfect. A better UI would expose a type selector or show multiple search results instead of silently choosing the first result.

## Anime details

```text
GET /details/21 in browser
  -> Details reads id = 21
  -> GET Jikan /v4/anime/21
  -> render Media, AnimeInfo, AvailableInfo, AiringInfo,
     Characters, Studio, Comments, Recommendations
```

The detail page is a composition root for related sections. `AnimeInfo` uses the project API only for user actions such as adding the current ID to favourites or watchlist.

## Add to favourites

```text
click Add to favorites
  -> POST /api/v1/favourites
     body: { anime_id: 21 }
     credentials: included
  -> verifyJWT finds req.user
  -> $addToSet adds 21 to favourites
  -> frontend shows success alert
```

If no valid access token exists, middleware returns 401 and the UI asks the user to log in. The backend remains the authority; the frontend cannot safely decide whether a user is authenticated.

## Favourites page

```text
GET /favourites
  -> GET /api/v1/favourites/list
  -> receive [21, 199, ...]
  -> fetch full objects from Jikan in batches
  -> retry a 429 once after a delay
  -> render CardGrid
```

This explains why the page can be slower than the home page: one backend request is followed by multiple external requests. Batch size and delay are rate-limit controls, not arbitrary UI delays.

Removing an item sends a DELETE request with `{ animeId }`, then filters it out of local state for immediate feedback.

## Watchlist page

The watchlist follows the same two-step pattern as favourites. The main differences are the endpoint, cache object, and batch settings. This duplication is understandable for a small project, but a shared `UserAnimeList` hook could reduce drift between the two screens.

## Comments

```text
Details mounts
  -> GET /api/v1/comments/21 (public)
  -> render newest comments first

submit comment
  -> POST /api/v1/comments/add with { animeId: 21, content }
  -> verifyJWT
  -> create comment with user ID and username
  -> fetch comments again

click Delete on own comment
  -> DELETE /api/v1/comments/delete/:commentId
  -> verifyJWT
  -> controller checks ownership
  -> fetch comments again
```

The client hides the Delete button unless the returned comment user matches the current user, but the server check is the real security control. Client-side hiding alone is never authorization.

## Failure scenarios to discuss

- Jikan returns 429: back off, retry with jitter, cache, and show progress.
- Backend returns 401: refresh once, then clear session and redirect to login.
- Backend returns 403 on comment deletion: show an authorization error and do not retry.
- Network request hangs: use Axios timeouts, cancellation, and a retry policy only for safe/idempotent operations.
- User submits an empty or oversized comment: validate in the browser for fast feedback and again on the server for security.
