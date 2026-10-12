import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAnimeByMalId } from "../../services/anilist.js";
import { AnimeInfo } from "./AnimeInfo";
import { Media } from "./Media";
import { Characters } from "./Characters";
import { DetailsHeader } from "./DetailsHeader";
import Comments from "./comments";
import { Studio } from "./Studio";
import { Recommendations } from "./Recommendations";
import { AiringInfo } from "./AiringInfo";
import { AvailableInfo } from "./AvailableInfo";

export function Details() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (!id) return;
    setAnime(null);
    setError(false);
    getAnimeByMalId(id)
      .then((result) => {
        if (!result) throw new Error("No AniList entry has this MAL ID");
        setAnime(result);
      })
      .catch((err) => {
        console.error("Anime details request failed", err);
        setError(true);
      });
  }, [id]);

  if (error) return <p style={{ color: "white" }}>Anime not found or temporarily unavailable.</p>;

  return (
    <>
      <Media anime={anime} />
      <DetailsHeader />
      <AnimeInfo anime={anime} id={id} />
      <AvailableInfo anime={anime} />
      <AiringInfo anime={anime} />
      <Characters anime={anime} />
      <Studio anime={anime} />
      <Comments />
      <Recommendations anime={anime} />
    </>
  );
}
