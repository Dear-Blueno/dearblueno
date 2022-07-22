import Head from "next/head";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import EventsFeed from "components/feeds/EventsFeed";
import NewEventButton from "components/event/NewEventButton";

const Events: NextPage = () => {
  return (
    <>
      <Head>
        <title>Events - Dear Blueno</title>
      </Head>

      <MainLayout
        title="Events"
        header={
          <div
            className="EventsHeader"
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <NewEventButton />
          </div>
        }
        page={<EventsFeed />}
      ></MainLayout>
    </>
  );
};

export default Events;
