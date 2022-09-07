import styles from "./EventStages.module.scss";
import ImageUpload from "components/submit/ImageUpload";

interface EventStageOneProps {
  name: string;
  nameSetter: (name: string) => void;
  email: string;
  emailSetter: (email: string) => void;
  image: string;
  imageSetter: (image: string) => void;
}

export default function EventStageOne(props: EventStageOneProps) {
  return (
    <div className={styles.Stage}>
      <label className={styles.InputLabel + " " + styles.ImageUploadContainer}>
        Cover Picture
        <ImageUpload
          type="event"
          imageURL={props.image}
          setImageURL={props.imageSetter}
        />
      </label>
      <label className={styles.InputLabel}>
        <div>
          Event Name<span style={{ color: "darkRed" }}>*</span>
        </div>
        <input
          type="text"
          placeholder="Title of your event."
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
          placeholder="Optional: Where users contact you."
          className={styles.EventStageInput}
          value={props.email}
          onChange={(e) => props.emailSetter(e.target.value)}
        />
      </label>
    </div>
  );
}
