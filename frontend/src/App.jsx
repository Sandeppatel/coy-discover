import { useState } from "react";
import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import Matches from "./pages/Matches";

function App() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      {activePage === "home" && (
        <div className="min-h-[80vh] bg-gray-50"></div>
      )}

      {activePage === "feed" && <Feed />}

      {activePage === "matches" && <Matches />}
    </div>
  );
}

export default App;