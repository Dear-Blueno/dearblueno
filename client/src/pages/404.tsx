import styles from "styles/NotFoundPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import Image from "next/legacy/image";
import BluenoGif from "images/404.gif";
import Head from "next/head";
import { NextPage } from "next";
import Link from "next/link";

const NotFoundPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Page not found</title>
      </Head>
      <MainLayout page={<NotFoundPageMain />} />
    </>
  );
};

function NotFoundPageMain() {
  return (
    <div className={styles.NotFoundPage}>
      <h2 className={styles.NotFoundText}>
        {"Sorry, Blueno couldn't find what you were looking for"}
      </h2>
      <Link href="/" className={styles.NotFoundLink}>
        <div className={styles.BluenoGif}>
          <Image src={BluenoGif} alt="404" width={300} height={300} />
        </div>
        Back to Main Feed
      </Link>
    </div>
  );
}

export default NotFoundPage;
