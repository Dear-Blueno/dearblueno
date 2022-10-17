import MainFeed from "../components/feeds/MainFeed";
import MainFeedSidebar from "components/sidebar/mainfeed/MainFeedSidebar";
import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import MainFeedHeader from "components/header/mainfeed/MainFeedHeader";
import { GetStaticProps, NextPage } from "next";
import { getPosts } from "gateways/PostGateway";
import { useIsMobile } from "hooks/is-mobile";
import Logo from "components/layout/Logo";
import { useState } from "react";

const HomePage: NextPage = () => {
  const isMobile = useIsMobile();
  const [showingPicker, setShowingPicker] = useState(false);
  return (
    <>
      <Head>
        <title>Dear Blueno</title>
      </Head>
      <MainLayout
        title={
          <span
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: isMobile ? "-0.2rem" : 0,
            }}
          >
            {isMobile && <Logo />}
            {(!showingPicker || !isMobile) && "Dear Blueno"}
          </span>
        }
        header={
          <MainFeedHeader
            showingPicker={showingPicker}
            setShowingPicker={setShowingPicker}
          />
        }
        page={<MainFeed />}
        sidebar={<MainFeedSidebar />}
      ></MainLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts(1, "hot");
  if (posts.success) {
    return {
      props: {
        initialPosts: posts.payload,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most every 30 seconds
      revalidate: 30,
    };
  }
  return {
    props: {
      initialPosts: [],
    },
    revalidate: 5,
  };
};

export default HomePage;
