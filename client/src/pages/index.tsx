import { loadAuth } from "../gateways/AuthGateway";
import MainFeed from "../components/feeds/mainfeed/MainFeed";
import { IsMobileProvider } from "../hooks/is-mobile";
import MainFeedSidebar from "components/feeds/mainfeed/MainFeedSidebar";
import PageAndSidebar from "components/page/pageandsidebar/PageAndSidebar";
import Head from "next/head";
import { useQuery } from "react-query";

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
      <IsMobileProvider>
        <PageAndSidebar
          title="Home"
          page={<MainFeed user={user} />}
          sidebar={<MainFeedSidebar user={user} />}
        />
      </IsMobileProvider>
    </>
  );
}

export default HomePage;
