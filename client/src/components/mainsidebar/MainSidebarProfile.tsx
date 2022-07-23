import LevelAndXPBar from "components/user/LevelAndXPBar";
import useUser from "hooks/useUser";
import Image from "next/image";
import Link from "next/link";
import styles from "./MainSidebarProfile.module.scss";

interface MainSidebarProfileProps {}

export default function MainSidebarProfile(props: MainSidebarProfileProps) {
  const { user } = useUser();
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
                priority
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
