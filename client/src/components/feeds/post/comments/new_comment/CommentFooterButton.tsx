import "./CommentFooterButton.css";
import { useState } from "react";

type CommentFooterButtonProps = {
  handleClick: () => Promise<boolean>;
  text: string;
};

function CommentFooterButton(props: CommentFooterButtonProps) {
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="CommentFooterButton">
      <p
        className="CommentFooterButtonClickable"
        onClick={async () => {
          if (!disabled) {
            setDisabled(true);
            const success = await props.handleClick();
            if (!success) {
              setDisabled(false);
            }
          }
        }}
      >
        {props.text}
      </p>
    </div>
  );
}

export default CommentFooterButton;
