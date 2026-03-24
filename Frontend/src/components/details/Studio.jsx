import "./studio.css";

export function Studio({ anime }) {
  return (
    <>
      <div className="studio-body">
        <div className="stuido-header">
          <h1>Studios & Producers</h1>
        </div>
        <div className="studio-div" id="studio">
          <h1>Studios</h1>
          <div className="studio">
            {anime?.studios?.map((studio) => (
              <p key={studio.mal_id}>{studio.name}</p>
            ))}
          </div>

          <div className="producers">
            <h1>Producers</h1>
            {anime?.producers?.map((producer) => (
              <p key={producer.mal_id}>{producer.name}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
