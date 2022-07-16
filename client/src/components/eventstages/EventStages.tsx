import styles from "./EventStages.module.scss";
import EventStagesDisplay from "./EventStagesDisplay";
import { useState } from "react";
import EventStageOne from "./EventStageOne";
import EventStageTwo from "./EventStageTwo";
import EventCard from "components/event/EventCard";
import { makeDate, makeTime } from "./RelativeDay";

export default function EventStages() {
  const [stage, setStage] = useState(1);
  const [stageOneName, setStageOneName] = useState("");
  const [stageOneEmail, setStageOneEmail] = useState("");
  const [stageTwoLocation, setStageTwoLocation] = useState("");
  const [stageTwoStartDate, setStageTwoStartDate] = useState("");
  const [stageTwoStartTime, setStageTwoStartTime] = useState("");
  const [stageTwoEndDate, setStageTwoEndDate] = useState("");
  const [stageTwoEndTime, setStageTwoEndTime] = useState("");
  const [stageTwoDescription, setStageTwoDescription] = useState("");

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
      <EventStagesDisplay stage={stage} />
      <form>
        {stage === 1 && (
          <EventStageOne
            name={stageOneName}
            nameSetter={setStageOneName}
            email={stageOneEmail}
            emailSetter={setStageOneEmail}
          />
        )}
        {stage === 2 && (
          <EventStageTwo
            location={stageTwoLocation}
            locationSetter={setStageTwoLocation}
            startDate={stageTwoStartDate}
            startDateSetter={setStageTwoStartDate}
            startTime={stageTwoStartTime}
            startTimeSetter={setStageTwoStartTime}
            endDate={stageTwoEndDate}
            endDateSetter={setStageTwoEndDate}
            endTime={stageTwoEndTime}
            endTimeSetter={setStageTwoEndTime}
            description={stageTwoDescription}
            descriptionSetter={setStageTwoDescription}
          />
        )}
        {stage === 3 && (
          <div className={styles.EventCardContainer}>
            <label className={styles.InputLabel}>Review your event:</label>
            <EventCard
              image="https://www.brown.edu/Departments/Music/sites/orchestra/images/2022-04/2022-spring-flyer-2.png"
              title={stageOneName}
              description={stageTwoDescription}
              location={stageTwoLocation}
              date={
                makeDate(stageTwoStartDate) +
                " • " +
                makeTime(stageTwoStartTime, stageTwoEndTime)
              }
              // date={stageTwoStartTime}
              numberOfAttendees={0}
            />
          </div>
        )}
      </form>
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
        {stage == 3 && (
          <button onClick={incrementStage} style={{ marginLeft: "auto" }}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
