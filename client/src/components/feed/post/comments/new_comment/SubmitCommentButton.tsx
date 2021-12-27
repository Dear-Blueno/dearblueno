import "./SubmitCommentButton.css";

type SubmitCommentButtonProps = {
  handleClick: () => void;
};

function SubmitCommentButton(props: SubmitCommentButtonProps) {
  return (
    <div className="SubmitCommentButton">
      <p
        className="SubmitCommentButtonClickable"
        onClick={() => props.handleClick()}
      >
        submit
      </p>
    </div>
  );
}

export default SubmitCommentButton;
