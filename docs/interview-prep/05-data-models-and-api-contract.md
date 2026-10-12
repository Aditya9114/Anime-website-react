# 5. Data Models and API Contract

## User document

[`user.models.js`](../../Backend/src/models/user.models.js) stores identity and user-owned references:

```text
User
- username, email, fullName
- password hash
- watchList: [Number]
- favourites: [Number]
- refreshToken
- verification and password-reset fields
- timestamps
```

The array values are Jikan/MAL anime IDs. They are numbers because the frontend sends values such as `21` and remove operations convert incoming IDs with `Number(animeId)`.

The schema also defines indexes/uniqueness for username and email. `lowercase` and `trim` normalize values before storage, which helps prevent accidental duplicates caused by casing or whitespace.

## Comment document

[`comments.models.js`](../../Backend/src/models/comments.models.js) stores:

```text
Comment
- animeId: Number, indexed
- user: ObjectId reference to User
- username: copied display value
- content: trimmed, 2-500 characters
- createdAt and updatedAt
```

The `animeId` index supports the common query `Comments.find({ animeId })`. The username is denormalized so a comment can render without populating the user document. The tradeoff is that changing a username does not automatically update old comments.

## Endpoint map

### Authentication

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/register` | No | Create user and issue tokens |
| POST | `/api/v1/auth/login` | No | Check password and issue tokens |
| POST | `/api/v1/auth/logout` | Yes | Clear stored refresh token and cookies |
| POST | `/api/v1/auth/refresh-token` | Refresh cookie | Issue a new access token |

### User and lists

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/user/me` | Yes | Return current user |
| POST | `/api/v1/favourites` | Yes | Add an anime ID |
| GET | `/api/v1/favourites/list` | Yes | Return favourite IDs |
| DELETE | `/api/v1/favourites/list/remove` | Yes | Remove `{ animeId }` |
| POST | `/api/v1/watchlist` | Yes | Add an anime ID |
| GET | `/api/v1/watchlist/list` | Yes | Return watchlist IDs |
| DELETE | `/api/v1/watchlist/list/remove` | Yes | Remove `{ animeId }` |

### Comments

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/v1/comments/:id` | No | Read comments for an anime |
| POST | `/api/v1/comments/add` | Yes | Add `{ animeId, content }` |
| DELETE | `/api/v1/comments/delete/:id` | Yes | Delete own comment |

## Authorization versus authentication

Authentication answers “Who are you?” and is handled by JWT verification plus the user lookup. Authorization answers “Are you allowed to do this?” and is visible in comment deletion: the controller compares the comment owner with `req.user._id` before deleting.

A user being logged in is not enough to delete any comment. Ownership must be checked at the resource level.

## What if the API receives bad input?

The schema provides some validation, but controllers should validate request bodies before database calls. Add a validation library such as Zod, Joi, or express-validator for consistent rules, reject malformed IDs, trim content, limit payload sizes, and return the correct 400 status.

## What if an anime is deleted from Jikan?

The project still has its numeric ID, but the detail fetch can fail. The list page should preserve the list entry as unavailable or remove it with user confirmation. A server-side anime cache could retain a minimal title and image snapshot to make user lists resilient.
