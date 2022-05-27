import styles from "styles/SubmitPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import { useState } from "react";
import SubmitBox from "components/submit_post/SubmitBox";
import IUser from "types/IUser";

type SubmitPageProps = {
  user?: IUser;
};

export default function SubmitPage() {
  return <MainLayout title="Submit" page={<SubmitPageMain />} />;
}

function SubmitPageMain(props: SubmitPageProps) {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={styles.SubmitPage}>
      <SubmitBox
        user={props.user}
        submitted={submitted}
        submittedSetter={setSubmitted}
      />
    </div>
  );
}
