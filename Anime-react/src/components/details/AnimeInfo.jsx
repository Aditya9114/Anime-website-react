import "./animeinfo.css";

export function AnimeInfo({ anime }) {
  // If no data, don't render anything (cleaner than checking everywhere)
  if (!anime) return null;

  return (
    <div className="anime-card-container">
      {/* Left Side: Poster Image */}
      <div className="poster-wrapper">
        <img 
          src={anime.images?.jpg?.large_image_url} 
          alt={anime.title} 
          className="poster-image" 
        />
      </div>

      {/* Right Side: Content */}
      <div className="anime-content">
        {/* Title Section */}
        <h1 className="anime-title">
          {anime.title_english || anime.title}
        </h1>

        {/* Rating Section */}
        <div className="rating-row">
           <div className="score-badge">
              <img src="/icons/star.png" alt="star" className="star-icon" />
              <span className="score-val">{anime.score}</span>
              <span className="score-max">/ 10</span>
           </div>
        </div>

        {/* Synopsis */}
        <p className="synopsis">
          {anime.synopsis}
        </p>

        {/* Tags / Genres */}
        <div className="tags-container">
          {anime.genres?.map((genre) => (
            <span key={genre.name} className="tag-pill">
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}