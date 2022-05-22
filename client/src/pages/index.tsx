import styles from "styles/layout.module.scss";
import { loadAuth } from "../gateways/AuthGateway";
import MainFeed from "../components/feeds/mainfeed/MainFeed";
import { IsMobileProvider } from "../hooks/is-mobile";
import MainFeedSidebar from "components/feeds/mainfeed/MainFeedSidebar";
import Head from "next/head";
import { useQuery } from "react-query";
import Page from "components/layout/Page";
import PageHeader from "components/layout/PageHeader";
import PageSidebar from "components/layout/PageSidebar";
import HeaderAndPage from "components/layout/HeaderAndPage";

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
      <HeaderAndPage>
        <PageHeader title="Home" />
        <Page>
          <MainFeed user={user} />
        </Page>
      </HeaderAndPage>
      <PageSidebar>
        <MainFeedSidebar user={user} />
      </PageSidebar>
    </>
  );
}

export default HomePage;
