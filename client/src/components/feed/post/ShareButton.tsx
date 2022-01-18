import "./ShareButton.css";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";

type ShareButtonProps = {
  postNumber?: number;
};

function ShareButton(props: ShareButtonProps) {
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

  const timedOpen = () => {
    navigator.clipboard.writeText("https://dearblueno.net/post/" + props.postNumber);
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 1000);
  };

  return (
    <div className="ShareButton" ref={setReferenceElement}>
      <p className="ShareButton" onClick={timedOpen}>
        share
      </p>
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
            <p>Copied to Clipboard!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShareButton;
