import { useEffect, useState } from "react";
import { CardGrid } from "../homepage/CardGrid";
import { watchListCache } from "../homepage/cache";
import axios from "axios";
import './menu-btns.css'

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchAnime(ids, setAnime) {
  const collected = [];
  for (let i = 0; i < ids.length; i++) {
    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime/${ids[i]}`);

      setAnime((prev) => [...prev, res.data.data]);
      collected.push(res.data.data);

      // await delay(300); // SAFE rate
    } catch (err) {
      if (err.response?.status === 429) {
        await delay(1500); // backoff
        i--; // retry same id
      }
    }
  }
  watchListCache.watchlist = collected;
}

export function WatchListGrid() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/watchlist/list`,
        { withCredentials: true },
      );

      const ids = res.data.data;
      if (watchListCache.watchlist.length !== ids.length) {
        console.log("Fetching from API");
        await fetchAnime(ids, setAnime);
      } else {
        console.log("Got from cache", watchListCache.watchlist);
        setAnime(watchListCache.watchlist);
      }
      setLoading("Completed");
    };

    load();
  }, []);

  if (loading === "Completed" && anime.length == 0) {
    return (
      <div className="empty-container">
        <img src={`${import.meta.env.BASE_URL}icons/cart.png`} />
        <h1>Your WatchList is Empty</h1>
      </div>
    );
  } else if (loading === "Completed") {
    return <CardGrid anime={anime} title="WatchList" setAnime={setAnime} />;
  } else {
    return (
      <p style={{ color: "white" }}>
        Loading first time will take some time please remain patient
      </p>
    );
  }
}
