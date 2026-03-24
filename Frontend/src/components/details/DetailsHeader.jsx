import "./detailsheader.css";

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export function DetailsHeader() {
  return (
    <header>
      <nav className="details-nav-bar">
        <button onClick={() => scrollTo("characters")}>Characters</button>
        <button onClick={() => scrollTo("studio")}>Studio</button>
        <button onClick={() => scrollTo("recommendations")}>Recommendations</button>
        <button onClick={() => scrollTo("reviews")}>Reviews</button>
      </nav>
    </header>
  );
}
