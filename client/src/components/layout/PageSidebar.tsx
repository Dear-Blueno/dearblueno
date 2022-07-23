import styles from "./PageSidebar.module.scss";

interface PageSidebarProps {
  children?: React.ReactNode | React.ReactNode[];
}

export default function PageSidebar(props: PageSidebarProps) {
  return <aside className={styles.sidebar}>{props.children}</aside>;
}
