import styles from "./EventStages.module.scss";
interface EventStageTwoProps {
  location: string;
  locationSetter: (location: string) => void;
  startDate: string;
  startDateSetter: (startDate: string) => void;
  startTime: string;
  startTimeSetter: (startTime: string) => void;
  endDate: string;
  endDateSetter: (endDate: string) => void;
  endTime: string;
  endTimeSetter: (endTime: string) => void;
  description: string;
  descriptionSetter: (description: string) => void;
}

export default function EventStageTwo(props: EventStageTwoProps) {
  return (
    <div className={styles.Stage}>
      <label className={styles.InputLabel}>
        <div>
          Event Location<span className={styles.Red}>*</span>
        </div>
        <input
          type="text"
          placeholder="Location/link of your event."
          className={styles.EventStageInput}
          value={props.location}
          onChange={(e) => props.locationSetter(e.target.value)}
        />
      </label>
      <div className={styles.DateTimeContainer}>
        <label className={styles.InputLabel}>
          <div>
            Start Date<span className={styles.Red}>*</span>
          </div>
          <input
            type="date"
            name="email"
            autoComplete="email"
            placeholder="ex: January 1st "
            className={styles.EventStageInput}
            value={props.startDate}
            onChange={(e) => {
              props.startDateSetter(e.target.value);
            }}
          />
        </label>
        <label className={styles.InputLabel}>
          <div>
            End Date<span className={styles.Red}>*</span>
          </div>
          <input
            type="date"
            name="email"
            autoComplete="email"
            placeholder="ex: January 2nd"
            className={styles.EventStageInput}
            value={props.endDate}
            onChange={(e) => props.endDateSetter(e.target.value)}
          />
        </label>
      </div>
      <div className={styles.DateTimeContainer}>
        <label className={styles.InputLabel}>
          <div>
            Start Time (ET)<span className={styles.Red}>*</span>
          </div>
          <input
            type="time"
            name="email"
            autoComplete="email"
            placeholder="ex: 12:01 A.M."
            className={styles.EventStageInput}
            value={props.startTime}
            onChange={(e) => props.startTimeSetter(e.target.value)}
          />
        </label>
        <label className={styles.InputLabel}>
          <div>
            End Time (ET)<span className={styles.Red}>*</span>
          </div>
          <input
            type="time"
            name="email"
            autoComplete="email"
            placeholder="ex: 11:59 P.M."
            className={styles.EventStageInput}
            value={props.endTime}
            onChange={(e) => props.endTimeSetter(e.target.value)}
          />
        </label>
      </div>
      <label className={styles.InputLabel}>
        <div>
          Event Description<span className={styles.Red}>*</span>
        </div>
        <textarea
          placeholder="Talk about what participants can expect at your event."
          rows={3}
          className={styles.EventStageTextField}
          value={props.description}
          onChange={(e) => props.descriptionSetter(e.target.value)}
        />
      </label>
    </div>
  );
}
