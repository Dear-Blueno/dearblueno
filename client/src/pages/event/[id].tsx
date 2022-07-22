import styles from "styles/EventPage.module.scss";
import IEvent from "types/IEvent";
import { getEvent } from "gateways/EventGateway";
import EventCard from "components/event/EventCard";
import NotFoundPage from "pages/404";
import MainLayout from "components/layout/MainLayout";
import { GetStaticProps, NextPage } from "next";
import Head from "next/head";

type EventPageProps = {
  event?: IEvent;
};

const EventPage: NextPage = ({ event }: EventPageProps) => {
  if (!event) {
    return <NotFoundPage />;
  }

  return (
    <>
      <Head>
        <title>Event {event.eventName} - Dear Blueno</title>
      </Head>
      <MainLayout
        title={event.eventName}
        page={<EventPageMain event={event} />}
      />
    </>
  );
};

type EventPageMainProps = {
  event: IEvent;
};

function EventPageMain({ event }: EventPageMainProps) {
  return (
    <div className={styles.EventPage}>
      <EventCard
        image={
          event.coverPicture ??
          "https://www.brown.edu/Departments/Music/sites/orchestra/images/2022-04/2022-spring-flyer-2.png"
        }
        title={event.eventName}
        description={event.eventDescription}
        location={event.location}
        date={"July Third"}
        numberOfAttendees={event.going.length}
      />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const eventID = context.params?.id as string;
  const event = await getEvent(eventID);
  if (event.success) {
    return {
      props: {
        event: event.payload,
      },
      revalidate: 30,
    };
  }
  return {
    props: {
      event: null,
    },
    revalidate: 30,
  };
};

export async function getStaticPaths() {
  return { fallback: "blocking", paths: [] };
}

export default EventPage;
