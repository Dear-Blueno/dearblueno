import { loadAuth } from "../gateways/AuthGateway";
import MainFeed from "../components/feeds/mainfeed/MainFeed";
import MainFeedSidebar from "components/feeds/mainfeed/MainFeedSidebar";
import Head from "next/head";
import { useQuery } from "react-query";
import MainLayout from "components/layout/MainLayout";

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
        page={<MainFeed user={user} />}
        sidebar={<MainFeedSidebar user={user} />}
      ></MainLayout>
    </>
  );
}

export default HomePage;
