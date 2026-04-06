import { TopAiringGrid } from "./TopAiringGrid";
import { TopRatedAnime } from "./TopRatedAnime";
import { Header } from "./Header.jsx";
import { LoginBar } from "./loginbar.jsx";
import { SearchBar } from "./SearchBar.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

export function HomePage() {
  const [anime, setAnime] = useState([]);
  const [topAnime, setTopAnime] = useState([]);
  const [user, setUser] = useState(null);
  // const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_API_URL}/api/v1/user/me`, {
      withCredentials: true,
    })
    .then((res) => {
      console.log("User:", res.data);
      setUser(res.data.data);
    })
    .catch((err) => {
      console.log("Not logged in" ,err);
    });
}, []);

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
             limit: 10,
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
      <LoginBar user = {user} setUser = {setUser} /*isLogin={isLogin} setIsLogin = {setIsLogin}*/></LoginBar> 
      <Header />
      <section className="search-section">
        <SearchBar />
      </section>
      <TopAiringGrid anime={anime} />
      <TopRatedAnime topAnime={topAnime} />
    </>
  );
}
