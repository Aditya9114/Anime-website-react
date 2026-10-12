# 2. Frontend Walkthrough

## 1. Browser boot

[`Frontend/src/main.jsx`](../Frontend/src/main.jsx) is the entry point. It finds the `root` element from `index.html`, creates a React root, and renders the app inside `BrowserRouter`:

```jsx
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

`BrowserRouter` makes React Router hooks such as `useNavigate()` and `useParams()` available to descendants. It also means a URL such as `/details/21` can render without a full-page navigation after the app has loaded.

## 2. Route selection

[`Frontend/src/App.jsx`](../Frontend/src/App.jsx) owns the page routes. It maps a path to a top-level feature component. For example:

```jsx
<Route path="/details/:id" element={<Details />} />
```

Inside `Details`, `useParams()` returns the path segment as a string. The application interprets that string as a **MAL ID**, not an AniList internal ID.

The router also mounts `/`, `/All-Characters/:id`, `/login`, `/register`, `/favourites`, and `/watchlist`. Authentication is not enforced by route guards; pages can render, and protected API requests determine whether the user has a valid session.

## 3. Shared anime data service

[`Frontend/src/services/anilist.js`](../Frontend/src/services/anilist.js) contains the common GraphQL transport and the app's named queries. `request(query, variables)`:

1. Sends `POST https://graphql.anilist.co` through Axios.
2. Sends `{ query, variables }` as JSON.
3. Applies a 15-second timeout.
4. Throws if AniList includes GraphQL `errors`, even if the HTTP response itself is successful.
5. Returns `response.data.data` to the caller.

Example (shortened from the source):

```js
async function request(query, variables = {}) {
  const response = await axios.post(ENDPOINT, { query, variables }, { timeout: 15000 });
  if (response.data.errors?.length) {
    throw new Error(response.data.errors.map((error) => error.message).join("; "));
  }
  return response.data.data;
}
```

The public methods keep components from repeating endpoint and error parsing logic:

| Function | Query purpose | Main callers |
|---|---|---|
| `getTopAnime()` | 25 anime sorted by AniList score | `HomePage` |
| `getAiringAnime()` | 10 TV anime in `RELEASING`, trending sort | `HomePage` |
| `searchAnime(search)` | Relevant anime matches across formats | `SearchBar` |
| `getAnimeByMalId(malId)` | Full details using MAL ID | `Details`, saved list pages |
| `getAllAnimeCharacters(malId)` | Fetch character pages until AniList says there are no more | `AllCharacters` |

The detail query asks for the fields needed by the detail sections in one request: title, description, cover, trailer, rating, dates, format/status, studios, schedule, characters and voice actors, recommendations, and streaming episodes.

## 4. Home page lifecycle

[`HomePage.jsx`](../Frontend/src/components/homepage/HomePage.jsx) stores three pieces of state:

```js
const [anime, setAnime] = useState([]);       // airing list
const [topAnime, setTopAnime] = useState([]); // rated list
const [user, setUser] = useState(null);       // current session user
```

On mount, separate effects start the independent requests:

- The user effect calls `GET ${VITE_API_URL}/api/v1/user/me` with `withCredentials: true`. On a 401 it calls refresh once and retries the user request once.
- The top-list effect checks `animeCache.topAnime`, otherwise calls `getTopAnime()` and stores the result.
- The airing-list effect checks `animeCache.airingAnime`, otherwise calls `getAiringAnime()` and stores the result.

These requests have different owners. Failure to get the user does not prevent the public anime lists from loading. The current empty-list UI uses a generic “something went wrong” message, so it does not distinguish “still loading,” “no matches,” and “request failed.”

The render tree is:

```text
HomePage
  ├─ LoginBar(user, setUser)
  ├─ Header (includes SearchBar)
  ├─ TopAiringGrid(anime)
  └─ TopRatedAnime(topAnime)
      └─ CardGrid(anime)
          └─ Card for each anime
```

## 5. Search and ID handoff

[`SearchBar.jsx`](../Frontend/src/components/homepage/SearchBar.jsx) holds the search text. Pressing Enter calls `searchAnime(query)`; the search has no default TV/movie format restriction, so films can be found with ordinary title searches.

The result contains both AniList `id` and MAL `idMal`. The current route scheme requires `idMal`, so the handler navigates to `/details/${anime.idMal}`. When AniList has no MAL ID, it displays a clear alert rather than silently using AniList's `id` in a MAL route.

Search chooses the first AniList result. The API query requests several candidates, but the current UI does not display a result picker.

## 6. Detail page loading and composition

[`Details.jsx`](../Frontend/src/components/details/Details.jsx) reads `id`, clears old anime state, and calls `getAnimeByMalId(id)`. Clearing the old record prevents a previous anime from flashing while the next page's request is pending. A null result or request error sets the page error state.

Once an anime object is available, Details passes the same object to multiple focused components:

```text
AniList detail object
  ├─ Media             trailer
  ├─ AnimeInfo         title, poster, synopsis, score, dates, genres, save actions
  ├─ AvailableInfo     streaming links when present
  ├─ AiringInfo        status, next episode, release dates
  ├─ Characters        first five character cards
  ├─ Studio            studio and producer names
  └─ Recommendations  related anime cards
```

`Comments` is another detail child, but it fetches its own comment and user data from Express rather than receiving them from `Details`.

## 7. Saved lists and client caching

`Grid` and `WatchListGrid` first get ID arrays from the app backend. They then fetch one AniList detail record per saved MAL ID. To limit API bursts, they process small batches and wait between batches; a 429 response gets one delayed retry.

[`cache.js`](../Frontend/src/components/homepage/cache.js) keeps `animeCache`, `favCache`, and `watchListCache` at module scope. These caches survive component unmounts while the current JavaScript page remains loaded, but they are not durable: refreshing the tab clears them. The saved-list cache comparison is based mainly on list length, so a same-length list change can leave stale entries until another refresh/invalidation.

## 8. State and navigation rules of thumb

- `useState` owns data that a component needs to render.
- `useEffect` starts requests tied to component mount or an ID change.
- `useParams` reads a route value, such as the MAL ID from `/details/21`.
- `useNavigate` moves between routes without reloading the document.
- The API service returns AniList-shaped objects; UI components read those fields directly.
- `Card` owns the shared “View Details” navigation and saved-list remove action.
- The backend's `VITE_API_URL` is used for account data; the AniList service has its own fixed GraphQL endpoint.

## 9. When debugging a blank or stale page

1. Check the browser console for the component's request error.
2. Inspect the Network panel and determine whether the request went to AniList or `VITE_API_URL`.
3. For a detail route, confirm the URL segment is a numeric MAL ID, and inspect the GraphQL variables for `idMal` (never `id`).
4. For saved lists, check the backend ID response first, then the corresponding AniList detail request.
5. Check whether a module cache supplied the data without making a request.
6. Separate a GraphQL error from an HTTP error; AniList can report GraphQL errors inside a response body.
