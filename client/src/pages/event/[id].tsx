import styles from "styles/EventPage.module.scss";
import IEvent from "types/IEvent";
import EventCard from "components/event/EventCard";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { getEvent } from "gateways/EventGateway";

// interface EventPageProps {
//   event?: IEvent;
// }

const EventPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useQuery(["event", id], () =>
    id ? getEvent(id as string) : undefined
  );
  const event = data?.success ? data.payload : undefined;
  if (!event) {
    return <MainLayout />;
  }
  return (
    <>
      <Head>
        <title>{event.eventName} - Dear Blueno</title>
      </Head>
      <MainLayout
        title={event.eventName}
        page={<EventPageMain event={event} />}
      />
    </>
  );
};

interface EventPageMainProps {
  event: IEvent;
}

function EventPageMain({ event }: EventPageMainProps) {
  return (
    <div className={styles.EventPage}>
      <EventCard event={event} />
    </div>
  );
}

// export const getStaticProps: GetStaticProps = async (context) => {
//   const eventID = context.params?.id as string;
//   const event = await getEvent(eventID);
//   if (event.success) {
//     return {
//       props: {
//         event: event.payload,
//       },
//       revalidate: 30,
//     };
//   }
//   return {
//     props: {
//       event: null,
//     },
//     revalidate: 30,
//   };
// };

// export function getStaticPaths() {
//   return { fallback: "blocking", paths: [] };
// }

export default EventPage;
