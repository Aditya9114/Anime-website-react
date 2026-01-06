import { TopAiringGrid } from "./TopAiringGrid";
import { TopRatedAnime } from "./TopRatedAnime";
import { Header } from "./Header.jsx";
import { SearchBar } from "./SearchBar.jsx";

export function HomePage({anime, topAnime}) {
  return (
    <>
      <Header />
      <section className="search-section">
        <SearchBar />
      </section>
      <TopAiringGrid anime={anime} />
      <TopRatedAnime topAnime={topAnime}/>
    </>
  );
}
