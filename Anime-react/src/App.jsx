import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // ✅ FIXED
import { Details } from "./components/details/Details";
import axios from "axios";
import "./App.css";
import { Media } from "./components/details/Media";
import { TopRatedAnime } from "./components/homepage/TopRatedAnime";
import { TopAiringGrid } from "./components/homepage/TopAiringGrid";
import { HomePage } from "./components/homepage/HomePage";

function App() {
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
    <Routes>
      <Route index element={<HomePage
        anime={anime} 
        topAnime={topAnime}
      ></HomePage>} />
      <Route path="/details/:id" element={<Details topAnime={topAnime} airingAnime={anime}/>} />
    </Routes>
  );
}

export default App;
