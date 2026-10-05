import { Route, Routes } from "react-router-dom";
import Home from "@/pages/home";
import AnimeList from "@/pages/anime-list";
import AnimeDetail from "@/pages/anime-detail";
import Watch from "@/pages/watch";
import NotFound from "@/pages/not-found";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/anime-list" element={<AnimeList />} />
      <Route path="/anime/:malId/:slug" element={<AnimeDetail />} />
      <Route path="/watch/:streamId" element={<Watch />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
