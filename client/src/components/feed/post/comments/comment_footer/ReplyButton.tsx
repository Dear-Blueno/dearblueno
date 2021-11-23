import "./ReplyButton.css";

type ReplyButtonProps = {
  click: () => void;
};

function ReplyButton(props: ReplyButtonProps) {
  return (
    <div className="ReplyButton">
      <p onClick={props.click}>reply</p>
    </div>
  );
}

export default ReplyButton;
