
import { Routes, Route } from "react-router-dom"; // ✅ FIXED
import { Details } from "./components/details/Details";

import "./App.css";
import { Media } from "./components/details/Media";
import { TopRatedAnime } from "./components/homepage/TopRatedAnime";
import { TopAiringGrid } from "./components/homepage/TopAiringGrid";
import { HomePage } from "./components/homepage/HomePage";
import { AllCharacters } from "./components/AllCharacters/AllCharacters";
import { Grid } from "./components/favourites/favGrid";

import Login from "./components/login/login";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage></HomePage>} />
      <Route path="/details/:id" element={<Details/>} />
      <Route path="/All-Characters/:id" element={<AllCharacters />}></Route>
      <Route path="/login" element={<Login isLogin={true} />} />
      <Route path="/register" element={<Login isLogin={false} />} />
      {/* <Route path="/comments" element={<CommentForm/>} /> */}
      <Route path="/favourites" element={<Grid />} />
    </Routes>
  );
}

export default App;
