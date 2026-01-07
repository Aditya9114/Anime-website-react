import { AnimeInfo } from "./AnimeInfo";
import { Media } from "./Media";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Characters } from "./Characters";
import { CharacterCard } from "./CharacterCard";
import { DetailsHeader } from "./DetailsHeader";
import './details.css';
import { Studio } from "./studio";

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
      <DetailsHeader></DetailsHeader>
      <AnimeInfo anime={anime}></AnimeInfo>
      <Characters id={id}></Characters>
      <Studio anime={anime}></Studio>
    </>
  );
}
