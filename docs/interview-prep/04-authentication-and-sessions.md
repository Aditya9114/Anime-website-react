# 4. Authentication and Sessions

## Registration and login

The login form in [`Frontend/src/components/login/login.jsx`](../../Frontend/src/components/login/login.jsx) sends credentials to `/api/v1/auth/login` or `/api/v1/auth/register`.

On the backend, [`auth.controller.js`](../../Backend/src/controllers/auth.controller.js) does the following:

1. Finds an existing user or checks duplicate username/email during registration.
2. Uses the Mongoose pre-save hook to hash passwords with bcrypt.
3. Generates an access token and refresh token from user methods.
4. Stores the refresh token on the user document.
5. Sends tokens as cookies and returns a sanitized user object.

The password is never meant to be stored in plaintext. bcrypt is intentionally slow, which makes password guessing more expensive than a fast hash such as SHA-256.

## Access token verification

[`verifyJWT`](../../Backend/src/middlewares/auth.middleware.js) checks either:

- the `accessToken` cookie; or
- an `Authorization: Bearer <token>` header.

It verifies the signature, finds the user, removes sensitive fields from the query result, assigns the user to `req.user`, and calls `next()`.

This middleware is reused by logout, current-user, favourites, watchlist, and comment-writing/deletion routes. That is an example of cross-cutting authorization logic being centralized instead of copied into every controller.

## Refresh flow

When `/api/v1/user/me` or a personal list returns 401, the frontend calls `/api/v1/auth/refresh-token` once and retries the original request. The backend verifies the refresh token, compares it with the token stored for that user, and issues a new access token.

Example:

```text
access token expired
  -> GET /user/me returns 401
  -> POST /auth/refresh-token
  -> receive new access token cookie
  -> retry GET /user/me
```

The retry limit matters. Without it, an expired refresh token could create an infinite request loop.

## Why access and refresh tokens?

A short-lived access token limits the damage from theft. A longer-lived refresh token avoids forcing the user to log in frequently. Storing the refresh token server-side also allows the server to invalidate a session during logout.

Alternatives include server-side sessions stored in Redis, OAuth/OIDC, or rotating refresh tokens. JWTs are convenient for distributed APIs but require careful revocation, expiry, cookie, and CSRF decisions.

## Security questions

### What if an access token is stolen?

Keep its expiry short, use HTTPS, use HTTP-only cookies, avoid placing tokens in localStorage, and consider token rotation and device/session management. HTTP-only prevents JavaScript from reading the cookie, but it does not by itself eliminate CSRF risk.

### What about CSRF?

Because authentication uses cookies, add CSRF protection for state-changing requests, or use an appropriate SameSite policy when deployment topology permits. Validate the Origin header and use a CSRF token pattern for stronger protection.

### What if refresh tokens are stolen?

Rotate refresh tokens on each refresh, store a hash rather than the raw token, detect token reuse, and revoke the affected session family. The current implementation stores one refresh token per user, so a new login replaces the old value and multi-device sessions are not independently managed.

### Why does cross-origin configuration matter?

The frontend and backend can have different origins in development and deployment. The backend must allow only known origins and set `credentials: true`; the frontend must use `withCredentials: true`. Never use `Access-Control-Allow-Origin: *` with credentials.

## Current code observations

- The registration request does not explicitly set `withCredentials`, while login does. In a cross-origin deployment, registration should use the same credential configuration if the response cookie is expected to be retained.
- Secrets belong in environment variables and should be strong, unique, and rotated. They should never be committed or copied into documentation.
- A centralized error handler would make authentication failures more consistent than relying on thrown errors alone.
