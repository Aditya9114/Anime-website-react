import axios from "axios";
import { useEffect, useState } from "react";
import { CharacterCard } from "./CharacterCard";
import { useNavigate } from "react-router-dom";
import "./characters.css";

export function Characters({ id }) {
  const [characters, setCharacters] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    async function getchar(){
      await new Promise(r => setTimeout(r, 800));

      axios
      .get(`https://api.jikan.moe/v4/anime/${id}/characters`)
      .then((res) => setCharacters(res.data.data))
      .catch(console.error);
    }
    getchar();
  }, [id]);

  useEffect(() => {
    console.log(characters);
  }, [characters]);

  return (
    <>
      <div className="heading">
        <h1>Characters</h1>
      </div>

      <div className="charGird" id="characters">
        {characters.slice(0, 5).map((chars) => (
          <CharacterCard
            key={chars.character.mal_id}
            src={chars?.character?.images?.jpg?.image_url}
            name={chars?.character?.name}
            role={chars?.role}
            jpVa={chars?.voice_actors?.[0]?.person?.name || "Unknown"}
            enVa={chars?.voice_actors?.[1]?.person?.name || "Unknown"}
            spVa={chars?.voice_actors?.[5]?.person?.name || "Unknown"}
            frVa={chars?.voice_actors?.[2]?.person?.name || "Unknown"}
            itVa={chars?.voice_actors?.[4]?.person?.name || "Unknown"}
            geVa={chars?.voice_actors?.[6]?.person?.name || "Unknown"}
            manVa={chars?.voice_actors?.[7]?.person?.name || "Unknown"}
          />
        ))}
      </div>
      <div id="btn1">
        <button onClick={() => navigate(`/All-Characters/${id}`)}>
          Load More Characters
        </button>
      </div>
    </>
  );
}
