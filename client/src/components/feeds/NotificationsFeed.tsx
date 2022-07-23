import Notification from "components/notification/Notification";
import useUser from "hooks/useUser";

export default function NotificationsFeed() {
  const { user } = useUser();
  if (!user) return null;
  console.log(user.notifications);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {user.notifications.map((notification) => (
        <Notification notification={notification} key={notification._id} />
      ))}
    </div>
  );
}
