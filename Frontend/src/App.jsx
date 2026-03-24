
import { Routes, Route } from "react-router-dom"; // ✅ FIXED
import { Details } from "./components/details/Details";

import "./App.css";
import { Media } from "./components/details/Media";
import { TopRatedAnime } from "./components/homepage/TopRatedAnime";
import { TopAiringGrid } from "./components/homepage/TopAiringGrid";
import { HomePage } from "./components/homepage/HomePage";
import { AllCharacters } from "./components/AllCharacters/AllCharacters";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage></HomePage>} />
      <Route path="/details/:id" element={<Details/>} />
      <Route path="/All-Characters/:id" element={<AllCharacters />}></Route>
    </Routes>
  );
}

export default App;
