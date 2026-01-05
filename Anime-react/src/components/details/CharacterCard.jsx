import "./charactercard.css";

export function CharacterCard({
  src,
  name,
  role,
  jpVa,
  enVa,
  frVa,
  geVa,
  itVa,
  manVa,
  spVa,
}) {
  // Helper to dim "Unknown" text automatically
  const getClass = (text) => (text === "Unknown" ? "value unknown" : "value");

  return (
    <div className="charBody">
      <img src={src} alt={name} className="charImage" />
      
      {/* Primary Info Group (Name & Role) */}
      <div className="primary-info">
        <div className="info-block name-block">
          <p className="label">Name</p>
          <p className="value name-text">{name}</p>
        </div>

        <div className="info-block role-block">
          <p className="label">Role</p>
          <span className={`role-badge ${role.toLowerCase()}`}>{role}</span>
        </div>
      </div>

      {/* Voice Actors Grid */}
      <div className="va-grid">
        <div className="info-block">
          <p className="label">Japanese</p>
          <p className={getClass(jpVa)}>{jpVa}</p>
        </div>
        <div className="info-block">
          <p className="label">English</p>
          <p className={getClass(enVa)}>{enVa}</p>
        </div>
        <div className="info-block">
          <p className="label">Spanish</p>
          <p className={getClass(spVa)}>{spVa}</p>
        </div>
        <div className="info-block">
          <p className="label">French</p>
          <p className={getClass(frVa)}>{frVa}</p>
        </div>
        <div className="info-block">
          <p className="label">Italian</p>
          <p className={getClass(itVa)}>{itVa}</p>
        </div>
        <div className="info-block">
          <p className="label">Mandarin</p>
          <p className={getClass(manVa)}>{manVa}</p>
        </div>
        <div className="info-block">
          <p className="label">German</p>
          <p className={getClass(geVa)}>{geVa}</p>
        </div>
      </div>
    </div>
  );
}