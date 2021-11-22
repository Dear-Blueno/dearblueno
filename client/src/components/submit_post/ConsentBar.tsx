import "./ConsentBar.css";
import ConsentButton from "./ConsentButton"

type ConsentBarProps = {};

function ConsentBar(props: ConsentBarProps) {
  return (
    <div className="ConsentBar">
      <ConsentButton action={() => {}}/>
      <p className="ConsentText">I consent to have my message published by third parties.</p>
    </div>
  );
}

export default ConsentBar;
