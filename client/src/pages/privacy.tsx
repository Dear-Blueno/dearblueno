import styles from "styles/AboutPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import PrivacyPolicy from "components/privacypolicy/PrivacyPolicy";
import { NextPage } from "next";
import Head from "next/head";

const PrivacyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Privacy - Dear Blueno</title>
      </Head>
      <MainLayout title="Privacy" page={<PrivacyPageMain />} />
    </>
  );
};

function PrivacyPageMain() {
  return (
    <div className={styles.AboutPagePost + " " + styles.DearBluenoCard}>
      <div className={styles.AboutPageSection}>
        <h3 className="SectionHeader">PRIVACY POLICY</h3>
        <div className={styles.PrivPolicy}>
          <PrivacyPolicy />
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;
