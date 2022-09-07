import Image from "next/image";
import styles from "./EventCard.module.scss";
import { BsFillPeopleFill, BsCheckLg, BsXLg } from "react-icons/bs";
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
import { approveEvent } from "gateways/EventGateway";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RiCalendarEventFill } from "react-icons/ri";
import Linkify from "linkify-react";

interface EventCardProps {
  event: IEvent;
  disabled?: boolean;
  moderatorView?: boolean;
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
    new Date(props.event.startDate),
    "America/New_York",
    "h:mma"
  );
  const endTime = formatInTimeZone(
    new Date(props.event.endDate),
    "America/New_York",
    "h:mma"
  );

  const startDate = makeDate(
    formatInTimeZone(
      new Date(props.event.startDate),
      "America/New_York",
      "yyyy-MM-dd"
    )
  );

  useEffect(() => {
    const newGoing = (user && props.event.going.includes(user._id)) ?? false;
    setIsGoing(newGoing);
    const newInterested =
      (user && props.event.interested.includes(user._id)) ?? false;
    setIsInterested(newInterested);
  }, [user, props.event.going, props.event.interested]);

  const queryClient = useQueryClient();

  const handleAction = async (action: boolean) => {
    const response = await approveEvent(props.event._id, action);
    if (response.success) {
      queryClient.setQueryData(
        ["moderatorevents"],
        (data: InfiniteData<IEvent[]> | undefined) => {
          const newData = data
            ? (JSON.parse(JSON.stringify(data)) as InfiniteData<IEvent[]>)
            : undefined;
          newData?.pages.forEach(
            (_, index, array) =>
              (array[index] = array[index].filter(
                (event) =>
                  event._id !== props.event._id &&
                  event.startDate !== props.event.startDate
              ))
          );
          return newData;
        }
      );
    } else {
      toast.error((response.message as unknown as { message: string }).message);
    }
  };

  return (
    <div className={styles.EventCard}>
      <div className={styles.EventCardImageContainer}>
        {props.event.coverPicture ? (
          <Image
            className={styles.EventCardImage}
            src={props.event.coverPicture}
            width={1200}
            height={600}
            alt=""
          />
        ) : (
          <RiCalendarEventFill className={styles.EventNoPicture} size="4rem" />
        )}
      </div>
      <div className={styles.EventCardInfo}>
        <strong className={styles.EventCardTitle}>
          {props.event.eventName}
        </strong>
        <Linkify tagName="p" className={styles.EventCardDescription}>
          {props.event.eventDescription}
        </Linkify>
        {props.event.contactEmail && (
          <Linkify tagName="p" className={styles.ContactEmail}>
            {props.event.contactEmail}
          </Linkify>
        )}
        <Linkify tagName="p" className={styles.EventLocation}>
          {props.event.location}
        </Linkify>
        <p>
          {startDate} • {startTime} - {endTime} ET
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
            disabled={props.disabled ?? false}
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
            disabled={props.disabled ?? false}
          />
          <EventCardButton
            icon={IoShareOutline}
            text="Share"
            onClick={() => {
              void navigator.clipboard.writeText(
                `localhost:3000/event/${props.event._id}`
              );
            }}
            disabled={props.disabled ?? false}
          />
        </div>
        {props.moderatorView && (
          <div className={styles.EventCardButtonContainer}>
            <EventCardButton
              icon={BsCheckLg}
              text="Approve"
              onClick={() => void handleAction(true)}
              style={styles.EventCardButtonApprove}
            />
            <EventCardButton
              icon={BsXLg}
              text="Reject"
              onClick={() => void handleAction(false)}
              style={styles.EventCardButtonReject}
            />
          </div>
        )}
      </div>
    </div>
  );
}
