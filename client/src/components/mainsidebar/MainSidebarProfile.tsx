import LevelAndXPBar from "components/user/LevelAndXPBar";
import XPBar from "components/user/XPBar";
import { loadAuth } from "gateways/AuthGateway";
import Image from "next/image";
import Link from "next/link";
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
    <Link href="/profile">
      <div className={styles.MainSidebarProfile}>
        {user && (
          <>
            <div className={styles.MainSidebarProfilePicture}>
              <Image
                src={user.profilePicture}
                alt="Profile picture"
                width={60}
                height={60}
              />
            </div>

            <div className={styles.MainSidebarProfileNameAndXP}>
              <div className={styles.MainSidebarProfileName}>
                {user && user.name}
              </div>
              <LevelAndXPBar xp={user.xp} />
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
