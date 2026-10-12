import './airingInfo.css'


export function AiringInfo({ anime }) {
  if (!anime) return null;

  const next = anime.nextAiringEpisode;
  const date = anime.startDate;
  const end = anime.endDate;
  const dateLabel = (value) => [value?.year, value?.month, value?.day].filter(Boolean).join("-") || "Unknown";

  return (
    <div className="airingInfo-container">
      <h1>Broadcast Schedule</h1>
      <p>Airing Status : {anime.status || "Unknown"}</p>
      {next ? (
        <>
          <p>Next Episode : {next.episode}</p>
          <p>Air time : {new Date(next.airingAt * 1000).toLocaleString()}</p>
          {Number.isFinite(next.timeUntilAiring) && next.timeUntilAiring >= 0 && <p>Countdown : {Math.floor(next.timeUntilAiring / 86400)} days</p>}
        </>
      ) : anime.status === "FINISHED" ? (
        <p>Finished : {dateLabel(date)} – {dateLabel(end)} · {anime.episodes ?? "Unknown"} episodes</p>
      ) : anime.status === "NOT_YET_RELEASED" ? (
        <p>Release date : {dateLabel(date)}</p>
      ) : (
        <p>No upcoming episode schedule available.</p>
      )}
    </div>
  );
}
