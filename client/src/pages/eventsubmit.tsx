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
//   const start = new Date("2022-07-29T08:00");
//   const end = new Date("2022-07-29T13:00");
//   const estTime = new Date(start.toLocaleString('en-US', { timeZone: 'America/New_York'}));
//   const diff = start.getTime() - estTime.getTime();
//   const event = new Date(start.getTime() + diff);
//   const eventEnd = new Date(end.getTime() + diff);
//   console.log("LOL");
//   void createEvent(
//     "Dummy Event",
//     "Dummy LOL Event",
//     event,
//     eventEnd,
//     "Dummy Location"
//   );
// };

// const approveDummyEvent = () => {
//   void approveEvent("62deb7c361b689f51c166964", true);
// };

function EventSubmitMain() {
  return (
    <div>
      {/* <button onClick={makeDummyEvent}>LOL</button> */}
      {/* <button onClick={approveDummyEvent}>APPROVE</button> */}
      <EventStages />
    </div>
  );
}

export default EventSubmitPage;
