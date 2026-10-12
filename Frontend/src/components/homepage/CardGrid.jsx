import { Card } from "./Card";
import "./cardgrid.css";

export function CardGrid({ anime,title, setAnime }) {
  return (
    <>
      <div className="titleContainer">
        <div className="topRatedAnime">{title}</div>
      </div>
      <div className="card-grid">
        {anime.map((topAnime) => {
          const studio = topAnime.studios?.nodes?.[0]?.name;
          const status = topAnime.status;
          const episodes = topAnime.episodes;
          const score = topAnime.averageScore == null ? null : (topAnime.averageScore / 10).toFixed(1);
          const rank = topAnime.rankings?.find((item) => item.type === "RATED" && /all time/i.test(item.context))?.rank;

          const info = `${rank ? `#${rank} • ` : ""}${studio || "Unknown Studio"} • ${status} • ${
            episodes ? `${episodes} eps` : "?"
          } • ⭐ ${score ?? "N/A"}`;

          return (
            <Card
              key={topAnime.id}
              Name={topAnime.title.english || topAnime.title.romaji}
              tag1={topAnime.genres?.[0] || ""}
              tag2={topAnime.genres?.[1] || ""}
              tag3={topAnime.genres?.[2] || ""}
              src={topAnime.coverImage?.large}
              info={info}
              id={topAnime.idMal}
              title = {title}
              setAnime = {setAnime}
            />
          );
        })}
      </div>
    </>
  );
}
