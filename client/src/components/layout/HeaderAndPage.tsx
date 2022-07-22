import styles from "./HeaderAndPage.module.scss";

type HeaderAndPageProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export default function HeaderAndPage(props: HeaderAndPageProps) {
  return <div className={styles.HeaderAndPage}>{props.children}</div>;
}
