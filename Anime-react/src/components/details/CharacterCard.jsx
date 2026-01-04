import { useState, useEffect } from "react";
import axios from "axios";
import "./charactercard.css";
export function CharacterCard({ id }) {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`https://api.jikan.moe/v4/anime/${id}/characters`)
      .then((res) => {
        setCharacters(res.data.data);
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    console.log(characters);
  }, [characters]);

  if (!characters.length) {
    return <p style={{ color: "white" }}>Loading characters…</p>;
  }

  return (
    <div className="charBody">
      {characters[0]?.character?.images?.jpg?.image_url && (
        <img
          src={characters[0].character.images.jpg.image_url}
          alt={characters[0].character.name}
        />
      )}
      {characters[0]?.character?.name && <p>{characters[0].character.name}</p>}
      {characters[0]?.role && <p>{characters[0].role}</p>}
      {characters?.[0]?.voice_actors?.find((va) => va.language === "Japanese")
        ?.person?.name && (
        <div>
          <p>Japanese Voice Actor</p>
          <p>
            {
              characters[0].voice_actors.find(
                (va) => va.language === "Japanese"
              ).person.name
            }
          </p>
        </div>
      )}
      {characters?.[0]?.voice_actors?.find((va) => va.language === "English")
        ?.person?.name && (
        <div>
          <p>English Voice Actor</p>
          <p>
            {
              characters[0].voice_actors.find((va) => va.language === "English")
                .person.name
            }
          </p>
        </div>
      )}
    </div>
  );
}
