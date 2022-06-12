import Image from "next/image";
import { INotification } from "types/IUser";
import styles from "./Notification.module.scss";

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
  const context =
    "Content Goes here eventually and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on and so on";

  return (
    <div className={styles.Notification}>
      <div className={styles.NotificationHeader}>
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
      <p className={styles.NotificationContext}>
        {context.substring(0, 160)}
        {context.length > 160 ? "…" : ""}
      </p>
    </div>
  );
}
