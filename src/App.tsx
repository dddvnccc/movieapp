import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/home/Home";
import DetailShow from "./pages/DetailShow/DetailShow";
import { useLocation } from "react-router";
import { useEffect } from "react";
import ShowList from "./pages/ShowList/ShowList";
import List from "./pages/List/List";
function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/:media_type" element={<ShowList />} />
          <Route path="/:media_type/detail/:show_id" element={<DetailShow />} />
          <Route path="/List" element={<List />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
