import Image from "next/image";
import styles from "./EventCard.module.scss";
import { BsFillPeopleFill, BsCheckLg } from "react-icons/bs";
import { HiLightningBolt } from "react-icons/hi";
import { IoShareOutline } from "react-icons/io5";
import EventCardButton from "./EventCardButton";
import { useEffect, useState } from "react";
import IEvent from "types/IEvent";
import useUser from "hooks/useUser";
import {
  reactGoingToEvent,
  reactInterestedToEvent,
} from "gateways/EventGateway";
import { useLoginPopup } from "hooks/login-popup";
import { formatInTimeZone } from "date-fns-tz";
import { makeDate } from "components/eventstages/RelativeDay";

interface EventCardProps {
  event: IEvent;
}

export default function EventCard(props: EventCardProps) {
  const { user } = useUser();
  const [goingNumber, setGoingNumber] = useState(props.event.going.length);
  const [interestedNumber, setInterestedNumber] = useState(
    props.event.interested.length
  );
  const { userOnlyAction } = useLoginPopup();
  const [isGoing, setIsGoing] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const startTime = formatInTimeZone(
    props.event.startDate,
    "America/New_York",
    "h:mma"
  );

  const endTime = formatInTimeZone(
    props.event.endDate,
    "America/New_York",
    "h:mma"
  );
  const startDate = makeDate(props.event.startDate.split("T")[0]);

  useEffect(() => {
    const newGoing = (user && props.event.going.includes(user._id)) ?? false;
    setIsGoing(newGoing);
    const newInterested =
      (user && props.event.interested.includes(user._id)) ?? false;
    setIsInterested(newInterested);
  }, [user, props.event.going, props.event.interested]);

  return (
    <div className={styles.EventCard}>
      <div className={styles.EventCardImageContainer}>
        <Image
          className={styles.EventCardImage}
          src={props.event.coverPicture ?? "https://i.imgur.com/iLdCYyz.jpeg"}
          width={1200}
          height={600}
          alt=""
        />
      </div>
      <div className={styles.EventCardInfo}>
        <strong className={styles.EventCardTitle}>
          {props.event.eventName}
        </strong>
        <p className={styles.EventCardDescription}>
          {props.event.eventDescription}
        </p>
        <p>{props.event.location}</p>
        <p>
          {startDate} • {startTime} - {endTime}
        </p>
        <div className={styles.AttendeeContainer}>
          <div className={styles.EventCardAttendees}>
            <p>{goingNumber}</p>
            <BsFillPeopleFill className={styles.EventCardAttendeesIcon} />
          </div>
          <div className={styles.EventCardAttendees}>
            <p>{interestedNumber}</p>
            <HiLightningBolt className={styles.EventCardAttendeesIcon} />
          </div>
        </div>
        <div className={styles.EventCardButtonContainer}>
          <EventCardButton
            icon={isGoing ? BsCheckLg : BsFillPeopleFill}
            text="Going"
            onClick={userOnlyAction(() => {
              if (isGoing) {
                setGoingNumber(goingNumber - 1);
                void reactGoingToEvent(props.event._id, false);
                setIsGoing(false);
              } else {
                setGoingNumber(goingNumber + 1);
                void reactGoingToEvent(props.event._id, true);
                setIsGoing(true);
              }
            })}
            style={isGoing ? styles.EventCardButtonGoing : ""}
          />
          <EventCardButton
            icon={isInterested ? BsCheckLg : HiLightningBolt}
            text="Interested"
            onClick={userOnlyAction(() => {
              if (isInterested) {
                setInterestedNumber(interestedNumber - 1);
                void reactInterestedToEvent(props.event._id, false);
                setIsInterested(false);
              } else {
                setInterestedNumber(interestedNumber + 1);
                void reactInterestedToEvent(props.event._id, true);
                setIsInterested(true);
              }
            })}
            style={isInterested ? styles.EventCardButtonInterested : ""}
          />
          <EventCardButton
            icon={IoShareOutline}
            text="Share"
            // fix the event share
            onClick={() => {
              // copy the id to clipboard
              void navigator.clipboard.writeText(
                `localhost:3000/event/${props.event._id}`
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}
