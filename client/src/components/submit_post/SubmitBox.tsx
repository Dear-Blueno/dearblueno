import "./SubmitBox.css";
import ConsentBar from "./ConsentBar";
import { Link } from "react-router-dom";
import LogoIcon from "../../images/logo128.png";
import IUser from "../../types/IUser";
import { useState } from "react";
import { approvePost, createPost } from "../../gateways/PostGateway";

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
          approvePost(response.payload._id, true).then((response) => {
            console.log(response);
          });
        }
      })
      .catch(() => {
        console.log("post failed");
      });
  };

  return (
    <div className="SubmitBox">
      {!props.submitted && (
        <div className="PreSubmitContent">
          <h2 className="SubmitBoxHeaderText">post anonymously</h2>
          <textarea id="TextBox" name="TextBox"></textarea>
          <div className="ConsentAndSubmit">
            <ConsentBar />
            <p
              className="Submit"
              onClick={() => {
                let element = document.getElementById(
                  "TextBox"
                ) as HTMLTextAreaElement;
                console.log(element.value);
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
            shortly. Thank you. **DEMO ONLY - NO POSTS ARE ACCEPTED**{" "}
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
