import styles from "./EventStages.module.scss";
import EventStagesDisplay from "./EventStagesDisplay";
import { useState } from "react";
import EventStageOne from "./EventStageOne";
import EventStageTwo from "./EventStageTwo";
import EventCard from "components/event/EventCard";
import { estTheDate as shiftToEST } from "./RelativeDay";
import { createEvent } from "gateways/EventGateway";

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

  const [selectedFile, setSelectedFile] = useState<File>();

  const incrementStage = () => {
    if (stage === 1 && stageOneName) {
      if (stageOneEmail) {
        emailChecker(stageOneEmail) && setStage(2);
      } else {
        setStage(2);
      }
    }
    if (
      stage === 2 &&
      stageTwoLocation &&
      stageTwoStartDate &&
      stageTwoStartTime &&
      stageTwoEndDate &&
      stageTwoEndTime &&
      stageTwoDescription
    ) {
      setStage(3);
    }
  };

  const decrementStage = () => {
    if (stage != 4) {
      setStage((prev) => prev - 1);
    }
    if (stage === 4) {
      window.location.href = "/events";
    }
  };

  const emailChecker = (inputEmail: string) => {
    if (inputEmail === "") return true;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputEmail)) {
      return true;
    }
    return false;
  };

  const submitTheEvent = () => {
    createEvent(
      stageOneName,
      stageTwoDescription,
      shiftToEST(new Date(`${stageTwoStartDate}T${stageTwoStartTime}`)),
      shiftToEST(new Date(`${stageTwoEndDate}T${stageTwoEndTime}`)),
      stageTwoLocation,
      stageOneEmail === "" ? undefined : stageOneEmail,
      undefined
    )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    setStage(4);
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    setSelectedFile(event.target.files[0]);
  };

  const uploadImage = async (file: File | undefined): Promise<string> => {
    if (!file) {
      return "";
    }
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Client-ID 77020c61ebced72");

    const formdata = new FormData();
    formdata.append("image", file);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    } as RequestInit;

    const res = await fetch("https://api.imgur.com/3/image", requestOptions);
    const data = (await res.json()) as { data: { link: string } };
    return data.data.link;
  };

  return (
    <div className={styles.EventStagesBox + " " + styles[`EventStage${stage}`]}>
      <EventStagesDisplay stage={stage} />
      <form>
        <input type="file" name="file" id="file" onChange={changeHandler} />
        <p
          onClick={() =>
            void uploadImage(selectedFile).then((link) => console.log(link))
          }
        >
          Upload
        </p>

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
              event={{
                _id: "",
                eventName: stageOneName,
                eventDescription: stageTwoDescription,
                startDate: shiftToEST(
                  new Date(`${stageTwoStartDate}T${stageTwoStartTime}`)
                ).toISOString(),
                endDate: shiftToEST(
                  new Date(`${stageTwoEndDate}T${stageTwoEndTime}`)
                ).toISOString(),
                location: stageTwoLocation,
                approved: true,
                needsReview: false,
                interested: [],
                going: [],
                postTime: new Date().toUTCString(),
                notificationSent: false,
              }}
              disabled
            />
          </div>
        )}
        {stage === 4 && (
          <div
            style={{
              marginTop: ".5rem",
              marginBottom: "4rem",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            Your event has been submitted. It will be reviewed by moderators,
            and you will be notified on the decision if you provided an optional
            contact email.
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
          <button
            onClick={incrementStage}
            style={{ marginLeft: "auto" }}
            disabled={
              (stage === 1 && stageOneName === "") ||
              !emailChecker(stageOneEmail) ||
              (stage === 2 &&
                (stageTwoLocation === "" ||
                  stageTwoStartDate === "" ||
                  stageTwoStartTime === "" ||
                  stageTwoEndDate === "" ||
                  stageTwoEndTime === "" ||
                  stageTwoDescription === ""))
            }
          >
            Next
          </button>
        )}
        {stage == 3 && (
          <button onClick={submitTheEvent} style={{ marginLeft: "auto" }}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
