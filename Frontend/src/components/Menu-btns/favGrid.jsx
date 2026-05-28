import { useEffect, useState } from "react";
import { CardGrid } from "../homepage/CardGrid";
import { favCache } from "../homepage/cache";
import axios from "axios";
import "./menu-btns.css";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchAnime(ids, setAnime) {
  const BATCH_SIZE = 2;
  const BATCH_DELAY = 1500;
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
            await delay(2000);
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

  favCache.favourites = collected;
}

export function Grid() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (retry = true) => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/favourites/list`,
          { withCredentials: true }
        );

        const ids = res.data.data;

        if (favCache.favourites.length !== ids.length) {
          setAnime([]);
          await fetchAnime(ids, setAnime);
        } else {
          setAnime(favCache.favourites);
        }
      } catch (err) {
        if (err.response?.status === 401 && retry) {
          try {
            await axios.post(
              `${import.meta.env.VITE_API_URL}/api/v1/auth/refresh-token`,
              {},
              { withCredentials: true }
            );
            return await load(false);
          } catch {
            try {
              await axios.post(
                `${import.meta.env.VITE_API_URL}/api/v1/auth/logout`,
                {},
                { withCredentials: true }
              );
            } catch { console.log("error")}
            alert("Refresh token expired. Login again.");
          }
        }
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await load();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading first time will take some time please remain patient</p>;
  if (anime.length === 0) return (
    <div className="empty-container">
      <img src={`${import.meta.env.BASE_URL}icons/cart.png`} />
      <h1>Your Favourites is Empty</h1>
    </div>
  );
  return <CardGrid anime={anime} title="Favourites" setAnime={setAnime} />;
}