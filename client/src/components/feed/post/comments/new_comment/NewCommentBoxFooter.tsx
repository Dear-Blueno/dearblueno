import "./NewCommentBoxFooter.css";
import SubmitCommentButton from "./SubmitCommentButton";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { useState } from "react";
import "@reach/dialog/styles.css";

type NewCommentBoxFooterProps = {
  submit: () => void;
  anonymous: boolean;
  anonymousToggle: () => void;
};

function NewCommentBoxFooter(props: NewCommentBoxFooterProps) {
  const [showPopup, setshowPopup] = useState(false);
  const openPopup = () => {
    setshowPopup(true);
  };

  const closePopup = () => setshowPopup(false);

  const popUp = (
    <div className="Popup">
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={showPopup}
      >
        <DialogContent aria-label="AnonymousConfirmationBox">
          <p className="AnonymousConfirmationBox">
            <strong>THIS IS ANONYMOUS</strong>
            <br />
            <p className="AnonymousConfirmationText">
              That means that your comment will have to be manually approved by
              our moderators before it is visible to the public. As a result,
              your comment may not appear for a number of hours. You also will
              not be able to delete this comment if it is published.
            </p>
            <br />
            <p onClick={closePopup} className="AnonymousAffirmation">
              I UNDERSTAND
            </p>
          </p>
        </DialogContent>
      </DialogOverlay>
    </div>
  );

  return (
    <div className="NewCommentBoxFooter">
      {props.anonymous ? (
        <AiOutlineEyeInvisible
          className="AnonymousIcon"
          onClick={props.anonymousToggle}
        />
      ) : (
        <AiOutlineEye
          className="AnonymousIcon"
          onClick={() => {
            props.anonymousToggle();
            openPopup();
          }}
        />
      )}
      {popUp}
      <SubmitCommentButton handleClick={props.submit} />
    </div>
  );
}

export default NewCommentBoxFooter;
