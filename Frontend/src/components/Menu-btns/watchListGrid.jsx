import { useEffect, useState } from "react";
import { CardGrid } from "../homepage/CardGrid";
import { watchListCache } from "../homepage/cache";
import axios from "axios";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchAnime(ids, setAnime) {
  const BATCH_SIZE = 3;
  const BATCH_DELAY = 1100;
  const collected = [];

  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);

    const results = await Promise.all(
      batch.map(async (id) => {
        try {
          const res = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
          return res.data.data;
        } catch (err) {
          if (err.response?.status === 429) {
            await delay(1500);
            try {
              const retry = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
              return retry.data.data;
            } catch {
              return null;
            }
          }
          return null;
        }
      })
    );

    const valid = results.filter(Boolean);
    collected.push(...valid);
    setAnime((prev) => [...prev, ...valid]);

    if (i + BATCH_SIZE < ids.length) await delay(BATCH_DELAY);
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
        { withCredentials: true }
      );

      const ids = res.data.data;
      if (watchListCache.watchlist.length !== ids.length) {
        await fetchAnime(ids, setAnime);
      } else {
        setAnime(watchListCache.watchlist);
      }
      setLoading("Completed");
    };

    load();
  }, []);

  if (loading === "Completed" && anime.length === 0) {
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