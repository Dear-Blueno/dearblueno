import MainFeed from "../components/feeds/MainFeed";
import MainFeedSidebar from "components/sidebar/mainfeed/MainFeedSidebar";
import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import MainFeedHeader from "components/header/mainfeed/MainFeedHeader";
import { NextPage } from "next";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dear Blueno</title>
      </Head>
      <MainLayout
        title="Home"
        header={<MainFeedHeader />}
        page={<MainFeed />}
        sidebar={<MainFeedSidebar />}
      ></MainLayout>
    </>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   const posts = await getPosts(1, "hot");
//   if (posts.success) {
//     return {
//       props: {
//         initialPosts: posts.payload,
//       },
//       // Next.js will attempt to re-generate the page:
//       // - When a request comes in
//       // - At most every 30 seconds
//       revalidate: 30,
//     };
//   }
//   return {
//     props: {
//       initialPosts: [],
//     },
//     revalidate: 5,
//   };
// };

export default HomePage;
