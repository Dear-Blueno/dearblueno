import "./CommentMenuButton.css";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import { DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";
import IUser from "../../../../../types/IUser";

interface CommentMenuButtonProps {
  user?: IUser;
  commentUser?: IUser;
}

function CommentMenuButton(props: CommentMenuButtonProps) {
  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const [arrowElement, setArrowElement] = useState<any>(null);
  const { styles, attributes } = usePopper<any>(
    referenceElement,
    popperElement,
    {
      placement: "bottom-end",
      modifiers: [
        {
          name: "arrow",
          options: { element: arrowElement },
        },
        {
          name: "offset",
          options: { offset: [8, 8] },
        },
        {
          name: "flip",
          options: {
            allowedAutoPlacements: ["top", "bottom"], // by default, all the placements are allowed
            flipVariations: false,
          },
        },
      ],
    }
  );
  const [clicked, setClicked] = useState(false);
  const actions = ["report", "share", "delete"];

  const [showPopup, setshowPopup] = useState(false);
  const openPopup = () => {
    setshowPopup(true);
    setClicked(false);
  };

  const closePopup = () => setshowPopup(false);

  let refDropdown = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: any) => {
    if (refDropdown.current && !refDropdown.current.contains(event.target)) {
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
        <DialogContent>
          <p>
            <strong>REPORT REASON</strong>
            {reportReasons.map((reason) => (
              <div className="ReportReason" key={reason}>
                {reason}
              </div>
            ))}
          </p>
        </DialogContent>
      </DialogOverlay>
    </div>
  );

  return (
    <div className="CommentMenuDropdown" ref={refDropdown}>
      <div className="CommentMenuButton" ref={setReferenceElement}>
        {popUp}
        <div
          className="CommentMenuDropdownText"
          onClick={() => setClicked(!clicked)}
        >
          •••
        </div>
        {clicked && (
          <div
            className="PopperContainer"
            ref={setPopperElement}
            style={styles.popper}
            role="tooltip"
            {...attributes.popper}
          >
            <div
              className="DropdownArrow"
              ref={setArrowElement}
              style={styles.arrow}
            />
            <div className="MenuDropdownActions">
              {props.user &&
              props.commentUser &&
              props.user._id === props.commentUser._id ? null : (
                <p className="MenuDropdownAction" onClick={openPopup}>
                  {actions[0]}
                </p>
              )}
              <p className="MenuDropdownAction">{actions[1]}</p>
              {props.user &&
              props.commentUser &&
              props.user._id === props.commentUser._id ? (
                <p className="MenuDropdownAction">{actions[2]}</p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentMenuButton;
