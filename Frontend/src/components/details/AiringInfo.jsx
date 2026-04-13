import './airingInfo.css'

export function AiringInfo({ anime }) {
  if (!anime) return null;

  return anime.airing ? (
    <div className="airingInfo-container">
      <h1>Broadcast Schedule</h1>
      <p>Day & Time : {anime.broadcast?.string || "Unknown"}</p>
    </div>
  ) : (
    <div className="airingInfo-container">
      <h2>Airing Status : Not airing</h2>
    </div>
  );
}