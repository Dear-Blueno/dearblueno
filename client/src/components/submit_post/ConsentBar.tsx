import "./ConsentBar.css";
import ConsentButton from "./ConsentButton";
import { useState } from "react";

type ConsentBarProps = {};

function ConsentBar(props: ConsentBarProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      className="ConsentBar"
      onClick={() => {
        setChecked(!checked);
      }}
    >
      <ConsentButton checked={checked} />
      <p className="ConsentText">
        I consent to have my message published by third parties.
      </p>
    </div>
  );
}

export default ConsentBar;
