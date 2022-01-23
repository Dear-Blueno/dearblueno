import "./CommentFooterButton.css";

type CommentFooterButtonProps = {
  handleClick: () => void;
  text: string;
};

function CommentFooterButton(props: CommentFooterButtonProps) {
  return (
    <div className="CommentFooterButton">
      <p
        className="CommentFooterButtonClickable"
        onClick={() => props.handleClick()}
      >
        {props.text}
      </p>
    </div>
  );
}

export default CommentFooterButton;
