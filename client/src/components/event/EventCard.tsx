import Image from "next/image";
import styles from "./EventCard.module.scss";
import { BsFillPeopleFill, BsCheckLg } from "react-icons/bs";
import { IoShareOutline } from "react-icons/io5";
import EventCardButton from "./EventCardButton";
import { useState } from "react";

type EventCardProps = {
  image: string;
  title: string;
  description: string;
  location: string;
  date: string;
  numberOfAttendees: number;
};

export default function EventCard(props: EventCardProps) {
  const [isGoing, setIsGoing] = useState(false);
  const [attendeeNumber, setAttendeeNumber] = useState(props.numberOfAttendees);

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
          <p>{attendeeNumber}</p>
          <BsFillPeopleFill className={styles.EventCardAttendeesIcon} />
        </div>
        <div className={styles.EventCardButtonContainer}>
          {isGoing ? (
            <EventCardButton
              icon={BsCheckLg}
              text="I'm Going"
              onClick={() => {
                setIsGoing(false);
                setAttendeeNumber(attendeeNumber - 1);
              }}
              style={styles.EventCardButtonGoing}
            />
          ) : (
            <EventCardButton
              icon={BsFillPeopleFill}
              text="Going"
              onClick={() => {
                setIsGoing(true);
                setAttendeeNumber(attendeeNumber + 1);
              }}
            />
          )}
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
