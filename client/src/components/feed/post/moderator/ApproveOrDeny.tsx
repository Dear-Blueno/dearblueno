import "./ApproveOrDeny.css";
import { FaCheck, FaTimes } from "react-icons/fa";

type ApproveOrDenyProps = {
  approve: () => void;
  deny: () => void;
};

function ApproveOrDeny(props: ApproveOrDenyProps) {
  return (
    <div className="ApproveOrDeny">
      <div
        className="ApproveOrDenyButton ApproveButton"
        onClick={props.approve}
      >
        <FaCheck />
      </div>
      <div className="ApproveOrDenyButton DenyButton" onClick={props.deny}>
        <FaTimes />
      </div>
    </div>
  );
}

export default ApproveOrDeny;
