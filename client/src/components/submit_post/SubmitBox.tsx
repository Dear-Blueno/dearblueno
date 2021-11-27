import "./SubmitBox.css";
import ConsentBar from "./ConsentBar";
import { Link } from "react-router-dom";
import LogoIcon from "../../images/logo128.png";

type SubmitBoxProps = {
  submitted: boolean;
  submittedSetter: (arg0: boolean) => void;
};

function SubmitBox(props: SubmitBoxProps) {

  return (
    <div className="SubmitBox">
      {!props.submitted && (
        <div className="PreSubmitContent">
          <h2 className="SubmitBoxHeaderText">post anonymously</h2>
          <textarea id="textinput" name="textinput"></textarea>
          <div className="ConsentAndSubmit">
            <ConsentBar />
            <p className="Submit" onClick={() => props.submittedSetter(true)}>
              submit
            </p>
          </div>
        </div>
      )}
      {props.submitted && (
        <div className="PostSubmitContent">
          <h2 className="ReturnText">
            Your post has been submitted and will be reviewed by moderators
            shortly. Thank you.{" "}
          </h2>
          <Link to="/">
            <img
              className="ReturnButton"
              src={LogoIcon}
              alt="Blueno Home Button"
            />
          </Link>
        </div>
      )}
    </div>
  );
}

export default SubmitBox;
