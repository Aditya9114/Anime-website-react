
import {CardGrid} from './CardGrid.jsx';
import './topratedanime.css'


export function TopRatedAnime({ topAnime }) {
  return (
    !topAnime || topAnime.length == 0 ? 
    (
      <div className='loading-error'>
        <h3>Something went wrong while loading the top anime </h3>
      </div>
    ) : (
      <>
        <CardGrid anime={topAnime} title="Top 25 Highest-Rated Anime"/>
      </>
    )
  );
}
