import { useEffect, useState } from "react";
import FeedPage from "./feedpage/FeedPage";
import SubmitPage from "./submitpage/SubmitPage";
import AboutPage from "./aboutpage/AboutPage";
import IUser from "../types/IUser";
import { loadAuth } from "../gateways/AuthGateway";
import ProfilePage from "./profilepage/ProfilePage";
import PostPage from "./postpage/PostPage";
import SearchPage from "./searchpage/SearchPage";
import NotFoundPage from "pages/notfoundpage/NotFoundPage";
import ModeratorFeed from "../components/feeds/ModeratorFeed";
import MainFeed from "../components/feeds/mainfeed/MainFeed";
import { IsMobileProvider } from "../hooks/is-mobile";
import Sidebar from "components/page/sidebar/Sidebar";
import MainFeedSidebar from "components/feeds/mainfeed/MainFeedSidebar";
import PageAndSidebar from "components/page/pageandsidebar/PageAndSidebar";
import Head from "next/head";

function Home() {
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
      <Head>
        <title>Dear Blueno</title>
      </Head>
      <IsMobileProvider>
        <div className="ColumnsContainer">
          <Sidebar />
          <PageAndSidebar
            title="Home"
            page={<MainFeed user={user} />}
            sidebar={<MainFeedSidebar user={user} />}
          />
        </div>
      </IsMobileProvider>
    </div>
  );
}

function MainRoutes() {
  return {
    /* <Routes>
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
          element={
            <PageAndSidebar
              title="Profile"
              page={<ProfilePage user={user} />}
            />
          }
        />
        <Route
          path="/profile"
          element={
            <PageAndSidebar
              title="Profile"
              page={<ProfilePage user={user} />}
            />
          }
        />
        <Route path="/submit" element={<SubmitPage user={user} />} />
        <Route
          path="/about"
          element={<PageAndSidebar page={<AboutPage user={user} />} />}
        />
        <Route
          path="/search"
          element={
            <PageAndSidebar title="Search" page={<SearchPage user={user} />} />
          }
        />
        <Route
          path="/moderator"
          element={
            <FeedPage>
              <ModeratorFeed user={user} />
            </FeedPage>
          }
        />
        <Route path="*" element={<PageAndSidebar page={<NotFoundPage />} />} />
      </Routes> */
  };
}

export default Home;
