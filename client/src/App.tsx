import { useEffect, useState } from "react";
import "./App.css";
import FeedPage from "./pages/feedpage/FeedPage";
import SubmitPage from "./pages/submitpage/SubmitPage";
import AboutPage from "./pages/aboutpage/AboutPage";
import IUser from "./types/IUser";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { loadAuth } from "./gateways/AuthGateway";
import ProfilePage from "./pages/profilepage/ProfilePage";
import PostPage from "./pages/postpage/PostPage";

function App() {
  // Auth/user state
  const [user, setUser] = useState<IUser>();

  // Fetch user
  useEffect(() => {
    loadAuth().then((response) => {
      if (response.success && response.payload) {
        setUser(response.payload);
      }
    });
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<FeedPage user={user} moderatorView={false} />}
          />
          <Route path="/post/:postNumber" element={<PostPage user={user} />} />
          <Route
            path="/profile"
            element={<ProfilePage user={user} profileUser={user} />}
          />
          <Route path="/submit" element={<SubmitPage user={user} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/moderator"
            element={<FeedPage user={user} moderatorView={true} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
