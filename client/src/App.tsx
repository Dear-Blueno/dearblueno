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
import SearchPage from "./pages/searchpage/SearchPage";
import NotFoundPage from "pages/notfoundpage/NotFoundPage";
import ModeratorFeed from "./components/feeds/ModeratorFeed";
import MainFeed from "./components/feeds/mainfeed/MainFeed";
import { IsMobileProvider } from "./hooks/is-mobile";
import Sidebar from "components/page/sidebar/Sidebar";
import MainFeedSidebar from "components/feeds/mainfeed/MainFeedSidebar";
import PageAndSidebar from "components/page/pageandsidebar/PageAndSidebar";

function App() {
  return (
    <div className="App">
      <IsMobileProvider>
        <Router>
          <MainRoutes />
        </Router>
      </IsMobileProvider>
    </div>
  );
}

function MainRoutes() {
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
    <div className="ColumnsContainer">
      {/* <Header
        user={user}
        moderatorView={location.pathname === "/moderator"}
        hidden={location.pathname === "/search"}
        subtle={
          location.pathname === "/submit" ||
          location.pathname.startsWith("/profile")
        }
      /> */}
      <Sidebar />

      <Routes>
        <Route
          path="/"
          element={
            <PageAndSidebar
              title="Home"
              page={<MainFeed user={user} />}
              sidebar={<MainFeedSidebar user={user} />}
            />
          }
        />
        <Route path="/post/:postNumber" element={<PostPage user={user} />} />
        <Route
          path="/profile/:profileUserID"
          element={<ProfilePage user={user} />}
        />

        <Route
          path="/profile"
          element={<ProfilePage user={user} profileUser={user} />}
        />
        <Route path="/submit" element={<SubmitPage user={user} />} />
        <Route
          path="/about"
          element={<PageAndSidebar page={<AboutPage user={user} />} />}
        />
        <Route path="/search" element={<SearchPage />} />
        <Route
          path="/moderator"
          element={
            <FeedPage>
              <ModeratorFeed user={user} />
            </FeedPage>
          }
        />
        <Route path="*" element={<PageAndSidebar page={<NotFoundPage />} />} />
      </Routes>
    </div>
  );
}

export default App;
