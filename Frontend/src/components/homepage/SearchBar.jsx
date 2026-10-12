import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchAnime } from "../../services/anilist.js";
import "./searchbar.css";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  async function handleSearch(e) {
    if (e.key !== "Enter") return;
    if (!query.trim()) return;
    try {
      const results = await searchAnime(query);
      const anime = results[0];

      if (anime) {
        if (anime.idMal) navigate(`/details/${anime.idMal}`);
        else alert("This anime has no MyAnimeList ID, so it cannot open from a MAL-based URL.");
      } else {
        alert("No anime found 😢");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while searching. Please try again later.");
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
