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
        header={
          <div
            className="EventsHeader"
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                fontSize: "2.4rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                marginTop: "1rem",
                userSelect: "none",
                flexShrink: "0",
              }}
            >
              Events
            </h1>
            <NewEventButton />
          </div>
        }
        page={<EventsFeed />}
      ></MainLayout>
    </>
  );
};

export default Events;
