import { CharacterCard } from "../details/CharacterCard";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllAnimeCharacters } from "../../services/anilist.js";
import "./allcharacters.css";

const firstName = (actors = []) => actors[0]?.name?.full || "Unknown";

export function AllCharacters() {
  const { id } = useParams();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAllAnimeCharacters(id)
      .then((results) => { if (active) setCharacters(results); })
      .catch((error) => { console.error("Character request failed", error); if (active) setCharacters([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <p id="buffer">Loading Characters...</p>;
  if (!characters.length) return <p id="buffer">No characters available.</p>;

  return (
    <>
      <div className="heading"><h1>Characters</h1></div>
      <div className="charGird">
        {characters.map((edge) => (
          <CharacterCard
            key={edge.node.id}
            src={edge.node.image?.large}
            name={edge.node.name?.full || "Unknown"}
            role={edge.role || "BACKGROUND"}
            jpVa={firstName(edge.voiceActorsJp)} enVa={firstName(edge.voiceActorsEn)}
            spVa={firstName(edge.voiceActorsEs)} frVa={firstName(edge.voiceActorsFr)}
            itVa={firstName(edge.voiceActorsIt)} geVa={firstName(edge.voiceActorsDe)}
            manVa={firstName(edge.voiceActorsZh)}
          />
        ))}
      </div>
    </>
  );
}
