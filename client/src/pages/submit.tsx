import styles from "styles/SubmitPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import { useState } from "react";
import TextSubmit from "components/submit/TextSubmit";
import { NextPage } from "next";
import SubmitPageHeader from "components/header/submit/SubmitPageHeader";
import { useRouter } from "next/router";
import ImageSubmit from "components/submit/ImageSubmit";
import Link from "next/link";
import Image from "next/image";
import LogoIcon from "images/logo128.png";
import EventStages from "components/eventstages/EventStages";
import Head from "next/head";

const SubmitPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Submit - Dear Blueno</title>
      </Head>
      <MainLayout
        title="Submit"
        page={<SubmitPageMain />}
        header={<SubmitPageHeader />}
      />
    </>
  );
};

function SubmitPageMain() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className={styles.SubmitBox}>
        <div className={styles.PostSubmitContent}>
          <h2 className={styles.ReturnText}>
            Your post has been submitted and will be reviewed by moderators
            shortly. Thank you.
          </h2>
          <Link href="/">
            <div className={styles.ReturnButton}>
              <Image
                className={styles.ReturnButtonImage}
                src={LogoIcon}
                alt="Blueno Home Button"
              />
              Return to Main Feed
            </div>
          </Link>
        </div>
      </div>
    );
  }

  if (router.isReady && router.query.type === undefined) {
    return <TextSubmit setSubmitted={setSubmitted} />;
  }

  switch (router.query.type) {
    case "text":
      return <TextSubmit setSubmitted={setSubmitted} />;
    case "image":
      return <ImageSubmit setSubmitted={setSubmitted} />;
    case "event":
      return <EventStages />;
    default:
      return null;
  }
}

export default SubmitPage;
