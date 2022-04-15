import "./NewCommentBoxFooter.css";
import CommentFooterButton from "./CommentFooterButton";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { useState } from "react";
import "@reach/dialog/styles.css";
import IUser from "../../../../../types/IUser";
import AnonymousToggle from "./AnonymousToggle";
import { useIsMobile } from "hooks/is-mobile";

type NewCommentBoxFooterProps = {
  user: IUser | undefined;
  submit: () => void;
  anonymous: boolean;
  anonymousToggle: () => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  setShow: (show: boolean) => void;
};

function NewCommentBoxFooter(props: NewCommentBoxFooterProps) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const openCancelPopup = () => setShowCancelPopup(true);
  const closeCancelPopup = () => setShowCancelPopup(false);

  const isMobile = useIsMobile();

  const cancelHandler = () => {
    if (props.textAreaRef.current && props.textAreaRef.current.value) {
      openCancelPopup();
    } else {
      props.setShow(false);
    }
  };

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
    <>
      {CancelPopUp}
      <div className="NewCommentBoxFooter">
        {!isMobile && (
          <>
            <AnonymousToggle
              user={props.user}
              anonymous={props.anonymous}
              anonymousToggle={props.anonymousToggle}
            />
            <div style={{ flex: 1 }} />
          </>
        )}
        <CommentFooterButton handleClick={cancelHandler} text="cancel" />
        <CommentFooterButton handleClick={props.submit} text="submit" />
      </div>
    </>
  );
}

export default NewCommentBoxFooter;
