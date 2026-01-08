import { AnimeInfo } from "./AnimeInfo";
import { Media } from "./Media";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Characters } from "./Characters";
import { CharacterCard } from "./CharacterCard";
import { DetailsHeader } from "./DetailsHeader";
import './details.css';
import { Studio } from "./studio";
import { Recommendations } from "./Recommendations";
import axios from "axios";

export function Details() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
//   useEffect(() => {
//   if (!topAnime.length && !airingAnime.length) return;

//   const animeId = Number(id);

//   const foundInTop =
//     topAnime.find((a) => a.mal_id === animeId);

//   if (foundInTop) {
//     setAnime(foundInTop);
//     return;
//   }

//   const foundInAiring =
//     airingAnime.find((a) => a.mal_id === animeId);

//   setAnime(foundInAiring || null);
// }, [topAnime, airingAnime, id]);

useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant" // or "smooth" if you like
  });
}, [id]);


  useEffect(() => {
  if (!id) return;

  setAnime(null); // 🔥 ADD THIS LINE

  axios
    .get(`https://api.jikan.moe/v4/anime/${id}`)
    .then((res) => {
      setAnime(res.data.data);
    })
    .catch(console.error);
}, [id]);



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
      <Recommendations id={id}></Recommendations>
    </>
  );
}
