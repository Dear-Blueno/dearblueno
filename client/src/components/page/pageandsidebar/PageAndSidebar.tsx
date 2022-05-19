import Page from "../Page";
import styles from "./PageAndSidebar.module.scss";

interface PageAndSidebarProps {
  title?: string;
  page: React.ReactNode;
  sidebar?: React.ReactNode;
}

export default function PageAndSidebar(props: PageAndSidebarProps) {
  return (
    <>
      <Page title={props.title}>{props.page}</Page>
      <div className={styles.Sidebar}>{props.sidebar}</div>
    </>
  );
}
