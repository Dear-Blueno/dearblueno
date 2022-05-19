import styles from "./ApproveOrDeny.module.scss";
import { useRef } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

type ApproveOrDenyProps = {
  approve: (contentWarningString: string) => void;
  deny: (contentWarningString: string) => void;
  type: "post" | "comment";
};

function ApproveOrDeny(props: ApproveOrDenyProps) {
  const contentWarningInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.ApproveOrDeny}>
      {props.type === "post" && (
        <input
          className={styles.ApproveDenyBox}
          ref={contentWarningInputRef}
          type="text"
          placeholder="Content Warning"
        />
      )}
      <button
        className={styles.ApproveOrDenyButton + " " + styles.ApproveButton}
        onClick={() =>
          props.approve(contentWarningInputRef.current?.value ?? "")
        }
      >
        <FaCheck />
      </button>
      <button
        className={styles.ApproveOrDenyButton + " " + styles.DenyButton}
        onClick={() => props.deny(contentWarningInputRef.current?.value ?? "")}
      >
        <FaTimes />
      </button>
    </div>
  );
}

export default ApproveOrDeny;
