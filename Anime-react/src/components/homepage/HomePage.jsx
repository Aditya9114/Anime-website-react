import { TopAiringGrid } from "./TopAiringGrid";
import { TopRatedAnime } from "./TopRatedAnime";
import { Header } from "./Header.jsx";
import { SearchBar } from "./SearchBar.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

export function HomePage() {
  const [anime, setAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.jikan.moe/v4/top/anime")
      .then((res) => setTopAnime(res.data.data))
      .catch((err) => console.error(err));
  }, []);

    async function getTopAiringAnime() {
      try {
        const res = await axios.get("https://api.jikan.moe/v4/top/anime", {
          params: {
           filter: "airing",
            type: "tv",
             limit: 5,
          },
        });
  
        setAnime(res.data.data);
      } catch (err) {
        console.error(err);
      }
    }
  
    useEffect(() => {
      getTopAiringAnime();
    }, []);
  return (
    <>
      <Header />
      <section className="search-section">
        <SearchBar />
      </section>
      <TopAiringGrid anime={anime} />
      <TopRatedAnime topAnime={topAnime}/>
    </>
  );
}
