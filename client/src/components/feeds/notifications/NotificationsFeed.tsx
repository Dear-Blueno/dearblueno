import styles from "./NotificationsFeed.module.scss";
import Notification from "components/notification/Notification";
import useUser from "hooks/useUser";
import { loginBrown } from "gateways/AuthGateway";
import { useRouter } from "next/router";
import { INotification } from "types/IUser";
import { markAllNotificationsAsRead } from "gateways/UserGateway";
import { useEffect } from "react";

export default function NotificationsFeed() {
  const { user, refetchUser, isLoadingUser } = useUser();
  // refetch user on unmount
  useEffect(() => {
    return () => {
      refetchUser().catch((err) => {
        console.error(err);
      });
    };
  }, [refetchUser]);
  const router = useRouter();

  if (!isLoadingUser && !user) {
    return (
      <div className={styles.LoginPrompt}>
        <span onClick={loginBrown} className={styles.LoginPromptLink}>
          Log in
        </span>{" "}
        to view your notifications
      </div>
    );
  }
  if (!user) return null;

  const initialAcc: { unread: INotification[]; read: INotification[] } = {
    unread: [],
    read: [],
  };

  const partitionedNotifications = user.notifications.reduce(
    (acc, notification) => {
      if (notification.read) {
        acc.read.push(notification);
      } else {
        acc.unread.push(notification);
      }
      return acc;
    },
    initialAcc
  );

  if (partitionedNotifications.unread.length > 0) {
    markAllNotificationsAsRead().catch((err) => {
      console.error(err);
    });
  }

  const notifications =
    router.query.sort === "all"
      ? partitionedNotifications.unread.concat(partitionedNotifications.read)
      : partitionedNotifications.unread;

  notifications.reverse();

  return (
    <div className={styles.NotificationsFeed}>
      {notifications.length === 0 && (
        <div className={styles.LoginPrompt}>Nothing to see here!</div>
      )}
      {notifications.map((notification) => (
        <Notification notification={notification} key={notification._id} />
      ))}
    </div>
  );
}
