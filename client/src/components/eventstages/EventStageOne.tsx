import styles from "./EventStages.module.scss";
import Image from "next/image";
import { GiPartyPopper } from "react-icons/gi";
type EventStageOneProps = {};

export default function EventStageOne(props: EventStageOneProps) {
  return (
    <div className={styles.Stage}>
      <label className={styles.InputLabel}>
        Cover Picture
        <div className={styles.ImageContainer}>
          {/* <Image
        src="https://img.favpng.com/15/6/19/computer-icons-confetti-party-new-year-png-favpng-QZS6YRuMx3wwCCwETfQahNTYR.jpg"
        alt="Event Picture"
        width={400}
        height={200}
      /> */}
          <GiPartyPopper size={100} />
        </div>
      </label>
      <label className={styles.InputLabel}>
        Event Name
        <input
          type="text"
          placeholder="This will be displayed as the title of your event"
          className={styles.EventStageInput}
        />
      </label>
      <label className={styles.InputLabel}>
        Contact Email
        <input
          type="text"
          name="email"
          autoComplete="email"
          placeholder="Users can contact you here with questions about your event"
          className={styles.EventStageInput}
        />
      </label>
    </div>
  );
}