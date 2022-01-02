import "./ReactionDropdown.css";

type ReactionButtonProps = {
  leaveAction: () => void;
  enterAction: () => void;
}

function ReactionDropdown(props : ReactionButtonProps) {
  return (
    <div className="ReactionDropdown" onMouseLeave={props.leaveAction} onMouseEnter={props.enterAction}>
      <p>
      Nick Vadasz
      Dylan Hu 
      Nick Bottone
      </p>
    </div>
  );
}

export default ReactionDropdown;
