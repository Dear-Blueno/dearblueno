import Link from "next/link";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { MdBookmarkBorder } from "react-icons/md";
import { RiShieldCheckLine } from "react-icons/ri";
import useUser from "../../../hooks/useUser";
import styles from "./ProfilePageHeader.module.scss";

export default function ProfilePageHeader() {
  const { user } = useUser();

  return (
    <div className={styles.FeedHeader}>
      {user?.moderator ? (
        <Link href="/moderator">
          <RiShieldCheckLine className={styles.ModIcon} />
        </Link>
      ) : null}
      <Link href="/about">
        <AiOutlineInfoCircle className={styles.InfoIcon} />
      </Link>
      <Link href="/bookmarks">
        <MdBookmarkBorder className={styles.BookmarkIcon} />
      </Link>
      <Link href="/settings">
        <FiSettings className={styles.SettingsIcon} />
      </Link>
    </div>
  );
}
