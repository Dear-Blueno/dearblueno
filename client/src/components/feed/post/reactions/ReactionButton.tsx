import "./ReactionButton.css";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import ReactionDropdown from "./ReactionDropdown";

interface ReactionButtonProps {
  type: "comment" | "post";
  images: string[];
  count: number;
  reactionArray: string[];
  handleClick: () => void;
  names: string[];
  handleHover: () => void;
}

function ReactionButton(props: ReactionButtonProps) {
  const className =
    props.type === "comment" ? "CommentReactionButton" : "PostReactionButton";

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
  const [showDropdown, setShowDropdown] = useState(false);
  const inDropdown = useRef(false);
  const isCancelled = useRef(false);

  // cleanup
  useEffect(() => {
    return () => {
      isCancelled.current = true;
    };
  }, []);

  return (
    <div className={className}>
      <img
        className={className + "Image"}
        src={props.count ? props.images[0] : props.images[1]}
        onClick={() => {
          props.handleClick();
        }}
        alt="reaction"
        draggable={false}
      />
      <p
        className={className + "Count"}
        ref={setReferenceElement}
        onMouseEnter={() => {
          if (props.names.length === 0) {
            props.handleHover();
            setShowDropdown(true);
          } else {
            setShowDropdown(true);
          }
        }}
        onMouseLeave={() => {
          setTimeout(() => {
            if (!isCancelled.current && !inDropdown.current) {
              setShowDropdown(false);
            }
          }, 200);
        }}
      >
        {props.count}
      </p>

      {props.names.length !== 0 && showDropdown && (
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
          <ReactionDropdown
            users={props.names}
            leaveAction={() => {
              inDropdown.current = false;
              setShowDropdown(false);
            }}
            enterAction={() => {
              inDropdown.current = true;
            }}
          ></ReactionDropdown>
        </div>
      )}
    </div>
  );
}

export default ReactionButton;
