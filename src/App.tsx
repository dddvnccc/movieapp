import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/home/Home";
import DetailShow from "./pages/DetailShow/DetailShow";
import { useLocation } from "react-router";
import { useEffect } from "react";
function App() {
  const location =  useLocation()
  useEffect(() => {
    window.scrollTo(0,0)
  }, [location])
  
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="/discover/:media_type/detail/:show_id"
            element={<DetailShow />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
