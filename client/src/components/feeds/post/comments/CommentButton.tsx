import "./CommentButton.css";

type CommentButtonProps = {
  click: () => void;
  type: "comment" | "reply";
};

function CommentButton(props: CommentButtonProps) {
  return (
    <div className="CommentButton">
      <p onClick={props.click}>{props.type}</p>
    </div>
  );
}

export default CommentButton;
