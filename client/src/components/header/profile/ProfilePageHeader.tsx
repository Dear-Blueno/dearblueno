import Link from "next/link";
import { HiShieldCheck } from "react-icons/hi";
import { MdBookmarkBorder } from "react-icons/md";
import useUser from "../../../hooks/useUser";
import styles from "./ProfilePageHeader.module.scss";

export default function ProfilePageHeader() {
  const { user } = useUser();

  return (
    <div className={styles.FeedHeader}>
      {user?.moderator ? (
        <Link href="/moderator">
          <HiShieldCheck className={styles.ModIcon} />
        </Link>
      ) : null}
      <Link href="/bookmarks">
        <MdBookmarkBorder className={styles.BookmarkIcon} />
      </Link>
    </div>
  );
}
