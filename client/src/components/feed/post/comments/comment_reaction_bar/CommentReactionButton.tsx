import "./CommentReactionButton.css";

interface CommentReactionButtonProps {
  image: string;
  count: number;
  showIcons: boolean;
  countSetter: (count: number) => void;
}

/*This div should be a button that, on click, calls the action prop. */
function CommentReactionButton(props: CommentReactionButtonProps) {
  const style = {
    display: props.count > 0 || props.showIcons ? "inline" : "none",
  };
  return (
    <div className="CommentReactionButton" style={style}>
      <img
        className="CommentReactionButtonImage"
        src={props.image}
        onClick={() => props.countSetter(props.count + 1)}
        alt="reaction"
      />
      <p className="CommentReactionCounter">{props.count}</p>
    </div>
  );
}

export default CommentReactionButton;
