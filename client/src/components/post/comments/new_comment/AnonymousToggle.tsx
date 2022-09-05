import styles from "./AnonymousToggle.module.scss";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import useUser from "hooks/useUser";

interface AnonymousToggleProps {
  anonymous: boolean;
  top?: boolean;
  anonymousToggle: () => void;
}

function AnonymousToggle(props: AnonymousToggleProps) {
  const { user } = useUser();
  const [showAnonPopup, setShowAnonPopup] = useState(false);
  const openAnonPopup = () => setShowAnonPopup(true);
  const closeAnonPopup = () => setShowAnonPopup(false);

  const className = props.top
    ? styles.AnonymousToggle + " " + styles["AnonymousToggle-top"]
    : styles.AnonymousToggle;

  return (
    <div className={styles.AnonymousToggleWrapper}>
      {props.anonymous ? (
        <button className={className} onClick={props.anonymousToggle}>
          <AiOutlineEyeInvisible className={styles.AnonymousIcon} />
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
          <AiOutlineEye className={styles.AnonymousIcon} />
          <small className={styles.AnonymousDetail}>
            <span>
              Posting as <strong>{user?.displayName ?? user?.name}</strong>
            </span>
          </small>
        </button>
      )}
      <div className="Popup">
        <DialogOverlay
          style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
          isOpen={showAnonPopup}
        >
          <DialogContent aria-label="AnonymousConfirmationBox">
            <div className={styles.AnonymousConfirmationBox}>
              <strong>THIS IS ANONYMOUS</strong>
              <br />
              <p className="AnonymousConfirmationText">
                That means that your comment will have to be manually approved
                by our moderators before it is visible to the public. As a
                result, your comment may not appear for a number of hours. You
                also will not be able to delete this comment if it is published.
              </p>
              <br />
              <p onClick={closeAnonPopup} className={styles.PopupAction}>
                I UNDERSTAND
              </p>
            </div>
          </DialogContent>
        </DialogOverlay>
      </div>
    </div>
  );
}

export default AnonymousToggle;
