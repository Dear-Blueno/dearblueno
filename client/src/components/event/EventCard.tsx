import Image from "next/image";
import styles from "./EventCard.module.scss";
import { BsFillPeopleFill, BsCheckLg, BsSuitHeartFill } from "react-icons/bs";
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
  const [isInterested, setIsInterested] = useState(false);
  const [attendeeNumber, setAttendeeNumber] = useState(props.numberOfAttendees);

  return (
    <div className={styles.EventCard}>
      <div className={styles.EventCardImageContainer}>
        <Image
          className={styles.EventCardImage}
          src={props.image}
          width={650}
          height={1007}
          alt=""
        />
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
              text="Going"
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
          {isInterested ? (
            <EventCardButton
              icon={BsCheckLg}
              text="Interested"
              onClick={() => {
                setIsInterested(false);
              }}
              style={styles.EventCardButtonGoing}
            />
          ) : (
            <EventCardButton
              icon={BsSuitHeartFill}
              text="Interested"
              onClick={() => {
                setIsInterested(true);
              }}
            />
          )}
          <EventCardButton
            icon={IoShareOutline}
            text="Share"
            // fix the event share
            onClick={() => {
              navigator.clipboard.writeText(
                "localhost:3000/event/62da81af4e4f6ccd7bfa5560"
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
