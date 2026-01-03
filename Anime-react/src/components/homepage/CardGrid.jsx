import { Card } from "./Card";
import "./cardgrid.css";

export function CardGrid({ anime }) {
  return (
    <>
      <div className="titleContainer">
        <div className="topRatedAnime">Top 25 Highest-Rated Anime</div>
      </div>
      <div className="card-grid">
        {anime.map((topAnime) => {
          const studio = topAnime.studios?.[0]?.name;
          const status = topAnime.status;
          const episodes = topAnime.episodes;
          const score = topAnime.score;

          const info = `${studio || "Unknown Studio"} • ${status} • ${
            episodes ? `${episodes} eps` : "?"
          } • ⭐ ${score ?? "N/A"}`;

          return (
            <Card
              key={topAnime.mal_id}
              Name={
                topAnime.title_english ||
                topAnime.title_japanese ||
                topAnime.title
              }
              tag1={topAnime.genres[0]?.name || ""}
              tag2={topAnime.genres[1]?.name || ""}
              tag3={topAnime.genres[2]?.name || ""}
              src={topAnime.images.jpg.image_url}
              info={info}
              id = {topAnime.mal_id}
            />
          );
        })}
      </div>
    </>
  );
}
