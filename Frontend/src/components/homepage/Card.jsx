import "./card.css";
import { useNavigate } from "react-router-dom";

export function Card({ Name, tag1, tag2, tag3, src, info, id }) {
  const navigate = useNavigate();

  return (
    <div className="outerBody">
      <img src={src} alt={Name} />
      <p id="name">{Name}</p>

      <div className="info">
        {info}
      </div>

      <div className="tag">
        <p>{tag1}</p>
        <p>{tag2}</p>
        {tag3 && <p>{tag3}</p>}
      </div>

      <button id="card-btn" onClick={() => navigate(`/details/${id}`)}>
        View Details
      </button>
    </div>
  );
}
