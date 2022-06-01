import MainFeed from "../components/feeds/mainfeed/MainFeed";
import MainFeedSidebar from "components/sidebar/mainfeed/MainFeedSidebar";
import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import BookmarksFeed from "components/feeds/bookmarksfeed/BookmarksFeed";

export default function BookmarksPage() {
  return (
    <>
      <Head>
        <title>Bookmarks</title>
      </Head>
      <MainLayout title="Bookmarks" page={<BookmarksFeed />}></MainLayout>
    </>
  );
}
