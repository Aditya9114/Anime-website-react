import { useEffect, useState } from "react";
import { CardGrid } from "../homepage/CardGrid";
import { favCache } from "../homepage/cache";
import axios from "axios";
import "./menu-btns.css"

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function Grid() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAnime(ids) {
    const collected = [];

    for (let i = 0; i < ids.length; i++) {
      try {
        const res = await axios.get(`https://api.jikan.moe/v4/anime/${ids[i]}`);
        collected.push(res.data.data);
        setAnime((prev) => [...prev, res.data.data]);
      } catch (err) {
        if (err.response?.status === 429) {
          await delay(1500);
          i--;
        }
      }
    }

    favCache.favourites = collected;
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/favourites/list`,
          { withCredentials: true }
        );

        const ids = res.data.data;

        if (favCache.favourites.length !== ids.length) {
          console.log("Fetching from API");
          setAnime([]);
          await fetchAnime(ids);
        } else {
          console.log("Got from cache");
          setAnime(favCache.favourites);
        }
      } catch (err) {
        console.error("Failed to load favourites", err);
      } finally {
        setLoading(false); 
      }
    };

    load();
  }, []);

  if (loading) return <p style={{ color: "white" }}>Loading first time will take some time please remain patient</p>;
  if (anime.length === 0) return (
    <div className="empty-container">
      <img
      src={`${import.meta.env.BASE_URL}icons/cart.png`}
      />
      <h1>Your Favourites is Empty</h1>
    </div>
  );
  return <CardGrid anime={anime} title="Favourites" setAnime={setAnime} />;
}