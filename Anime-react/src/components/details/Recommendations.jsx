import axios from "axios";
import { useState, useEffect } from "react";
import "./recommendations.css";
import { useNavigate } from "react-router-dom";

export function Recommendations({ id }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!id) return;
    async function getrRecommendations() {
      await new Promise((r) => setTimeout(r, 1200));
      axios
        .get(`https://api.jikan.moe/v4/anime/${id}/recommendations`)
        .then((res) => {
          setRecommendations(res.data.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    getrRecommendations();
  }, [id]);

  useEffect(() => {
    console.log(recommendations);
  }, [recommendations]);

  const navigate = useNavigate();

  return (
    <>
      <div className="rec-heading">
        <h1 id="recommendations">Recommendations</h1>
      </div>
      <div className="outer-card-body">
        {recommendations.length > 0 ? (
          recommendations.slice(0, 10).map((rec) => (
            <div className="card-body" key={rec.entry.mal_id}>
              <img src={rec.entry.images.jpg.large_image_url} />
              <p id="name">{rec.entry.title}</p>
              <button onClick={() => navigate(`/details/${rec.entry.mal_id}`)}>
                View Details
              </button>
            </div>
          ))
        ) : (
          <p id="rec-fallback"> No recommendations available</p>
        )}
      </div>
    </>
  );
}
