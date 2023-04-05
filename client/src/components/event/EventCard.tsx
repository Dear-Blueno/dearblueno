import Image from "next/image";
import styles from "./EventCard.module.scss";
import { BsFillPeopleFill, BsCheckLg } from "react-icons/bs";
import { HiLightningBolt } from "react-icons/hi";
import { IoShareOutline } from "react-icons/io5";
import EventCardButton from "./EventCardButton";
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
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { RiCalendarEventFill } from "react-icons/ri";
import Linkify from "linkify-react";

interface EventCardProps {
  event: IEvent;
  disabled?: boolean;
  moderatorView?: boolean;
}

const formatTime = (dateString: string) =>
  formatInTimeZone(new Date(dateString), "America/New_York", "h:mma");

export default function EventCard(props: EventCardProps) {
  const { user } = useUser();
  const isGoing = user && props.event.going.includes(user._id);
  const isInterested = user && props.event.interested.includes(user._id);
  const { userOnlyAction } = useLoginPopup();

  const startTime = formatTime(props.event.startDate);
  const endTime = formatTime(props.event.endDate);
  const startDate = makeDate(
    formatInTimeZone(
      new Date(props.event.startDate),
      "America/New_York",
      "yyyy-MM-dd"
    )
  );

  const queryClient = useQueryClient();

  const eventMutation = ({
    type,
    id,
    newValue,
  }: {
    type: "interested" | "going";
    id: string;
    newValue: boolean;
  }) => {
    const func =
      type === "interested" ? reactInterestedToEvent : reactGoingToEvent;
    return func(id, newValue);
  };
  const { mutate: mutateEvent } = useMutation(eventMutation, {
    // When mutate is called:
    onMutate: async (data) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(["events"]);

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData(["events"]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["events"],
        (old: InfiniteData<IEvent[]> | undefined) => {
          old?.pages.forEach((page) => {
            page.forEach((event) => {
              if (event._id === data.id) {
                if (data.newValue && user) {
                  (data.type === "interested"
                    ? event.interested
                    : event.going
                  ).push(user._id);
                } else {
                  if (data.type === "interested") {
                    event.interested = event.interested.filter(
                      (id) => id !== user?._id
                    );
                  } else {
                    event.going = event.going.filter((id) => id !== user?._id);
                  }
                }
              }
            });
          });
          return old;
        }
      );
      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      queryClient.setQueryData(["events"], context?.previousTodos);
    },
  });

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
      toast.error(response.message);
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
            <p>{props.event.going.length}</p>
            <BsFillPeopleFill className={styles.EventCardAttendeesIcon} />
          </div>
          <div className={styles.EventCardAttendees}>
            <p>{props.event.interested.length}</p>
            <HiLightningBolt className={styles.EventCardAttendeesIcon} />
          </div>
        </div>
        <div className={styles.EventCardButtonContainer}>
          <EventCardButton
            icon={isGoing ? BsCheckLg : BsFillPeopleFill}
            text="Going"
            onClick={userOnlyAction(() => {
              mutateEvent({
                type: "going",
                id: props.event._id,
                newValue: !isGoing,
              });
            })}
            style={
              isGoing ? styles.EventCardButtonGoing : styles.EventCardButton
            }
            disabled={props.disabled ?? false}
          />
          <EventCardButton
            icon={isInterested ? BsCheckLg : HiLightningBolt}
            text="Interested"
            onClick={userOnlyAction(() => {
              mutateEvent({
                type: "interested",
                id: props.event._id,
                newValue: !isInterested,
              });
            })}
            style={
              isInterested
                ? styles.EventCardButtonInterested
                : styles.EventCardButton
            }
            disabled={props.disabled ?? false}
          />
          <EventCardButton
            icon={IoShareOutline}
            text="Share"
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (navigator.share) {
                navigator
                  .share({
                    title: props.event.eventName,
                    url: `https://dearblueno.net/event/${props.event._id}`,
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              } else {
                navigator.clipboard
                  .writeText(`https://dearblueno.net/event/${props.event._id}`)
                  .catch((err) => {
                    console.error(err);
                  });
                toast("Link copied to clipboard!", { icon: "📋" });
              }
            }}
            disabled={props.disabled ?? false}
            style={styles.EventCardButtonShare}
          />
        </div>
        {props.moderatorView && (
          <div className={styles.EventCardButtonContainer}>
            <EventCardButton
              text="Approve"
              onClick={() => void handleAction(true)}
              style={styles.EventCardButtonApprove}
            />
            <EventCardButton
              text="Deny"
              onClick={() => void handleAction(false)}
              style={styles.EventCardButtonReject}
            />
          </div>
        )}
      </div>
    </div>
  );
}
