import styles from "./CommentFooterButton.module.scss";
import { useState } from "react";

interface CommentFooterButtonProps {
  handleClick: () => Promise<boolean>;
  text: string;
}

function CommentFooterButton(props: CommentFooterButtonProps) {
  const [disabled, setDisabled] = useState(false);

  return (
    <div className={styles.CommentFooterButton}>
      <p
        className="CommentFooterButtonClickable"
        onClick={() => {
          if (!disabled) {
            setDisabled(true);
            props
              .handleClick()
              .then((success) => {
                if (!success) {
                  setDisabled(false);
                }
              })
              .catch((error) => console.error(error));
          }
        }}
      >
        {props.text}
      </p>
    </div>
  );
}

export default CommentFooterButton;
