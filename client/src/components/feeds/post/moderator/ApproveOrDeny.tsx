import "./ApproveOrDeny.css";
import { useRef } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

type ApproveOrDenyProps = {
  approve: (contentWarningString: string) => void;
  deny: (contentWarningString: string) => void;
};

function ApproveOrDeny(props: ApproveOrDenyProps) {
  const contentWarningInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="ApproveOrDeny">
      <input
        className="ApproveDenyBox"
        ref={contentWarningInputRef}
        type="text"
        placeholder="Content Warning"
      />
      <button
        className="ApproveOrDenyButton ApproveButton"
        onClick={() =>
          props.approve(contentWarningInputRef.current?.value ?? "")
        }
      >
        <FaCheck />
      </button>
      <button
        className="ApproveOrDenyButton DenyButton"
        onClick={() => props.deny(contentWarningInputRef.current?.value ?? "")}
      >
        <FaTimes />
      </button>
    </div>
  );
}

export default ApproveOrDeny;
