import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom"; // ✅ FIXED
import { Details } from "./components/details/Details";
import axios from "axios";
import "./App.css";
import { Media } from "./components/details/Media";
import { HomePage } from "./components/homepage/HomePage";

function App() {
  const [topAnime, setTopAnime] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.jikan.moe/v4/top/anime")
      .then((res) => setTopAnime(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Routes>
      <Route index element={<HomePage topAnime={topAnime} />} />
      <Route path="/details/:id" element={<Details topAnime={topAnime} />} />
    </Routes>
  );
}

export default App;
