import "./ReactionButton.css";

interface ReactionButtonProps {
  image: string;
  count: number;
  showIcons: boolean;
  countSetter: (count: number) => void;
}

/*This div should be a button that, on click, calls the action prop. */
function ReactionButton(props: ReactionButtonProps) {
  const style = {
    display: props.count > 0 || props.showIcons ? "inline" : "none",
  };
  return (
    <div className="ReactionButton" style={style}>
      <img
        className="ReactionButtonImage"
        src={props.image}
        onClick={() => props.countSetter(props.count + 1)}
        alt="reaction"
      />
      <p className="ReactionCounter">{props.count}</p>
    </div>
  );
}

export default ReactionButton;
