import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./searchbar.css";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  async function handleSearch(e) {
    if (e.key !== "Enter") return;
    if (!query.trim()) return;
    const isMovieSearch = query.toLowerCase().includes("movie");
    try {
      const res = await axios.get("https://api.jikan.moe/v4/anime", {
        params: {
          q: query,
          limit: 1,
          type: isMovieSearch ? "movie" : "tv",
        },
      });

      const anime = res.data.data[0];

      if (anime) {
        navigate(`/details/${anime.mal_id}`);
      } else {
        alert("No anime found 😢");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="Search an anime"
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        onKeyDown={handleSearch}
      />
    </div>
  );
}
