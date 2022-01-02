import "./ReactionButton.css";
import { useState } from "react";
import { usePopper } from "react-popper";
import ReactionDropdown from "./ReactionDropdown";

interface ReactionButtonProps {
  type: "comment" | "post";
  images: string[];
  count: number;
  handleClick: () => void;
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
      ],
    }
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const [inDropdown, setInDropdown] = useState(false);

  return (
    <div className={className}>
      <img
        className={className + "Image"}
        src={props.count ? props.images[0] : props.images[1]}
        onClick={() => {
          props.handleClick();
        }}
        alt="reaction"
      />
      <p
        className={className + "Count"}
        ref={setReferenceElement}
        onMouseEnter={() => 
          setShowDropdown(true)
        }
        onMouseLeave={() =>
          setTimeout(() => {
            if (!inDropdown) {
              setShowDropdown(false);
            }
          }, 500)
        }
      >
        {props.count}
      </p>

      {showDropdown && (
        <div
          className="PopperContainer"
          ref={setPopperElement}
          style={styles.popper}
          role="tooltip"
          {...attributes.popper}
        >
          <ReactionDropdown
            leaveAction={() => {setInDropdown(false); setShowDropdown(false)}}
            enterAction={() => setInDropdown(true)}
          ></ReactionDropdown>
          <div id="arrow" ref={setArrowElement} style={styles.arrow} />
        </div>
      )}
    </div>
  );
}

export default ReactionButton;
