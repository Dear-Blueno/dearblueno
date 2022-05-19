import PageAndSidebar from "components/page/pageandsidebar/PageAndSidebar";
import styles from "styles/NotFoundPage.module.scss";

export default function NotFoundPage() {
  return <PageAndSidebar page={<NotFoundPageMain />} />;
}

function NotFoundPageMain() {
  return (
    <div className={styles.NotFoundPage}>
      <h2 className={styles.NotFoundText}>
        Sorry, Blueno couldn't find what you were looking for
      </h2>
      <a href="/" className={styles.NotFoundLink}>
        <img
          src="https://i.imgur.com/3wjWxiQ.gif"
          alt="404"
          className={styles.BluenoGif}
        />
        Back to Main Feed
      </a>
    </div>
  );
}
