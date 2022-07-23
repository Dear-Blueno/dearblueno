import styles from "./Page.module.scss";

interface PageProps {
  children?: React.ReactNode | React.ReactNode[];
}

export default function Page(props: PageProps) {
  return <main className={styles.page}>{props.children}</main>;
}
