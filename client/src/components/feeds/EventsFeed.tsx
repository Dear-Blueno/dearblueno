import EventCard from "components/event/EventCard";
import Masonry from "react-masonry-css";
import styles from "./EventsFeed.module.scss";

export default function EventsFeed() {
  const breakpointColumnsObj = {
    default: 2,
    700: 1,
  };

  return (
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.myMasonryGrid}
        columnClassName={styles.myMasonryGridColumn}
      >
        <EventCard
          image="https://www.brown.edu/Departments/Music/sites/orchestra/images/2022-04/2022-spring-flyer-2.png"
          title="Brown Orchestra Concert"
          description="Come watch the Brown Orchestra at Sayles! Performance includes Firebird, Price’s 3rd Symphony, and more!"
          location="Sayles Hall"
          date="May 1, 2020"
          numberOfAttendees={10}
        />
        <EventCard
          image="https://awards.cs.brown.edu/media/filer_public_thumbnails/filer_public/eb/94/eb942db3-3026-481e-bb0c-235aae1ec043/img_5577.jpg__250x250_q85_subsampling-2.jpg"
          title="Brown Orchestra Concert"
          description="Come watch the Brown Orchestra at Sayles! Performance includes Firebird, Price’s 3rd Symphony, and more. We will also have kenji bunch and a whole lot of cool people!"
          location="Sayles Hall"
          date="May 1, 2020"
          numberOfAttendees={10}
        />
        <EventCard
          image="https://www.brown.edu/Departments/Music/sites/orchestra/images/uploads/buo-3.jpg"
          title="Brown Orchestra Concert"
          description="Come watch the Brown Orchestra at Sayles! Performance includes Firebird, Price’s 3rd Symphony, and more!"
          location="Sayles Hall"
          date="May 1, 2020"
          numberOfAttendees={10}
        />
        <EventCard
          image="https://www.brown.edu/Departments/Music/sites/orchestra/images/2022-04/2022-spring-flyer-2.png"
          title="Brown Orchestra Concert"
          description="Come watch the Brown Orchestra at Sayles! Performance includes Firebird, Price’s 3rd Symphony, and more!"
          location="Sayles Hall"
          date="May 1, 2020"
          numberOfAttendees={10}
        />
        <EventCard
          image="https://www.brown.edu/Departments/Music/sites/orchestra/images/2022-04/2022-spring-flyer-2.png"
          title="Brown Orchestra Concert"
          description="Come watch the Brown Orchestra at Sayles! Performance includes Firebird, Price’s 3rd Symphony, and more!"
          location="Sayles Hall"
          date="May 1, 2020"
          numberOfAttendees={10}
        />
      </Masonry>
    </div>
  );
}
