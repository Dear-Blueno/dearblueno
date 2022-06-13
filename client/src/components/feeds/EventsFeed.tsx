import useUser from "hooks/useUser";
import EventCard from "components/event/EventCard";

export default function EventsFeed() {
  const { user } = useUser();
  return (
    <div>
      <EventCard
        image="https://www.brown.edu/Departments/Music/sites/orchestra/images/2022-04/2022-spring-flyer-2.png"
        title="Brown Orchestra Concert"
        description="Come watch the Brown Orchestra at Sayles! Performance includes Firebird, Price’s 3rd Symphony, and more!"
        location="Sayles Hall"
        date="May 1, 2020"
        numberOfAttendees={10}
      />
    </div>
  );
}
