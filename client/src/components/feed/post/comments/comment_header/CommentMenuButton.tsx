import "./CommentMenuButton.css";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";

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

  return (
    <div className="CommentMenuDropDown" ref={refDropdown}>
      <div className="CommentMenuButton" ref={setReferenceElement}>
        <p onClick={() => setClicked(!clicked)}>⋯</p>
        {clicked && (
          <div
            className="PopperContainer"
            ref={setPopperElement}
            style={styles.popper}
            role="tooltip"
            onBlur={() => console.log("TEEHEE")}
            {...attributes.popper}
          >
            <div
              className="DropdownArrow"
              ref={setArrowElement}
              style={styles.arrow}
            />
            <div className="MenuDropdownActions">
              {actions.map((action) => (
                <p className="MenuDropdownAction" key={action}>
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
