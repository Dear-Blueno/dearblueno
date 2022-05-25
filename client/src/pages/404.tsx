import styles from "styles/NotFoundPage.module.scss";
import MainLayout from "components/layout/MainLayout";
import Image from "next/image";
import BluenoGif from "images/404.gif";

export default function NotFoundPage() {
  return <MainLayout page={<NotFoundPageMain />} />;
}

function NotFoundPageMain() {
  return (
    <div className={styles.NotFoundPage}>
      <h2 className={styles.NotFoundText}>
        Sorry, Blueno couldn't find what you were looking for
      </h2>
      <a href="/" className={styles.NotFoundLink}>
        <div className={styles.BluenoGif}>
          <Image src={BluenoGif} alt="404" width="300px" height="300px" />
        </div>
        Back to Main Feed
      </a>
    </div>
  );
}
