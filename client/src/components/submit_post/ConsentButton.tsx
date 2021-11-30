import "./ConsentButton.css";
import checkMark from "../../images/check-mark.svg";

interface ConsentButtonProps {
  checked: boolean;
}

/*This div should be a button that, on click, calls the action prop. */
function ConsentButton(props: ConsentButtonProps) {
  const className = props.checked ? "ConsentButton checked" : "ConsentButton";
  return (
    <div className={className}>
      {props.checked && (
        <img src={checkMark} alt="checkMark" className="CheckMark" />
      )}
    </div>
  );
}

export default ConsentButton;
