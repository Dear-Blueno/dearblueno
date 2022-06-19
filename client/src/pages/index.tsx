import MainFeed from "../components/feeds/MainFeed";
import MainFeedSidebar from "components/sidebar/mainfeed/MainFeedSidebar";
import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import MainFeedHeader from "components/header/MainFeedHeader";
import { GetStaticProps, NextPage } from "next";
import { getPosts } from "gateways/PostGateway";
import IPost from "types/IPost";

type HomePageProps = {
  posts: IPost[];
};

const HomePage: NextPage<HomePageProps> = (props) => {
  return (
    <>
      <Head>
        <title>Dear Blueno</title>
      </Head>
      <MainLayout
        title="Home"
        header={<MainFeedHeader />}
        page={<MainFeed posts={props.posts} />}
        sidebar={<MainFeedSidebar />}
      ></MainLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getPosts(1);
  if (posts.success) {
    console.log(JSON.stringify(posts.payload));
    return {
      props: {
        posts: posts.payload,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most every 30 seconds
      revalidate: 30,
    };
  }
  return {
    props: {
      posts: [],
    },
    revalidate: 5,
  };
};

export default HomePage;
