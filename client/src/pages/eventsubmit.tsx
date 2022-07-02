import MainLayout from "components/layout/MainLayout";
import EventStages from "components/eventstages/EventStages";
import { NextPage } from "next";

const EventSubmitPage: NextPage = () => {
  return <MainLayout title="Event Submit" page={<EventSubmitMain />} />;
};

function EventSubmitMain() {
  return (
    <div>
      <EventStages />
    </div>
  );
}

export default EventSubmitPage;
