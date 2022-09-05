import styles from "./ContentWarning.module.scss";

export interface ContentWarningProps {
  ContentWarningText: string;
}

function ContentWarning(props: ContentWarningProps) {
  return (
    <div className={styles.ContentWarning}>
      <p>{props.ContentWarningText}</p>
    </div>
  );
}

export default ContentWarning;
