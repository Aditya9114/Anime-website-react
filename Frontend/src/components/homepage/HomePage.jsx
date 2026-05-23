import { TopAiringGrid } from "./TopAiringGrid";
import { TopRatedAnime } from "./TopRatedAnime";
import { Header } from "./Header.jsx";
import { LoginBar } from "./loginbar.jsx";
import { SearchBar } from "./SearchBar.jsx";
import { useState, useEffect } from "react";
import { animeCache } from "./cache.js";
import axios from "axios";

export function HomePage() {
  const [anime, setAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [user, setUser] = useState(null);

  // get logged in user
  useEffect(() => {

  const getUser = async (retry = true) => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/user/me`,
        {
          withCredentials: true,
        }
      );

      console.log("USER FETCH SUCCESS");

      setUser(res.data.data);

    } catch (err) {

      console.log("USER FETCH FAILED");
      console.log(err.response?.status);

      if (err.response?.status === 401 && retry) {

        console.log("TRYING TO REFRESH ACCESS TOKEN");

        try {

          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh-token`,
            {},
            {
              withCredentials: true,
            }
          );

          console.log("ACCESS TOKEN REFRESHED");

          return await getUser(false);

        } catch (refreshErr) {

          console.log("REFRESH TOKEN EXPIRED");
          console.log(refreshErr);

          setUser(null);

          // optionally navigate to login page
        }
      }

      console.log("Not logged in");
    }
  };

  getUser();

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
      <TopAiringGrid anime={anime} />
      <TopRatedAnime topAnime={topAnime} />
    </>
  );
}
