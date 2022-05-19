import styles from "./Page.module.scss";
import PageHeader from "./pageheader/PageHeader";

type PageProps = {
  title?: string;
  children?: React.ReactNode;
};

export default function Page(props: PageProps) {
  return (
    <div className={styles.Page}>
      <PageHeader title={props.title} />
      {props.children}
    </div>
  );
}
