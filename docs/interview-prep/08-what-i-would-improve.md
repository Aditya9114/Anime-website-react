# 8. What I Would Improve

These are interview-ready improvements, ordered from correctness and security to maintainability and scale.

## 1. Add centralized error handling

Express should have one final error middleware that recognizes `ApiError`, maps validation errors, logs unexpected failures, and returns a consistent JSON shape. This avoids controllers returning different error formats and makes frontend behavior predictable.

Also fix error construction so the `errors` argument is assigned correctly. The current `ApiError` constructor sets `this.errors = this.errors`, which does not preserve the supplied value.

## 2. Centralize Axios behavior

Create an Axios instance with `baseURL`, `withCredentials: true`, timeout, and response interceptors. A single interceptor can refresh an access token once and retry the original request. This removes duplicated refresh logic from `HomePage`, `Grid`, and `LoginBar`.

The interceptor must guard against retry loops and should not retry login or refresh requests indefinitely.

## 3. Validate request bodies

Use a schema validator for registration, login, list IDs, and comments. For example:

```js
commentSchema.parse({
  animeId: Number(id),
  content: content.trim()
});
```

Validation belongs on the server even if the browser already validates, because clients can be bypassed.

## 4. Improve session security

Use strong environment secrets, HTTPS in deployment, secure HTTP-only cookies, CSRF protection, refresh-token rotation, and per-device sessions. Store a hash of the refresh token if the threat model requires it. Add rate limiting to login and refresh endpoints.

## 5. Reduce Jikan request pressure

The favourites and watchlist pages currently reconstruct every item with separate Jikan calls. Options:

- add a backend proxy and cache responses;
- request details in a controlled queue with exponential backoff;
- store a small metadata snapshot beside each user list entry;
- use a dedicated anime catalog synchronized periodically.

The best choice depends on freshness requirements and traffic.

## 6. Make loading and error states explicit

Every async screen should distinguish loading, empty, success, unauthorized, rate-limited, and unexpected error states. Avoid leaving a blank section when a detail request fails. Use an AbortController or Axios cancellation when a component unmounts or the route ID changes.

## 7. Remove duplicated list logic

Favourites and watchlist are nearly the same workflow. A reusable hook could accept:

```js
useAnimeList({
  listEndpoint: "/api/v1/favourites/list",
  removeEndpoint: "/api/v1/favourites/list/remove"
});
```

This improves consistency while keeping the current UI components separate.

## 8. Add pagination and indexes

Comments currently load all comments for an anime. Add `limit` and `cursor` or `page` parameters, then return pagination metadata. Keep the `animeId` index and consider a compound index such as `{ animeId: 1, createdAt: -1 }` for the exact sort/query pattern.

## 9. Test the contracts

Add API integration tests and frontend tests around the flows described in [06 - Feature Request Flows](./06-feature-request-flows.md). Mock Jikan so tests are deterministic and do not depend on external rate limits.

## 10. Fix small correctness inconsistencies

Examples worth mentioning in an interview:

- Login returns HTTP 200 while constructing an `ApiResponse` with status code 201.
- Registration should consistently include credentials for cross-origin cookie handling.
- Some controllers catch every error and replace useful status codes with 500.
- The frontend uses alerts and console logs for many outcomes; a shared notification and logging strategy would be clearer.
- The `crypto`, `fs.access`, and some imported error symbols appear unused in authentication code and should be removed after confirming they are not planned features.

The key interview point is to explain the tradeoff: first preserve the working user journey, then improve reliability, security, observability, and scalability in that order.
