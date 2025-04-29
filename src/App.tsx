import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import GeneratorPage from "@/pages/generator";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<GeneratorPage />} path="/generator" />
    </Routes>
  );
}

export default App;
