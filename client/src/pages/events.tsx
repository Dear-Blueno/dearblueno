import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import EventsFeed from "components/feeds/EventsFeed";

const Events: NextPage = () => {
  return (
    <>
      <Head>
        <title>Events</title>
      </Head>
      <MainLayout title="Events" page={<EventsFeed />}></MainLayout>
    </>
  );
};

export default Events;
