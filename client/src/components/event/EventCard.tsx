import Image from "next/image";
import styles from "./EventCard.module.scss";
import { BsFillPeopleFill } from "react-icons/bs";
import { IoShareOutline } from "react-icons/io5";
import EventCardButton from "./EventCardButton";
type EventCardProps = {
  image: string;
  title: string;
  description: string;
  location: string;
  date: string;
  numberOfAttendees: number;
};

export default function EventCard(props: EventCardProps) {
  return (
    <div className={styles.EventCard}>
      <div className={styles.EventCardImageContainer}>
        <Image src={props.image} width={650} height={1007} />
      </div>
      <div className={styles.EventCardInfo}>
        <strong className={styles.EventCardTitle}>{props.title}</strong>
        <p className={styles.EventCardDescription}>{props.description}</p>
        <p>{props.location}</p>
        <p>{props.date}</p>
        <div className={styles.EventCardAttendees}>
          <p>{props.numberOfAttendees}</p>
          <BsFillPeopleFill className={styles.EventCardAttendeesIcon} />
        </div>
        <div className={styles.EventCardButtonContainer}>
          <EventCardButton
            icon={BsFillPeopleFill}
            text="Going"
            onClick={() => console.log("Going")}
          />
          <EventCardButton
            icon={IoShareOutline}
            text="Share"
            onClick={() => console.log("Share")}
          />
        </div>
      </div>
    </div>
  );
}
