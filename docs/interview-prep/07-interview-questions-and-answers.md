# 7. Interview Questions and Answers

## How does a request move through the backend?

The browser calls a mounted Express route. The router selects middleware and a controller. Protected routes run `verifyJWT` first. The controller reads input, calls a Mongoose model, and returns an `ApiResponse`. For example, adding a favourite travels through `favourites.routes.js`, `verifyJWT`, `addToFavourites`, and `User.findByIdAndUpdate`.

## Why use middleware for JWT verification?

Authentication is cross-cutting. Centralizing it avoids repeating token parsing, signature verification, and user lookup in every protected controller. It also gives every protected endpoint the same `req.user` contract.

## Why bcrypt instead of encrypting passwords?

Passwords should be hashed, not encrypted. Encryption is reversible; hashing is one-way. bcrypt also includes a work factor, making brute-force attempts more expensive. The application compares a submitted password with `bcrypt.compare` and never needs to recover the original password.

## What is the source of truth for a favourite?

The backend user document is the source of truth for membership. Jikan is the source of truth for the anime metadata. The frontend combines the two by turning stored IDs into Jikan objects.

## Why `$addToSet` instead of `$push`?

`$addToSet` gives idempotent add behavior. Repeating the same request does not duplicate the ID. `$push` is appropriate only if duplicates or ordered repeated entries are meaningful.

## How is comment deletion protected?

There are two layers: the route requires a valid user, and the controller verifies that the comment's `user` field matches `req.user._id`. The first proves identity; the second proves ownership.

## What are the drawbacks of the current design?

The browser makes many Jikan calls for list reconstruction, caches have no expiry, error handling is inconsistent, and personal data requests repeat refresh logic. The API also exposes raw numeric IDs without a server-side anime snapshot. These are acceptable early-stage tradeoffs but become important at scale.

## How would you test this project?

- Unit test token generation, password comparison, and list controller behavior.
- Integration test register, login, refresh, logout, and protected 401 behavior.
- Test duplicate favourites and watchlist entries.
- Test comment ownership: owner can delete, another user gets 403.
- Mock Jikan responses, including success, 404, 429, and timeout cases.
- Use React Testing Library to test form submission, retry behavior, empty lists, and navigation.
- Add an end-to-end test for login -> details -> add favourite -> favourites page.

## What if the frontend is compromised by XSS?

HTTP-only cookies reduce token exfiltration through JavaScript, but XSS can still act as the user in the browser. Escape/render user content safely, avoid unsafe HTML, validate input, add a Content Security Policy, and keep dependencies patched.

## How would you scale this application?

First centralize API access and error handling. Then add server-side caching and rate limiting for Jikan, paginate comments, move list entries into a separate collection if they need metadata, add Redis for sessions or caching, and introduce observability with structured logs, metrics, and tracing.

## Why use React Router?

It gives the SPA URL-addressable screens and parameterized routes such as `/details/:id` without a full document reload. Alternatives include a server-rendered framework such as Next.js or manually switching views, but React Router fits the current Vite SPA structure.

## What is the difference between 401 and 403 here?

`401 Unauthorized` means the request lacks valid authentication and may be fixed by logging in or refreshing a token. `403 Forbidden` means the server knows who the caller is but refuses the requested action, such as deleting another user's comment.
