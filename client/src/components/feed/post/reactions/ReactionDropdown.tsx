import IUser from "../../../../types/IUser";
import "./ReactionDropdown.css";

type ReactionDropdownProps = {
  users: string[];
  leaveAction: () => void;
  enterAction: () => void;
};

function ReactionDropdown(props: ReactionDropdownProps) {
  return (
    <div
      className="ReactionDropdown"
      onMouseLeave={props.leaveAction}
      onMouseEnter={props.enterAction}
    >
      {props.users.map((user, index) => {
        return (
          <div className="ReactionDropdownUser" key={index}>
            {user}
          </div>
        );
      })}
    </div>
  );
}

export default ReactionDropdown;
