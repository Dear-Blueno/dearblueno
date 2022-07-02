import styles from "./EventStages.module.scss";
import EventStagesDisplay from "./EventStagesDisplay";
import { useState } from "react";
import EventStageOne from "./EventStageOne";

export default function EventStages() {
  const [stage, setStage] = useState(1);

  const incrementStage = () => {
    setStage((prev) => prev + 1);
  };
  const decrementStage = () => {
    setStage((prev) => prev - 1);
  };

  return (
    <div
      className={
        styles.EventStagesBox +
        " " +
        styles.DearBluenoCard +
        " " +
        styles[`EventStage${stage}`]
      }
    >
      <div className={styles.StagesDisplayAndContent}>
        <EventStagesDisplay stage={stage} />
        <form>
          {stage === 1 && <EventStageOne />}
          {stage === 2 && <div>2</div>}
          {stage === 3 && <div>3</div>}
        </form>
      </div>
      <div className={styles.StageButtons}>
        {stage > 1 && (
          <button onClick={decrementStage} style={{ marginRight: "auto" }}>
            Back
          </button>
        )}
        {stage < 3 && (
          <button onClick={incrementStage} style={{ marginLeft: "auto" }}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}
