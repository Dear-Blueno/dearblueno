import styles from "./NewCommentBoxFooter.module.scss";
import CommentFooterButton from "./CommentFooterButton";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import { useState } from "react";
import "@reach/dialog/styles.css";
import AnonymousToggle from "./AnonymousToggle";
import { useIsMobile } from "hooks/is-mobile";

interface NewCommentBoxFooterProps {
  submit: () => Promise<boolean>;
  anonymous: boolean;
  anonymousToggle: () => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  setShow: (show: boolean) => void;
}

function NewCommentBoxFooter(props: NewCommentBoxFooterProps) {
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const openCancelPopup = () => setShowCancelPopup(true);
  const closeCancelPopup = () => setShowCancelPopup(false);

  const isMobile = useIsMobile();

  const cancelHandler = () => {
    if (props.textAreaRef.current?.value) {
      openCancelPopup();
    } else {
      props.setShow(false);
    }
    return Promise.resolve(true);
  };

  const CancelPopUp = (
    <div className="Popup">
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={showCancelPopup}
      >
        <DialogContent aria-label="CancelConfirmationBox">
          <p className={styles.CancelConfirmationBox}>
            <p className={styles.CancelConfirmationText}>
              <strong>ARE YOU SURE?</strong>
            </p>
            <br />
            <div className={styles.CancelConfirmationOptions}>
              <p onClick={closeCancelPopup} className={styles.PopupAction}>
                No
              </p>
              <p
                onClick={() => {
                  closeCancelPopup();
                  props.setShow(false);
                }}
                className={styles.PopupAction}
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
      <div className={styles.NewCommentBoxFooter}>
        {!isMobile && (
          <>
            <AnonymousToggle
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
