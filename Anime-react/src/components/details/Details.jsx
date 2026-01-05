import { AnimeInfo } from "./AnimeInfo";
import { Media } from "./Media";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Characters } from "./Characters";
import { CharacterCard } from "./CharacterCard";

export function Details({ topAnime }) {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  useEffect(() => {
    if (!topAnime.length) return;

    const found = topAnime.find((a) => a.mal_id === Number(id));

    setAnime(found || null);
  }, [topAnime, id]);

  useEffect(() => {
    console.log(anime);
  }, [anime]);

  return (
    <>
      <Media anime={anime}></Media>
      <AnimeInfo anime={anime}></AnimeInfo>
      <Characters id={id}></Characters>
    </>
  );
}
