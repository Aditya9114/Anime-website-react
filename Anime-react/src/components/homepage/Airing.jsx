import axios from "axios";
import { useEffect, useState } from "react";

export function TopAiring() {
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    axios
  .get("https://api.jikan.moe/v4/anime?genres=22&order_by=popularity")
  .then((res) => setAnime(res.data.data))
  .catch(console.error);

  }, []);

  return (
    <div>
      <h2>Top Airing Anime</h2>

      <div className="grid">
        {anime.slice(0, 10).map((item) => (
          <div key={item.mal_id}>
            <img src={item.images.jpg.image_url} alt={item.title} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
