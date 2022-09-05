import styles from "./Notification.module.scss";
import Image from "next/image";
import Link from "next/link";
import { INotification } from "types/IUser";
import RelativeDate from "components/post/RelativeDate";
import { markNotificationAsRead } from "gateways/UserGateway";
import { IoPersonOutline } from "react-icons/io5";
import { AiOutlineFire } from "react-icons/ai";
import { RiCalendarEventLine } from "react-icons/ri";
import { formatInTimeZone } from "date-fns-tz";
interface NotificationProps {
  notification: INotification;
}

export default function Notification(props: NotificationProps) {
  let notifText;
  const notifDate = new Date(props.notification.timestamp).toISOString();
  if (props.notification.type === "newComment") {
    notifText = (
      <p>
        <strong>{props.notification.content.userName}</strong>
        {" commented on "}
        <strong>{`Post #${props.notification.content.postNumber}`}</strong>
      </p>
    );
  } else if (props.notification.type === "trendingPost") {
    notifText = (
      <p>
        {"Post #"}
        <strong>{props.notification.content.postNumber}</strong>
        {" is trending!"}
      </p>
    );
  } else {
    const startTime = formatInTimeZone(
      new Date(props.notification.content.startDate),
      "America/New_York",
      "h:mma"
    );
    notifText = (
      <p>
        <strong>{props.notification.content.eventName}</strong>
        {" is coming up at "}
        <strong>{startTime}</strong>
      </p>
    );
  }

  if (props.notification.type === "newComment") {
    return (
      <Link href={`/post/${props.notification.content.postNumber}`}>
        <div
          className={`${styles.Notification} ${
            !props.notification.read ? styles.UnreadNotification : ""
          }`}
          onClick={() => {
            void markNotificationAsRead(props.notification._id);
          }}
        >
          <div className={styles.NotificationHeader}>
            <div className={styles.NotificationHeaderLeft}>
              <div className={styles.NotificationImageBox}>
                {props.notification.content.userName !== "Anonymous" ? (
                  <Image
                    src={props.notification.content.profilePicture}
                    width={50}
                    height={50}
                    className={styles.NotificationImage}
                    alt=""
                  />
                ) : (
                  <IoPersonOutline
                    className={styles.NotificationAnonImage}
                    width={50}
                    height={50}
                  />
                )}
              </div>
              {notifText}
            </div>
            <RelativeDate date={notifDate} />
          </div>
          <p className={styles.NotificationContext}>
            {props.notification.content.commentContent.substring(0, 160)}
            {props.notification.content.commentContent.length > 160 ? "…" : ""}
          </p>
        </div>
      </Link>
    );
  } else if (props.notification.type === "trendingPost") {
    return (
      <Link href={`/post/${props.notification.content.postNumber}`}>
        <div
          className={`${styles.Notification} ${
            !props.notification.read ? styles.UnreadNotification : ""
          }`}
          onClick={() => {
            void markNotificationAsRead(props.notification._id);
          }}
        >
          <div className={styles.NotificationHeader}>
            <div className={styles.NotificationHeaderLeft}>
              <div className={styles.NotificationImageBox}>
                <AiOutlineFire
                  className={styles.NotificationAnonImage}
                  width={50}
                  height={50}
                  style={{
                    backgroundColor: "rgb(224, 118, 83)",
                  }}
                />
              </div>
              {notifText}
            </div>
            <RelativeDate date={notifDate} />
          </div>
          <p className={styles.NotificationContext}>
            {props.notification.content.content.substring(0, 160)}
            {props.notification.content.content.length > 160 ? "…" : ""}
          </p>
        </div>
      </Link>
    );
  } else {
    return (
      <Link href={`/event/${props.notification.content.eventId}`}>
        <div
          className={`${styles.Notification} ${
            !props.notification.read ? styles.UnreadNotification : ""
          }`}
          onClick={() => {
            void markNotificationAsRead(props.notification._id);
          }}
        >
          <div className={styles.NotificationHeader}>
            <div className={styles.NotificationHeaderLeft}>
              <div className={styles.NotificationImageBox}>
                <RiCalendarEventLine
                  className={styles.NotificationAnonImage}
                  width={50}
                  height={50}
                  style={{
                    backgroundColor: "rgb(89, 130, 227)",
                  }}
                />
              </div>
              {notifText}
            </div>
            <RelativeDate date={notifDate} />
          </div>
        </div>
      </Link>
    );
  }
}
