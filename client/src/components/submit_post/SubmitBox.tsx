import "./SubmitBox.css";
import ConsentBar from "./ConsentBar";
import { Link } from "react-router-dom";
import LogoIcon from "../../images/logo128.png";
import IUser from "../../types/IUser";
import { createPost } from "../../gateways/PostGateway";
import Header from "../../components/header/Header";

type SubmitBoxProps = {
  user: IUser | undefined;
  submitted: boolean;
  submittedSetter: (arg: boolean) => void;
};

function SubmitBox(props: SubmitBoxProps) {
  const post = (text: string) => {
    props.submittedSetter(true);
    createPost(text)
      .then((response) => {
        if (response.success && response.payload) {
          console.log(response.payload);
        }
      })
      .catch(() => {
        console.log("post failed");
      });
  };

  return (
    <>
      {window.innerWidth < 768 && !props.submitted && (
        <Header user={props.user} moderatorView={false} />
      )}
      <div className="SubmitBox">
        {!props.submitted && (
          <div className="PreSubmitContent">
            <h2 className="SubmitBoxHeaderText">post anonymously</h2>
            <textarea id="TextBox" name="TextBox"></textarea>
            <div className="ConsentAndSubmit">
              <ConsentBar user={props.user} />
              <p
                className="Submit"
                onClick={() => {
                  let element = document.getElementById(
                    "TextBox"
                  ) as HTMLTextAreaElement;
                  post(element.value);
                }}
              >
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
              <div className="ReturnButton">
                <img
                  className="ReturnButtonImage"
                  src="https://i.imgur.com/UTJlo8t.png"
                  alt="Blueno Home Button"
                />
                Return to Main Feed
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default SubmitBox;
