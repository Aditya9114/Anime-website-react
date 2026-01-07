import './detailsheader.css';

export function DetailsHeader() {
  return (
    <header >
      <nav className="details-nav-bar">
        <a href="#characters">Characters</a>
        <a href="#studio">Studio</a>
        <a href="#studio">Recommendations</a>
        <a href="#reviews">Reviews</a>
      </nav>
    </header>
  );
}
