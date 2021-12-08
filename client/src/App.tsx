import { useEffect, useState } from "react";
import "./App.css";
import FeedPage from "./pages/FeedPage";
import SubmitPage from "./pages/submitpage/SubmitPage";
import IUser from "./types/IUser";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { loadAuth } from "./gateways/AuthGateway";

function App() {
  // Auth/user state
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);

  // Fetch user
  useEffect(() => {
    loadAuth().then((response) => {
      if (response.success && response.payload) {
        setUser(response.payload);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/submit" element={<SubmitPage />} />
          <Route
            path="/"
            element={<FeedPage user={user} loading={loading} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
