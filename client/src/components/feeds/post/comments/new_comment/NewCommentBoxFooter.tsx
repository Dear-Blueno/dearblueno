import "./NewCommentBoxFooter.css";
import CommentFooterButton from "./CommentFooterButton";
import { AiOutlineEye } from "react-icons/ai";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { useState } from "react";
import "@reach/dialog/styles.css";

type NewCommentBoxFooterProps = {
  submit: () => void;
  anonymous: boolean;
  anonymousToggle: () => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  setShow: (show: boolean) => void;
};

function NewCommentBoxFooter(props: NewCommentBoxFooterProps) {
  const [showAnonPopup, setshowAnonPopup] = useState(false);
  const openAnonPopup = () => {
    setshowAnonPopup(true);
  };
  const closeAnonPopup = () => setshowAnonPopup(false);

  const [showCancelPopup, setshowCancelPopup] = useState(false);
  const openCancelPopup = () => {
    setshowCancelPopup(true);
  };
  const closeCancelPopup = () => setshowCancelPopup(false);

  const cancelHandler = () => {
    if (props.textAreaRef.current && props.textAreaRef.current.value) {
      openCancelPopup();
    } else {
      props.setShow(false);
    }
  };

  const AnonPopUp = (
    <div className="Popup">
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={showAnonPopup}
      >
        <DialogContent aria-label="AnonymousConfirmationBox">
          <div className="AnonymousConfirmationBox">
            <strong>THIS IS ANONYMOUS</strong>
            <br />
            <p className="AnonymousConfirmationText">
              That means that your comment will have to be manually approved by
              our moderators before it is visible to the public. As a result,
              your comment may not appear for a number of hours. You also will
              not be able to delete this comment if it is published.
            </p>
            <br />
            <p onClick={closeAnonPopup} className="PopupAction">
              I UNDERSTAND
            </p>
          </div>
        </DialogContent>
      </DialogOverlay>
    </div>
  );

  const CancelPopUp = (
    <div className="Popup">
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={showCancelPopup}
      >
        <DialogContent aria-label="CancelConfirmationBox">
          <p className="CancelConfirmationBox">
            <p className="CancelConfirmationText">
              <strong>ARE YOU SURE?</strong>
            </p>
            <br />
            <div className="CancelConfirmationOptions">
              <p onClick={closeCancelPopup} className="PopupAction">
                No
              </p>
              <p
                onClick={() => {
                  closeCancelPopup();
                  props.setShow(false);
                }}
                className="PopupAction"
              >
                Yes
              </p>
            </div>
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
            openAnonPopup();
          }}
        />
      )}
      {AnonPopUp}
      {CancelPopUp}
      <div className="CommentFooterButtonContainer">
        <CommentFooterButton handleClick={cancelHandler} text="cancel" />
        <CommentFooterButton handleClick={props.submit} text="submit" />
      </div>
    </div>
  );
}

export default NewCommentBoxFooter;
