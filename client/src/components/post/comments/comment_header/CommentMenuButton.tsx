import styles from "./CommentMenuButton.module.scss";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { IBasicUser } from "types/IUser";
import { IThread } from "../CommentSection";
import { deleteComment, flagComment } from "gateways/PostGateway";
import { findComment } from "../new_comment/NewCommentBox";
import useUser from "hooks/useUser";
import { useLoginPopup } from "hooks/login-popup";
import toast from "react-hot-toast";

interface CommentMenuButtonProps {
  commentNumber: number;
  postNumber: number;
  commentUser?: IBasicUser;
  reported: boolean;
  setComments?: React.Dispatch<React.SetStateAction<IThread[]>>;
}

function CommentMenuButton(props: CommentMenuButtonProps) {
  const { user } = useUser();
  const { userOnlyAction } = useLoginPopup();
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "bottom",
      modifiers: [
        {
          name: "offset",
          options: { offset: [2, 8] },
        },
      ],
    }
  );
  const [clicked, setClicked] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const openPopup = () => {
    setShowPopup(true);
    setClicked(false);
  };

  const closePopup = () => setShowPopup(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const openDeletePopup = () => {
    setShowDeletePopup(true);
  };
  const closeDeletePopup = () => setShowDeletePopup(false);

  const refDropdown = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      refDropdown.current &&
      !refDropdown.current.contains(event.target as Node)
    ) {
      setClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  const reportReasons = ["spam", "inappropriate", "other"];

  const popUp = (
    <div className="Popup">
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={showPopup}
        onDismiss={closePopup}
      >
        <DialogContent aria-label="Report Dialog">
          <strong>Report Reason</strong>
          <br />
          <br />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            {reportReasons.map((reason) => (
              <button
                key={reason}
                className={styles.PopupAction}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  paddingBlock: "0.25em",
                }}
                onClick={() => {
                  const action = userOnlyAction(async () => {
                    const response = await flagComment(
                      props.postNumber,
                      props.commentNumber,
                      reason
                    );
                    if (response.success) {
                      toast.success("Comment reported");
                    } else {
                      toast.error(
                        (response.message as unknown as { message: string })
                          .message
                      );
                      console.log(response);
                    }
                    closePopup();
                  });
                  void action();
                }}
                tabIndex={-1}
              >
                {reason}
              </button>
            ))}
          </div>
          <br />
          <button
            className={styles.PopupAction}
            style={{ all: "unset", cursor: "pointer", float: "right" }}
            onClick={() => {
              closePopup();
            }}
            tabIndex={-1}
          >
            Cancel
          </button>
        </DialogContent>
      </DialogOverlay>
    </div>
  );

  const deletePopUp = (
    <div className="Popup">
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={showDeletePopup}
        onDismiss={closeDeletePopup}
      >
        <DialogContent aria-label="Delete Dialog">
          <p className={styles.DeleteBox}>
            <p className="DeleteConfirmationText">
              <strong>ARE YOU SURE?</strong>
            </p>
            <br />
            <div className={styles.DeleteConfirmationOptions}>
              <p onClick={closeDeletePopup} className={styles.PopupAction}>
                No
              </p>
              <p
                onClick={() => {
                  closeDeletePopup();
                  deleteComment(props.postNumber, props.commentNumber)
                    .then((response) => {
                      console.log(props.setComments);
                      if (response.success && props.setComments) {
                        props.setComments((comments) => {
                          const newComments = [...comments];
                          const deleted = findComment(
                            newComments,
                            props.commentNumber
                          );
                          if (deleted) {
                            deleted.author = undefined;
                            deleted.content = "[deleted]";
                          }
                          return newComments;
                        });
                      }
                    })
                    .catch((error) => {
                      console.error(error);
                    });
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
    <div className="CommentMenuDropdown" ref={refDropdown}>
      <div className={styles.CommentMenuButton} ref={setReferenceElement}>
        {popUp}
        {deletePopUp}
        <div
          className={styles.CommentMenuDropdownText}
          onClick={() => setClicked(!clicked)}
        >
          •••
        </div>
        {clicked && (
          <div
            className={styles.PopperContainer}
            ref={setPopperElement}
            style={popperStyles.popper}
            role="tooltip"
            {...attributes.popper}
          >
            <div className={styles.MenuDropdownActions}>
              {/* {!copied && ( */}
              <>
                {user &&
                props.commentUser &&
                user._id === props.commentUser._id ? null : (
                  <p className={styles.MenuDropdownAction} onClick={openPopup}>
                    report
                  </p>
                )}
                {user &&
                props.commentUser &&
                user._id === props.commentUser._id ? (
                  <p
                    className={styles.MenuDropdownAction}
                    onClick={() => {
                      openDeletePopup();
                    }}
                  >
                    delete
                  </p>
                ) : null}
              </>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentMenuButton;
