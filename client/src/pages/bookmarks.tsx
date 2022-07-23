import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import BookmarksFeed from "components/feeds/BookmarksFeed";
import { NextPage } from "next";

const BookmarksPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Bookmarks - Dear Blueno</title>
      </Head>
      <MainLayout title="Bookmarks" page={<BookmarksFeed />}></MainLayout>
    </>
  );
};

export default BookmarksPage;
