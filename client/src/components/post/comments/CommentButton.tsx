import styles from "./CommentButton.module.scss";

interface CommentButtonProps {
  click: () => void;
  type: "comment" | "reply";
}

function CommentButton(props: CommentButtonProps) {
  return (
    <div className={styles.CommentButton}>
      <p onClick={props.click}>{props.type}</p>
    </div>
  );
}

export default CommentButton;
