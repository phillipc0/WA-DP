import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import EditPage from "@/pages/edit";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<EditPage />} path="/edit" />
    </Routes>
  );
}

export default App;
