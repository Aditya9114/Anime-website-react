
import {CardGrid} from './CardGrid.jsx';
import './topratedanime.css'


export function TopRatedAnime({ topAnime }) {
  return (
    <>
      <CardGrid anime={topAnime} title="Top 25 Highest-Rated Anime"/>
    </>
  );
}
