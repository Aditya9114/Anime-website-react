import { CharacterCard } from "./CharacterCard";
import { useNavigate } from "react-router-dom";
import "./characters.css";

const firstName = (actors = []) => actors[0]?.name?.full || "Unknown";

export function Characters({ anime }) {
  const navigate = useNavigate();
  const characters = anime?.characters?.edges || [];

  return (
    <>
      <div className="heading"><h1>Characters</h1></div>
      <div className="charGird" id="characters">
        {characters.slice(0, 5).map((edge) => (
          <CharacterCard
            key={edge.node.id}
            src={edge.node.image?.large}
            name={edge.node.name?.full || "Unknown"}
            role={edge.role || "BACKGROUND"}
            jpVa={firstName(edge.voiceActorsJp)}
            enVa={firstName(edge.voiceActorsEn)}
            spVa={firstName(edge.voiceActorsEs)}
            frVa={firstName(edge.voiceActorsFr)}
            itVa={firstName(edge.voiceActorsIt)}
            geVa={firstName(edge.voiceActorsDe)}
            manVa={firstName(edge.voiceActorsZh)}
          />
        ))}
      </div>
      {anime?.idMal && <div id="btn1"><button onClick={() => navigate(`/All-Characters/${anime.idMal}`)}>Load More Characters</button></div>}
    </>
  );
}
