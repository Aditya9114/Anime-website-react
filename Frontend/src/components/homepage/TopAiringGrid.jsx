import "./topairinggrid.css";
import { Card } from "./Card";

export function TopAiringGrid({ anime }) {
  return (
    <>
      <div className="titleContainer">
        <div className="topRatedAnime">Top 10 Airing Anime</div>
      </div>

      {!anime || anime.length === 0 ? (
        <div className='loading-error'>
          <h2 style={{ color: "white" }}>Something went wrong while Loading the top airing Anime</h2>
        </div>
      ) : (
        <div className="card-grid">
          {anime.map((topAnime, index) => {
            const studio = topAnime.studios?.nodes?.[0]?.name;
            const status = topAnime.status;
            const episodes = topAnime.episodes;
            const score = topAnime.averageScore == null ? null : (topAnime.averageScore / 10).toFixed(1);
            const rank = topAnime.rankings?.find((item) => item.type === "POPULAR" && /airing/i.test(item.context))?.rank || index + 1;

            const info = `${rank ? `#${rank} • ` : ""}${studio || "Unknown Studio"} • ${status} • ${
              episodes ? `${episodes} eps` : "Ongoing"
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
              />
            );
          })}
        </div>
      )}
    </>
  );
}
