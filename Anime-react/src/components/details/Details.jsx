import { AnimeInfo } from "./AnimeInfo";
import { Media } from "./Media";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Characters } from "./Characters";
import { CharacterCard } from "./CharacterCard";
import './details.css';

export function Details({ topAnime, airingAnime }) {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  useEffect(() => {
  if (!topAnime.length && !airingAnime.length) return;

  const animeId = Number(id);

  const foundInTop =
    topAnime.find((a) => a.mal_id === animeId);

  if (foundInTop) {
    setAnime(foundInTop);
    return;
  }

  const foundInAiring =
    airingAnime.find((a) => a.mal_id === animeId);

  setAnime(foundInAiring || null);
}, [topAnime, airingAnime, id]);


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
