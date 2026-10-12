import "./recommendations.css";
import { useNavigate } from "react-router-dom";

export function Recommendations({ anime }) {
  const navigate = useNavigate();
  const recommendations = anime?.recommendations?.nodes
    ?.map((item) => item.mediaRecommendation)
    .filter(Boolean) || [];

  return (
    <>
      <div className="rec-heading"><h1 id="recommendations">Recommendations</h1></div>
      <div className="outer-card-body">
        {recommendations.length > 0 ? recommendations.slice(0, 10).map((rec) => (
          <div className="card-body" key={rec.id}>
            <img src={rec.coverImage?.large} alt={rec.title?.english || rec.title?.romaji || "Anime cover"} />
            <p id="name">{rec.title?.english || rec.title?.romaji}</p>
            <p>Score: {rec.averageScore == null ? "N/A" : (rec.averageScore / 10).toFixed(1)}</p>
            <button disabled={!rec.idMal} onClick={() => rec.idMal && navigate(`/details/${rec.idMal}`)}>
              {rec.idMal ? "View Details" : "No MAL route available"}
            </button>
          </div>
        )) : <p id="rec-fallback">No recommendations available</p>}
      </div>
    </>
  );
}
