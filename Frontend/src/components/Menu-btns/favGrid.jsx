import { useEffect, useState } from "react";
import { CardGrid } from "../homepage/CardGrid";
import axios from "axios";

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function fetchAnime(ids, setAnime) {
  for (let i = 0; i < ids.length; i++) {
    try {
      const res = await axios.get(
        `https://api.jikan.moe/v4/anime/${ids[i]}`
      );

      setAnime(prev => [...prev, res.data.data]);

      // await delay(300); // SAFE rate
    } catch (err) {
      if (err.response?.status === 429) {
        await delay(1500); // backoff
        i--; // retry same id
      }
    }
  }
}

export function Grid() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/favourites/list`,
        { withCredentials: true }
      );

      const ids = res.data.data;
      

      await fetchAnime(ids, setAnime);
      setLoading("Completed");
    };

    load();
  }, []);

  if(loading === "Completed" && anime.length == 0 ){
    return(
      <h1>Your Favourites is Empty</h1>
    )
  }

  else if(loading === "Completed"){
    return(
        <CardGrid anime={anime} title="Favourites" setAnime={setAnime}/>
    )
  }
  else{
    return(
        <p style={{ color: "white" }}>Loading...</p>
    )
  }
}