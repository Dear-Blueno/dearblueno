import "./ReactionButton.css";

interface ReactionButtonProps {
  type: "comment" | "post";
  images: string[];
  count: number;
  reactionArray: string[];
  handleClick: () => void;
}

function ReactionButton(props: ReactionButtonProps) {
  const className =
    props.type === "comment" ? "CommentReactionButton" : "PostReactionButton";

  return (
    <div className={className}>
      <img
        className={className + "Image"}
        src={props.count ? props.images[0] : props.images[1]}
        onClick={() => {
          props.handleClick();
        }}
        alt="reaction"
        draggable={false}
      />
      <p className={className + "Count"}>{props.count}</p>
    </div>
  );
}

export default ReactionButton;
