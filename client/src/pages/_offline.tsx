import styles from "styles/AboutPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import { NextPage } from "next";
import Head from "next/head";

const OfflinePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Dear Blueno</title>
      </Head>
      <MainLayout title="Offline D:" page={<OfflinePageMain />} />
    </>
  );
};

function OfflinePageMain() {
  return (
    <div className={styles.AboutPagePost + " " + styles.DearBluenoCard}>
      <div className={styles.AboutPageSection}>
        <h3 className="SectionHeader">D:</h3>
        <div className={styles.PrivPolicy}>
          You are offline. Please check your internet connection.
        </div>
      </div>
    </div>
  );
}

export default OfflinePage;
