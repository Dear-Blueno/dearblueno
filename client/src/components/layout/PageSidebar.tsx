import styles from "./PageSidebar.module.scss";

type PageSidebarProps = {
  children?: React.ReactNode | React.ReactNode[];
};

export default function PageSidebar(props: PageSidebarProps) {
  return <aside className={styles.sidebar}>{props.children}</aside>;
}
