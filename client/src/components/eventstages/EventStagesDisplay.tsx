import styles from "./EventStagesDisplay.module.scss";

type EventStagesDisplayProps = {
  stage: number;
};

export default function EventStagesDisplay(props: EventStagesDisplayProps) {
  const selected = (stage: number) => {
    return stage === props.stage ? styles.Selected : "";
  };

  return (
    // css name manipulation in scss sucks so bad it is crazy
    // figure out how to fix this later
    <div className={styles.EventStagesDisplay}>
      <div className={styles.SingleStage + " " + selected(1)}>
        <div className={styles.StageLine}></div>
        <p className={styles.StageTitle}>Basic Info</p>
      </div>
      <div className={styles.SingleStage + " " + selected(2)}>
        <div className={styles.StageLine}></div>
        <p className={styles.StageTitle}>Details</p>
      </div>
      <div className={styles.SingleStage + " " + selected(3)}>
        <div className={styles.StageLine}></div>
        <p className={styles.StageTitle}>Review</p>
      </div>
    </div>
  );
}
