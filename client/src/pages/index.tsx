import { loadAuth } from "../gateways/AuthGateway";
import MainFeed from "../components/feeds/mainfeed/MainFeed";
import MainFeedSidebar from "components/sidebar/mainfeed/MainFeedSidebar";
import Head from "next/head";
import { useQuery } from "react-query";
import MainLayout from "components/layout/MainLayout";
import MainFeedHeader from "components/header/MainFeedHeader";

function HomePage() {
  const {
    isLoading,
    error,
    data: user,
  } = useQuery("user", () =>
    loadAuth().then((response) => {
      if (response.success && response.payload) {
        return response.payload;
      }
    })
  );

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
