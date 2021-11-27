import "./ReactionButton.css";

interface ReactionButtonProps {
  type: "comment" | "post";
  images: string[];
  count: number;
  showIcons: boolean;
  countSetter: (count: number) => void;
}

/*This div should be a button that, on click, calls the action prop. */
function ReactionButton(props: ReactionButtonProps) {
  const style = {
    display: props.count > 0 || props.showIcons ? "inline" : "none",
  };
  const className =
    props.type === "comment" ? "CommentReactionButton" : "PostReactionButton";

  return (
    <div className={className} style={style}>
      <img
        className={className + "Image"}
        src={props.count ? props.images[0] : props.images[1]}
        onClick={() => props.countSetter(props.count + 1)}
        alt="reaction"
      />
      <p className={className + "Count"}>{props.count}</p>
    </div>
  );
}

export default ReactionButton;
