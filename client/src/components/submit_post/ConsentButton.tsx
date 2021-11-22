import "./ConsentButton.css";

interface HomeButtonProps {
  action: () => void;
}

/*This div should be a button that, on click, calls the action prop. */
function ConsentButton(props: HomeButtonProps) {
  return (
    <div className="ConsentButton">
      <input id="box" type="checkbox" onClick={props.action}></input>
    </div>
  );
}

export default ConsentButton;
