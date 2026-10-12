import "./media.css";

function getTrailerUrl(trailer) {
  if (!trailer?.id || !trailer?.site) return null;

  const id = encodeURIComponent(trailer.id);
  if (trailer.site.toLowerCase() === "youtube") {
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }
  if (trailer.site.toLowerCase() === "dailymotion") {
    return `https://www.dailymotion.com/embed/video/${id}`;
  }
  return null;
}

export function Media({ anime }) {
  if (!anime) {
    return <p style={{ color: "white" }}>Loading anime…</p>;
  }

  const trailerUrl = getTrailerUrl(anime.trailer);
  const title = anime.title?.english || anime.title?.romaji || "Anime trailer";

  return (
    <div className="mediaContainer">
      {trailerUrl ? (
        <iframe
          src={trailerUrl}
          title={`${title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <p style={{ color: "white" }}>Trailer not available for this anime.</p>
      )}
    </div>
  );
}
