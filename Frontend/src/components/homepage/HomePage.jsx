import { TopAiringGrid } from "./TopAiringGrid";
import { TopRatedAnime } from "./TopRatedAnime";
import { Header } from "./Header.jsx";
import { LoginBar } from "./loginbar.jsx";
import { SearchBar } from "./SearchBar.jsx";
import { useState, useEffect} from "react";
import { animeCache } from "./cache.js";
import axios from "axios";

export function HomePage() {
  const [anime, setAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [user, setUser] = useState(null);

  // get logged in user
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/user/me`, {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.data);
      })
      .catch(() => {
        console.log("Not logged in");
      });
  }, []);

  // Top Rated Anime (animeCached)
  useEffect(() => {
    if (animeCache.topAnime) {
      console.log("TOP ANIME FROM animeCache");
      setTopAnime(animeCache.topAnime);
      return;
    }

    console.log("TOP ANIME FROM API");

    axios
      .get("https://api.jikan.moe/v4/top/anime")
      .then((res) => {
        setTopAnime(res.data.data);
        animeCache.topAnime = res.data.data;
      })
      .catch((err) => console.error(err));
  }, []);

  // Top Airing Anime (animeCached)
  async function getTopAiringAnime() {
    try {
      if (animeCache.airingAnime) {
        console.log("AIRING FROM animeCache");
        setAnime(animeCache.airingAnime);
        return;
      }

      console.log("AIRING FROM API");

      const res = await axios.get("https://api.jikan.moe/v4/top/anime", {
        params: {
          filter: "airing",
          type: "tv",
          limit: 10,
        },
      });

      setAnime(res.data.data);
      animeCache.airingAnime = res.data.data;
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getTopAiringAnime();
  }, []);

  return (
    <>
      <LoginBar user={user} setUser={setUser} />
      <Header />
      <section className="search-section">
        <SearchBar />
      </section>
      <TopAiringGrid anime={anime} />
      <TopRatedAnime topAnime={topAnime} />
    </>
  );
}
