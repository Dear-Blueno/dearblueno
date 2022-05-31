import MainFeed from "../components/feeds/mainfeed/MainFeed";
import MainFeedSidebar from "components/sidebar/mainfeed/MainFeedSidebar";
import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import MainFeedHeader from "components/header/MainFeedHeader";
import useUser from "hooks/useUser";

function HomePage() {
  const user = useUser();

  return (
    <>
      <Head>
        <title>Dear Blueno</title>
      </Head>
      <MainLayout
        title="Home"
        header={<MainFeedHeader />}
        page={<MainFeed user={user} />}
        sidebar={<MainFeedSidebar user={user} />}
      ></MainLayout>
    </>
  );
}

export default HomePage;
