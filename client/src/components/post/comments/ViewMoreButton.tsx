import styles from "./ViewMoreButton.module.scss";

type ViewMoreButtonProps = {
  count: number;
  type: "comment" | "reply";
  action?: () => void;
};

export default function ViewMoreButton(props: ViewMoreButtonProps) {
  let suffix;
  if (props.count > 1) {
    if (props.type === "comment") {
      suffix = "comments";
    } else {
      suffix = "replies";
    }
  } else {
    suffix = props.type;
  }
  return (
    <div
      className={styles.ViewMoreButton}
      title="Click to view"
      onClick={props.action}
    >
      {props.count} more {suffix}
    </div>
  );
}
