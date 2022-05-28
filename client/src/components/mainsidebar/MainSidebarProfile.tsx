import { loadAuth } from "gateways/AuthGateway";
import Image from "next/image";
import { useQuery } from "react-query";
import styles from "./MainSidebarProfile.module.scss";

type MainSidebarProfileProps = {};

export default function MainSidebarProfile(props: MainSidebarProfileProps) {
  const {
    isLoading,
    error,
    data: user,
  } = useQuery("user", () =>
    loadAuth().then((response) => {
      if (response.success && response.payload) {
        return response.payload;
      }
    })
  );
  return (
    <div className={styles.MainSidebarProfile}>
      {user && (
        <div className={styles.MainSidebarProfilePicture}>
          <Image
            src={user.profilePicture}
            alt="Profile picture"
            width={60}
            height={60}
          />
        </div>
      )}
      <div className={styles.MainSidebarProfileNameAndXP}>
        <div className={styles.MainSidebarProfileName}>{user && user.name}</div>
      </div>
    </div>
  );
}
