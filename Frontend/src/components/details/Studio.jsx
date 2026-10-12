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
            {anime?.studios?.edges?.filter((edge) => edge.isMain).map(({ node: studio }) => (
              <p key={studio.id}>{studio.name}</p>
            ))}
          </div>

          <div className="producers">
            <h1>Producers</h1>
            {anime?.studios?.edges?.filter((edge) => !edge.isMain).map(({ node: producer }) => (
              <p key={producer.id}>{producer.name}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
