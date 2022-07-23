import MainLayout from "components/layout/MainLayout";
import EventStages from "components/eventstages/EventStages";
import { NextPage } from "next";
// import { createEvent } from "gateways/EventGateway";
// import { approveEvent } from "gateways/EventGateway";
// import { getModFeedEvents } from "gateways/EventGateway";

const EventSubmitPage: NextPage = () => {
  return <MainLayout title="Event Submit" page={<EventSubmitMain />} />;
};

// DUMMY EVENT ASSETS

// const makeDummyEvent = () => {
//   const event = new Date("05 October 2022 14:48 UTC");
//   const end = new Date("06 October 2022 14:48 UTC");
//   console.log("LOL");
//   createEvent("Dummy Event", "Dummy LOL Event", event, end, "Dummy Location");
// };

// const approveDummyEvent = async () => {
//   const allEvents = await getModFeedEvents(1);
//   if (allEvents.success) {
//     const event = allEvents.payload[0];
//     approveEvent(event._id, true);
//   }
// };

function EventSubmitMain() {
  return (
    <div>
      {/* <button onClick={makeDummyEvent}>LOL</button>
      <button onClick={approveDummyEvent}>APPROVE</button> */}
      <EventStages />
    </div>
  );
}

export default EventSubmitPage;
