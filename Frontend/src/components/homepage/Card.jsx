import "./card.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Card({
  Name,
  tag1,
  tag2,
  tag3,
  src,
  info,
  id,
  title,
  setAnime,
}) {
  const navigate = useNavigate();

  return (
    <div className="outerBody">
      <img src={src} alt={Name} />
      <p id="name">{Name}</p>

      <div className="info">{info}</div>

      <div className="tag">
        <p>{tag1}</p>
        <p>{tag2}</p>
        {tag3 && <p>{tag3}</p>}
      </div>

      {(title === "Favourites" || title === "WatchList") && (
        <button
          className="remove-btn"
          title="Remove from list"
          onClick={async (e) => {
            e.stopPropagation();
            const url =
              title === "Favourites"
                ? `${import.meta.env.VITE_API_URL}/api/v1/favourites/list/remove`
                : `${import.meta.env.VITE_API_URL}/api/v1/watchlist/list/remove`;

            await axios.delete(
              `${url}`,
              {
                data: { animeId: id },
                withCredentials: true,
              },
            );

            // remove from UI instantly
            setAnime((prev) => prev.filter((anime) => anime.mal_id !== id));
          }}
        >
          &times;
        </button>
      )}

      <button id="card-btn" onClick={() => navigate(`/details/${id}`)}>
        View Details
      </button>
    </div>
  );
}
