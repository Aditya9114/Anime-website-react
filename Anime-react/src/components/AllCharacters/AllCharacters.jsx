import { CharacterCard } from "../details/CharacterCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import './allcharacters.css'

export function AllCharacters() {
  const { id } = useParams();

  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`https://api.jikan.moe/v4/anime/${id}/characters`)
      .then((res) => setCharacters(res.data.data))
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    console.log(characters);
  }, [characters]);
  return (
    <>
    {characters.length > 0 ? (
        <> 
      <div className="heading">
        <h1>Characters</h1>
      </div>

      <div className="charGird">
        {characters.map((chars) => (
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
      </>) : (
        <p id="buffer">Loading Characters...</p>
      ) }
    </>
  );
}
