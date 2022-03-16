import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import IUser from "../../../../../types/IUser";
import "./AnonymousToggle.css";

type AnonymousToggleProps = {
  user: IUser | undefined;
  anonymous: boolean;
  top?: boolean;
  anonymousToggle: () => void;
};

function AnonymousToggle(props: AnonymousToggleProps) {
  const [showAnonPopup, setShowAnonPopup] = useState(false);
  const openAnonPopup = () => setShowAnonPopup(true);
  const closeAnonPopup = () => setShowAnonPopup(false);

  const className = props.top
    ? "AnonymousToggle AnonymousToggle-top"
    : "AnonymousToggle";

  return (
    <>
      {props.anonymous ? (
        <button className={className} onClick={props.anonymousToggle}>
          <AiOutlineEyeInvisible className="AnonymousIcon" />
          <small>
            Posting <strong>anonymously</strong>
          </small>
        </button>
      ) : (
        <button
          className={className}
          onClick={() => {
            props.anonymousToggle();
            openAnonPopup();
          }}
        >
          <AiOutlineEye className="AnonymousIcon" />
          <small>
            Posting as <strong>{props.user?.name}</strong>
          </small>
        </button>
      )}
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
                That means that your comment will have to be manually approved
                by our moderators before it is visible to the public. As a
                result, your comment may not appear for a number of hours. You
                also will not be able to delete this comment if it is published.
              </p>
              <br />
              <p onClick={closeAnonPopup} className="PopupAction">
                I UNDERSTAND
              </p>
            </div>
          </DialogContent>
        </DialogOverlay>
      </div>
    </>
  );
}

export default AnonymousToggle;
