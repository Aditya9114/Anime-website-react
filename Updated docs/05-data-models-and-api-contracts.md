# 5. Data Models and API Contracts

## 1. User document

[`Backend/src/models/user.models.js`](../Backend/src/models/user.models.js) defines a Mongoose `User` collection. In simplified form:

```js
{
  username: String,        // required, unique, lowercase, trimmed
  email: String,           // required, unique, trimmed
  fullName: String,
  password: String,        // bcrypt hash after the save hook
  watchList: [Number],     // MAL IDs
  favourites: [Number],   // MAL IDs
  refreshToken: String,
  isEmailVerified: Boolean,
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  avatar: { url: String, localPath: String },
  createdAt: Date,
  updatedAt: Date
}
```

The model includes two helpful methods and one hook:

- `pre("save")` hashes `password` with bcrypt when the password is new or changed.
- `isPasswordCorrect(candidate)` compares a login candidate against the saved hash.
- `generateAccessToken()` and `generateRefreshToken()` sign JWTs with separate secrets and expiry settings.

The application list arrays use numbers because the frontend sends MAL IDs such as `21`; remove operations also convert the request value with `Number(animeId)`. They are not AniList internal IDs.

The schema contains password-reset and email-verification fields, but this repository does not currently mount routes that complete those workflows. The presence of a schema field alone does not mean a feature is implemented.

## 2. Comment document

[`Backend/src/models/comments.models.js`](../Backend/src/models/comments.models.js) stores one comment per document:

```js
{
  animeId: Number,                     // MAL ID; indexed
  user: ObjectId,                      // ref: "User"
  username: String,                    // copied display name
  content: String,                     // required, trimmed, length 2–500
  createdAt: Date,
  updatedAt: Date
}
```

The numeric `animeId` index accelerates the common query for comments on one anime. `username` is copied into the comment so the UI can display a name without populating the user each time. A username change will not automatically rewrite older comments.

## 3. API response shape

Most success controllers use `ApiResponse`:

```json
{
  "statusCode": 200,
  "data": [21, 16782],
  "message": "User's Favourite Anime fetched Successfully",
  "success": true
}
```

Frontend code typically reads `res.data.data`. Some routes use custom response objects, so the envelope is common but not perfectly universal. Also note that `loginUser` sends HTTP status 200 while constructing an `ApiResponse` with statusCode 201; consumers should trust the actual HTTP response status for network handling.

## 4. Endpoint reference

The route prefix is `/api/v1`. “Cookie” means the request must include the access or refresh cookie; route names below are relative to that prefix.

### Authentication and current user

| Method | Path | Access | Request | Successful result |
|---|---|---|---|---|
| `POST` | `/auth/register` | Public | `{ username, email, password }` | Creates user; sends access/refresh cookies and user data |
| `POST` | `/auth/login` | Public | `{ email, password }` | Checks password; sends access/refresh cookies and user data |
| `POST` | `/auth/logout` | Access JWT | Empty body | Clears stored refresh token and clears auth cookies |
| `POST` | `/auth/refresh-token` | Refresh cookie | Empty body | Validates refresh token and sends a new access cookie |
| `GET` | `/user/me` | Access JWT | No body | Current sanitized user in `data` |

### Favourites and watchlist

| Method | Path | Access | Request | Successful result |
|---|---|---|---|---|
| `POST` | `/favourites` | Access JWT | `{ "anime_id": 21 }` | Adds MAL ID with `$addToSet` |
| `GET` | `/favourites/list` | Access JWT | No body | Array of favourite MAL IDs |
| `DELETE` | `/favourites/list/remove` | Access JWT | `{ "animeId": 21 }` | Pulls ID from array |
| `POST` | `/watchlist` | Access JWT | `{ "anime_id": 21 }` | Adds MAL ID with `$addToSet` |
| `GET` | `/watchlist/list` | Access JWT | No body | Array of watchlist MAL IDs |
| `DELETE` | `/watchlist/list/remove` | Access JWT | `{ "animeId": 21 }` | Pulls ID from array |

`anime_id` (underscore) is the body key for adding. `animeId` (camel case) is the key for removing. Copy the exact spelling when testing requests.

### Comments

| Method | Path | Access | Request | Successful result |
|---|---|---|---|---|
| `GET` | `/comments/:animeId` | Public | Route ID is a MAL ID | Newest-first list in `data` |
| `POST` | `/comments/add` | Access JWT | `{ "animeId": 21, "content": "..." }` | Creates a comment owned by `req.user` |
| `DELETE` | `/comments/delete/:commentId` | Access JWT + owner check | Comment ID in route | Deletes only if the caller owns it |

## 5. AniList contract used by the frontend

The AniList service posts GraphQL JSON to `https://graphql.anilist.co`. Common fields used in the UI include:

| UI need | AniList field | Important handling |
|---|---|---|
| Existing route and saved-list ID | `idMal` | Use as MAL ID; never substitute `id` |
| Stable React key | `id` | AniList internal ID is suitable for `key`, not a MAL route |
| English/romanized title | `title.english`, `title.romaji` | English first, romaji fallback |
| Poster | `coverImage.large`, `coverImage.extraLarge` | Optional; components use optional chaining |
| Score | `averageScore` | 0–100; UI divides by 10 for its `/10` display |
| Genre and descriptive tags | `genres`, `tags { name }` | AniList genres are strings; tags are objects |
| Studio | `studios` | The `isMain` edge flag separates primary studio from other producer entries |
| Schedule | `nextAiringEpisode`, `airingSchedule` | Future schedule can be absent; no old schedules are fabricated |
| Characters and voice actors | `characters.edges` | Role/voice actors live on the edge; portrait/name live on node |
| Recommendations | `recommendations.nodes.mediaRecommendation` | May contain nulls and entries without MAL IDs |
| Trailer | `trailer { id site thumbnail }` | UI embeds supported YouTube/Dailymotion providers |
| Legal streaming episode links | `streamingEpisodes` | May be empty; not a comprehensive availability catalogue |

## 6. Example request payloads

### Add a favourite

```http
POST /api/v1/favourites
Content-Type: application/json
Cookie: accessToken=<browser-managed-cookie>

{ "anime_id": 21 }
```

### Add a comment

```http
POST /api/v1/comments/add
Content-Type: application/json
Cookie: accessToken=<browser-managed-cookie>

{ "animeId": 21, "content": "The animation is beautiful." }
```

These examples use placeholders. Do not paste real tokens, environment values, or passwords into docs or issue reports.

## 7. Error and validation observations

- User/comments models contain some validation, but controllers do not apply a shared request-schema validator.
- Several list controllers catch all failures and convert them to 500, including cases that started as 404.
- `addComment` catches invalid/missing input and responds with 500, even though a 400 would be more precise.
- Some controllers return plain objects while others return `ApiResponse`.
- AniList GraphQL errors are converted to thrown JavaScript errors by the frontend service; callers log or display them at the component level.
- Add an API validation library and global Express error middleware if the API needs more consistent contracts.
