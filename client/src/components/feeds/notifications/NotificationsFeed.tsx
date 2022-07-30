import styles from "./NotificationsFeed.module.scss";
import Notification from "components/notification/Notification";
import useUser from "hooks/useUser";
import { loginBrown } from "gateways/AuthGateway";

export default function NotificationsFeed() {
  const { user, isLoadingUser } = useUser();
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
  return (
    <>
      {user.notifications.map((notification) => (
        <Notification notification={notification} key={notification._id} />
      ))}
    </>
  );
}
