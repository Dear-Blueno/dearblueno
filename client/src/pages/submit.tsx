import styles from "styles/SubmitPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import { useState } from "react";
import TextSubmit from "components/submit/TextSubmit";
import { NextPage } from "next";
import SubmitPageHeader from "components/header/submit/SubmitPageHeader";

const SubmitPage: NextPage = () => {
  return (
    <MainLayout
      title="Submit"
      page={<SubmitPageMain />}
      header={<SubmitPageHeader />}
    />
  );
};

function SubmitPageMain() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className={styles.SubmitPage}>
      <TextSubmit submitted={submitted} submittedSetter={setSubmitted} />
    </div>
  );
}

export default SubmitPage;
