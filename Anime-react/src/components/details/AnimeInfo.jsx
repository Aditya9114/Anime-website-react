import "./animeinfo.css";

export function AnimeInfo({ anime }) {
  return (
    <>

      <div className="titleContainer">
        {anime && <h1>{anime.title_english}</h1>}
      </div>

      <div className="infoContainer">
        {anime && <img src={anime.images?.jpg?.image_url} alt={anime.title} />}

        <div className="syn">

          <div className="rating">
            {anime && <img src="/icons/star.png" id="star" />}
            {anime && <p>{anime.score}  |  10</p>}
          </div>
          <p>{anime && anime.synopsis}</p>
          <div className="tags">
            {anime && anime.genres[0] && <p>{anime.genres[0].name}</p>}
            {anime && anime.genres[1] && <p>{anime.genres[1].name}</p>}
            {anime && anime.genres[2] && <p>{anime.genres[2].name}</p>}
            {anime && anime.genres[3] && <p>{anime.genres[3].name}</p>}
            {anime && anime.genres[4] && <p>{anime.genres[4].name}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
