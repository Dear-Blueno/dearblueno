import "./CommentMenuButton.css";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import { Dialog, DialogOverlay, DialogContent } from "@reach/dialog";
import "@reach/dialog/styles.css";

interface CommentMenuButtonProps {}

function CommentMenuButton(props: CommentMenuButtonProps) {
  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const [arrowElement, setArrowElement] = useState<any>(null);
  const { styles, attributes } = usePopper<any>(
    referenceElement,
    popperElement,
    {
      placement: "bottom-start",
      modifiers: [
        {
          name: "arrow",
          options: { element: arrowElement },
        },
        {
          name: "offset",
          options: { offset: [-10, 10] },
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
    <div className="CommentMenuDropDown" ref={refDropdown}>
      <div className="CommentMenuButton" ref={setReferenceElement}>
        {popUp}
        <p onClick={() => setClicked(!clicked)}>⋯</p>
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
              {actions.map((action) => (
                <p className="MenuDropdownAction" key={action} onClick={openPopup}>
                  {action}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentMenuButton;
