import styles from "styles/EventSubmitPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import EventStages from "components/eventstages/EventStages";

const EventSubmitPage = () => {
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
