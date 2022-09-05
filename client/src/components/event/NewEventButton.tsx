import styles from "./NewEventButton.module.scss";
import Link from "next/link";

export default function NewEventButton() {
  return (
    <Link href="/eventsubmit">
      <a className={styles.NewEventButtonLink}>
        <button className={styles.NewEventButton}>
          <span>New Event</span>
        </button>
      </a>
    </Link>
  );
}
