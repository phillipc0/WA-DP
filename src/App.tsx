import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import EditPage from "@/pages/edit";
import ImprintPage from "@/pages/imprint";
import PrivacyPage from "@/pages/privacy";

/**
 * Main application component with routing
 * @returns App component with routes
 */
function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<EditPage />} path="/edit" />
      <Route element={<ImprintPage />} path="/imprint" />
      <Route element={<PrivacyPage />} path="/privacy" />
    </Routes>
  );
}

export default App;
