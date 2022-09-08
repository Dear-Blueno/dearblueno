import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import EventsFeed from "components/feeds/EventsFeed";
import EventsPageHeader from "components/header/events/EventsPageHeader";
// import NewEventButton from "components/event/NewEventButton";

const EventsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Events - Dear Blueno</title>
      </Head>

      <MainLayout
        title="Events"
        page={<EventsFeed />}
        header={<EventsPageHeader />}
      ></MainLayout>
    </>
  );
};

export default EventsPage;
