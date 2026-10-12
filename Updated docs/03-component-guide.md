# 3. Component Guide

This chapter is a map for reading `Frontend/src/components`. Start at the route component, then follow props downward until you reach the card or leaf component that renders a piece of data.

## Route-level pages

| Component | Source | What it does | Data it owns or receives |
|---|---|---|---|
| `HomePage` | [`homepage/HomePage.jsx`](../Frontend/src/components/homepage/HomePage.jsx) | Fetches public top/airing lists and the current user; composes the home screen. | Owns `anime`, `topAnime`, `user`; uses the `animeCache` module object. |
| `Details` | [`details/Details.jsx`](../Frontend/src/components/details/Details.jsx) | Reads the route ID, resolves a full AniList record, and composes detail sections. | Owns `anime` and an error flag. The route ID is a MAL ID. |
| `AllCharacters` | [`AllCharacters/AllCharacters.jsx`](../Frontend/src/components/AllCharacters/AllCharacters.jsx) | Loads all characters in pages for a title. | Reads a MAL ID from the route; owns paginated result/loading state. |
| `Login` | [`login/login.jsx`](../Frontend/src/components/login/login.jsx) | Renders either login or registration based on `isLogin`. | Owns form fields and toast state. |
| `Grid` | [`Menu-btns/favGrid.jsx`](../Frontend/src/components/Menu-btns/favGrid.jsx) | Loads the user's favourite IDs, resolves them to anime, and renders cards. | Owns anime and loading state; uses `favCache`. |
| `WatchListGrid` | [`Menu-btns/watchListGrid.jsx`](../Frontend/src/components/Menu-btns/watchListGrid.jsx) | Same pattern for the watchlist. | Owns anime and loading state; uses `watchListCache`. |

## Home page component tree

```text
HomePage
├─ LoginBar
├─ Header
│  └─ SearchBar
├─ TopAiringGrid
│  └─ Card (one per airing title)
└─ TopRatedAnime
   └─ CardGrid
      └─ Card (one per rated title)
```

### `Header` and `SearchBar`

[`Header.jsx`](../Frontend/src/components/homepage/Header.jsx) holds the site header and renders `SearchBar`. SearchBar owns the input text. On Enter it calls the AniList service and navigates to `/details/:malId` when the top match has an `idMal`.

Search does not render an inline result list. It either navigates to the first result, alerts when there is no result, or alerts that the MAL-based route cannot be formed if the result has no MAL ID.

### `TopAiringGrid` and `TopRatedAnime`

`HomePage` supplies data. `TopAiringGrid` maps each AniList item to the shared `Card`; `TopRatedAnime` is a small state/empty wrapper around `CardGrid`. The two list components adapt `averageScore` from AniList's 0–100 scale to the card's 0–10 display scale.

### `CardGrid` and `Card`

`CardGrid` maps objects into presentation props:

```jsx
<Card
  key={anime.id}       // AniList internal ID is safe as a React key
  Name={anime.title.english || anime.title.romaji}
  src={anime.coverImage?.large}
  id={anime.idMal}     // Route/save ID remains MAL
/>
```

The distinction between `key` and `id` is important: the internal AniList ID identifies the rendered list element; the `id` prop determines the existing MAL-based URL.

`Card` renders image, name, tags, and short metadata. It navigates to `/details/${id}` only when a MAL ID exists. On favourites/watchlist cards it also sends a DELETE request to the matching Express endpoint, then removes the item from local React state.

## Detail page component tree

```text
Details
├─ Media             trailer player
├─ DetailsHeader     in-page section buttons
├─ AnimeInfo         poster, title, synopsis, score, tags, list buttons
├─ AvailableInfo     selected streaming-provider links
├─ AiringInfo        status and schedule/date information
├─ Characters        first five character cards + More button
│  └─ CharacterCard  character and available voice-actor names
├─ Studio            studio and producer text
├─ Comments          Express-backed community comments
└─ Recommendations  recommendation cards
```

### `Media`

[`details/Media.jsx`](../Frontend/src/components/details/Media.jsx) reads `anime.trailer` from AniList. It builds a YouTube or Dailymotion embed URL from the provider and video ID; it does not perform a second search request. If AniList has no supported trailer metadata, it displays a “Trailer not available” message.

### `AnimeInfo`

`AnimeInfo` is the primary title panel. It reads AniList title/cover/description/score fields, formats the 0–100 score as a 0–10 value, and renders genres/tags. Its two action buttons send the route's MAL ID to the backend as `{ anime_id: id }` for favourites and watchlist membership.

### `AiringInfo`, `Studio`, `AvailableInfo`

- `AiringInfo` uses `nextAiringEpisode` for the episode number/time and uses dates/status for finished or not-yet-released anime. It does not invent past schedules.
- `Studio` reads `studios.edges`. It separates `isMain` studios from the remaining producers and shows their names. There is no studio logo integration in the current source.
- `AvailableInfo` checks `streamingEpisodes`, then links the existing Crunchyroll, Netflix, or Muse icon when the AniList `site` matches. It omits unknown services rather than guessing at a logo.

### `Characters` and `CharacterCard`

`Characters` reads the first 25 AniList character edges supplied by the detail query, shows the first five, and offers a link to `/All-Characters/:malId`. Each `CharacterCard` gets a character name/image, role, and language-specific voice-actor arrays. Missing data is displayed as “Unknown,” and missing portraits get a placeholder image.

`AllCharacters` calls `getAllAnimeCharacters(malId)`. That service increments the AniList page until `pageInfo.hasNextPage` is false, then the route renders every edge using the same `CharacterCard`.

### `Recommendations`

`Recommendations` takes recommendation nodes from the already-fetched detail record. It filters null `mediaRecommendation` entries, displays title/cover/score, and navigates by `idMal`. A recommendation without a MAL ID has a disabled details button so its AniList ID is never mistaken for a MAL ID.

### `DetailsHeader`

`DetailsHeader` is a set of buttons that scrolls to DOM IDs such as `characters`, `studio`, `reviews`, and `recommendations`. It does not fetch data.

### `Comments`

`comments.jsx` is a data-owning child rather than a display-only child. It uses `useParams()` to get the route MAL ID, fetches the current user and comments from Express, and implements submit/delete actions. Its requests are independent of the AniList request in `Details`.

## Login bar versus login form

- `LoginBar` on the homepage shows login/register links when `user` is null. When a user exists, it offers account actions and invokes Express endpoints for logout or list navigation.
- `Login` handles the email/password form and changes behavior through the `isLogin` prop. A successful login shows a toast and navigates home; registration shows a success message and navigates to login.

## Styling files

Most components import a sibling CSS file: for example `Card.jsx` imports `card.css`, and `AnimeInfo.jsx` imports `animeinfo.css`. The broad global styling is in `Frontend/src/index.css` and `Frontend/src/App.css`. When changing visual behavior, trace both the component markup and its CSS rather than assuming the JSX controls layout by itself.

## A useful reading exercise

To understand a “View Details” click:

1. Start in `TopAiringGrid.jsx` or `CardGrid.jsx` and find the `id={topAnime.idMal}` prop.
2. Follow that prop into `Card.jsx`.
3. Follow `navigate(`/details/${id}`)` into `App.jsx`'s `/details/:id` route.
4. Follow `useParams()` in `Details.jsx`.
5. Confirm `getAnimeByMalId(id)` passes that value as GraphQL `idMal`.

That trace shows how display data and route identity cross component boundaries without mixing MAL and AniList IDs.
