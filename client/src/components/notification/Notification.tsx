import styles from "./Notification.module.scss";
import Image from "next/image";
import Link from "next/link";
import { INotification } from "types/IUser";
import RelativeDate from "components/post/RelativeDate";

type NotificationProps = {
  notification: INotification;
};

export default function Notification(props: NotificationProps) {
  let notifText;
  if (props.notification.type === "newComment") {
    notifText = (
      //   <div className={styles.NoticationText}>
      <p>
        <strong>{props.notification.content.userName}</strong>
        {" commented on "}
        <strong>{"Post #" + props.notification.content.postNumber}</strong>
      </p>
      //   </div>
    );
  }
  console.log(props.notification);
  let notifDate = new Date(props.notification.timestamp).toISOString();
  const context =
    "Content Goes here eventually and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on";

  return (
    <Link href={`/post/${props.notification.content.postNumber}`}>
      <div className={styles.Notification}>
        <div className={styles.NotificationHeader}>
          <div className={styles.NotificationHeaderLeft}>
            <div className={styles.NotificationImageBox}>
              <Image
                src={props.notification.content.profilePicture}
                width={50}
                height={50}
                className={styles.NotificationImage}
              />
            </div>
            {notifText}
          </div>
          {/* conver timestamp to iso string */}

          <RelativeDate date={notifDate} />
        </div>
        <p className={styles.NotificationContext}>
          {context.substring(0, 160)}
          {context.length > 160 ? "…" : ""}
        </p>
      </div>
    </Link>
  );
}
