import styles from "./EventStages.module.scss";
import EventStagesDisplay from "./EventStagesDisplay";
import StageButton from "./StageButton";
import Image from "next/image";
import { useState } from "react";

export default function EventStages() {
  const [stage, setStage] = useState(1);

  const incrementStage = () => {
    setStage(stage + 1);
  };
  const decrementStage = () => {
    setStage(stage - 1);
  };

  return (
    <div className={styles.EventStagesBox}>
      <EventStagesDisplay stage={stage} />
      {stage === 1 && (
        <div className={styles.Stage}>
          <p className={styles.InputTitle}>Event Picture</p>
          <div className={styles.ImageContainer}>
            <Image
              src="https://www.brown.edu/Departments/Music/sites/orchestra/images/2022-04/2022-spring-flyer-2.png"
              alt="Event Picture"
              width={400}
              height={200}
            />
          </div>
          <p className={styles.InputTitle}>Event Name</p>
          <input
            type="text"
            placeholder="Event Name"
            className={styles.StageOneInput}
          />
          <p className={styles.InputTitle}>Contact Email</p>
          <input
            type="text"
            placeholder="Contact Email"
            className={styles.StageOneInput}
          />
        </div>
      )}
      {stage === 2 && <div>2</div>}
      {stage === 3 && <div>3</div>}
    </div>
  );
}
