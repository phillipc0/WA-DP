import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import EditPage from "@/pages/edit";

/**
 * Main application component with routing
 * @returns App component with routes
 */
function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<EditPage />} path="/edit" />
    </Routes>
  );
}

export default App;
