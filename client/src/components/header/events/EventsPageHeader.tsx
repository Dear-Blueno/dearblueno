import Link from "next/link";
import { IoAdd } from "react-icons/io5";
import styles from "./EventsPageHeader.module.scss";

export default function EventsPageHeader() {
  return (
    <div className={styles.FeedHeader}>
      <Link href="/submit?type=event">
        <IoAdd className={styles.AddIcon} />
      </Link>
    </div>
  );
}
