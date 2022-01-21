import "./ApproveOrDeny.css";
import { FaCheck, FaTimes } from "react-icons/fa";

type ApproveOrDenyProps = {
  approve: () => void;
  deny: () => void;
};

function ApproveOrDeny(props: ApproveOrDenyProps) {
  return (
    <div className="ApproveOrDeny">
      <button
        className="ApproveOrDenyButton ApproveButton"
        onClick={props.approve}
      >
        <FaCheck />
      </button>
      <button className="ApproveOrDenyButton DenyButton" onClick={props.deny}>
        <FaTimes />
      </button>
    </div>
  );
}

export default ApproveOrDeny;
