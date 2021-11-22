import "./SubmitBox.css";
import ConsentBar from "./ConsentBar";

type SubmitBoxProps = {};

function SubmitBox(props: SubmitBoxProps) {
  return (
    <div className="SubmitBox">
      <h2 className="SubmitBoxHeaderText">post anonymously</h2>
      <textarea id="textinput" name="textinput"></textarea>
      <div className="ConsentAndSubmit">
        <ConsentBar />
        <p className="Submit">submit</p>
      </div>
    </div>
  );
}

export default SubmitBox;
