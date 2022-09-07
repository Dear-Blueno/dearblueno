import styles from "./EventStages.module.scss";
// import { GiPartyPopper } from "react-icons/gi";
import ImageUpload from "components/submit/ImageUpload";

interface EventStageOneProps {
  name: string;
  nameSetter: (name: string) => void;
  email: string;
  emailSetter: (email: string) => void;
}

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
          {/* <GiPartyPopper size={100} /> */}
          <div style={{ height: "6em" }}>
            <ImageUpload />
          </div>
        </div>
      </label>
      <label className={styles.InputLabel}>
        <div>
          Event Name<span style={{ color: "darkRed" }}>*</span>
        </div>
        <input
          type="text"
          placeholder="This will be displayed as the title of your event."
          className={styles.EventStageInput}
          value={props.name}
          onChange={(e) => props.nameSetter(e.target.value)}
        />
      </label>
      <label className={styles.InputLabel}>
        Contact Email
        <input
          type="text"
          name="email"
          autoComplete="email"
          placeholder="Users can contact you here with questions about your event."
          className={styles.EventStageInput}
          value={props.email}
          onChange={(e) => props.emailSetter(e.target.value)}
        />
      </label>
    </div>
  );
}
