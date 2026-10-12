import "./AvailableInfo.css";

const knownServices = [
  { match: /crunchyroll/i, name: "Crunchyroll", icon: "crunchyroll.png" },
  { match: /netflix/i, name: "Netflix", icon: "Netflix.png" },
  { match: /muse/i, name: "Muse Asia", icon: "Muse logo.png" },
];

export function AvailableInfo({ anime }) {
  const episodes = anime?.streamingEpisodes || [];
  const services = [...new Map(episodes.map((episode) => {
    const service = knownServices.find(({ match }) => match.test(episode.site || ""));
    return service ? [service.name, { ...service, url: episode.url }] : [episode.site, null];
  }).filter(([, service]) => service)).values()];

  if (!services.length) return null;

  return (
    <div className="logoContainer">
      <p>Available On</p>
      <div className="logos">
        {services.map((service) => (
          <a key={service.name} href={service.url} target="_blank" rel="noreferrer" aria-label={service.name}>
            <img src={`${import.meta.env.BASE_URL}icons/${service.icon}`} alt={service.name} />
          </a>
        ))}
      </div>
    </div>
  );
}
