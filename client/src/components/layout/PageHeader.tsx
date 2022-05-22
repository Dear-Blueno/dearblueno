import styles from "./PageHeader.module.scss";

type PageHeaderProps = {
  title?: string;
  children?: React.ReactNode | React.ReactNode[];
};

export default function PageHeader(props: PageHeaderProps) {
  return (
    <header className={styles.pageheader}>
      {props.title && <h1 className={styles.title}>{props.title}</h1>}
      {props.children}
    </header>
  );
}
