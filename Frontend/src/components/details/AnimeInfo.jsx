import "./animeinfo.css";
import axios from "axios";


export function AnimeInfo({ anime, id }) {
  // If no data, don't render anything (cleaner than checking everywhere)
  if (!anime) return null;

  return (
    <div className="anime-card-container">
      {/* Left Side: Poster Image */}
      <div className="poster-wrapper">
        <img
          src={anime.coverImage?.extraLarge || anime.coverImage?.large}
          alt={anime.title?.english || anime.title?.romaji}
          className="poster-image"
        />
      </div>

      {/* Right Side: Content */}
      <div className="anime-content">
        {/* Title Section */}
        <h1 className="anime-title">{anime.title?.english || anime.title?.romaji}</h1>

        {/* Rating Section */}
        {/* Rating Section */}
        <div className="rating-row">
          <div className="score-badge">
            <img
              src={`${import.meta.env.BASE_URL}icons/star.png`}
              alt="star"
              className="star-icon"
            />
            <span className="score-val">{anime.averageScore == null ? "N/A" : (anime.averageScore / 10).toFixed(1)}</span>
            <span className="score-max">/ 10</span>
          </div>

          {/* Updated Button */}
          <button
            className="btn-fav"
            onClick={() => {
              axios
                .post(
                  `${import.meta.env.VITE_API_URL}/api/v1/favourites`,
                  { anime_id: id },
                  { withCredentials: true },
                )
                .then((res) => {
                  console.log("Result:", res.data);
                  alert("This anime has been added to your favourites");
                })
                .catch((err) => {
                  if (err.response?.status === 401) {
                    alert("Please log in to add favourites");
                    console.log(err);
                  }
                });
            }}
          >
            <span className="heart-icon">❤</span>
            Add to favorites
          </button>
          <button
            className="btn-fav"
            onClick={() => {
              axios
                .post(
                  `${import.meta.env.VITE_API_URL}/api/v1/watchlist`,
                  { anime_id: id },
                  { withCredentials: true },
                )
                .then((res) => {
                  console.log(res.data.message);
                  alert("This anime has been added to your WatchList")
                })
                .catch((err) => {
                  if (err.response?.status === 401) {
                    alert("Please log in to add it in your watchlist");
                    console.log(err);
                  }
                });
            }}
          >
            Add to WatchList
          </button>
        </div>

        {/* Synopsis */}
        <p className="synopsis">{anime.description?.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ")}</p>
        <div className="more-info">
          {anime.rankings?.filter((rank) => rank.type === "RATED").slice(0, 1).map((rank) => <p key={`${rank.context}-${rank.rank}`}>AniList ranking : #{rank.rank} ({rank.context})</p>)}
          <p>Episodes Count : {anime.episodes ?? "Unknown"}</p>
          <p>Format : {anime.format || "Unknown"}</p>
          <p>Status : {anime.status || "Unknown"}</p>
          <p>Season : {anime.season ? `${anime.season} ${anime.seasonYear || ""}` : "Unknown"}</p>
          <p>Release : {[anime.startDate, anime.endDate].map((date) => [date?.year, date?.month, date?.day].filter(Boolean).join("-") || "?").join(" – ")}</p>
        </div>

        {/* Tags / Genres */}
        <div className="tags-container">
          {anime.genres?.map((genre) => (
            <span key={genre} className="tag-pill">
              {genre}
            </span>
          ))}
          {anime.themes?.map((theme) => (
            <span key={theme.name} className="tag-pill">
              {theme.name}
            </span>
          ))}
        </div>
      </div>
    </div>
    
  );
}
