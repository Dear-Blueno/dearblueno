import "./App.css";
import FeedPage from "./pages/FeedPage";
import SubmitPage from "./pages/submitpage/SubmitPage";
import IUser from "./types/IUser";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    async function getUser() {
      // await fetchUser(setUser, setError);
      // setLoading(false);
    }
    getUser();
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/" element={<FeedPage user={user} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
