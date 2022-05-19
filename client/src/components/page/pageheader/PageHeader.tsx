import styles from "./PageHeader.module.scss";

type PageHeaderProps = {
  title?: string;
};

export default function PageHeader(props: PageHeaderProps) {
  return (
    <div className={styles.PageHeader}>
      {props.title && <h1 className={styles.PageHeaderTitle}>{props.title}</h1>}
    </div>
  );
}
