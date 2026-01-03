import { Header } from './Header.jsx';
import {SearchBar} from './SearchBar.jsx';
import {CardGrid} from './CardGrid.jsx';

export function HomePage({ topAnime }) {
  return (
    <>
      <Header />
      <section className="search-section">
        <SearchBar />
      </section>
      <CardGrid anime={topAnime} />
    </>
  );
}
