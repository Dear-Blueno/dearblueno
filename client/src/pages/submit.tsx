import styles from "styles/SubmitPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import { useState } from "react";
import SubmitBox from "components/submit_post/SubmitBox";
import { NextPage } from "next";

const SubmitPage: NextPage = () => {
  return <MainLayout title="Submit" page={<SubmitPageMain />} />;
};

function SubmitPageMain() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={styles.SubmitPage}>
      <SubmitBox submitted={submitted} submittedSetter={setSubmitted} />
    </div>
  );
}

export default SubmitPage;
