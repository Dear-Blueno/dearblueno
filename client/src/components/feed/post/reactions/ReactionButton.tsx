import "./ReactionButton.css";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import ReactionDropdown from "./ReactionDropdown";
import { getUser } from "../../../../gateways/UserGateway";

interface ReactionButtonProps {
  type: "comment" | "post";
  images: string[];
  count: number;
  reactionArray: string[];
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

  // BUG : Needs to fix this backend query with Nick, not sure how we should implement this to match schema
  // const nameArray = props.reactionArray.map((id) => {
  //   return getUser(id).then((response) => {
  //     if (response.success && response.payload) {
  //       return response.payload.name;
  //     }
  //   });
  // });
  
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
      />
      <p
        className={className + "Count"}
        ref={setReferenceElement}
        onMouseEnter={() => setShowDropdown(true)}
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

      {showDropdown && props.count !== 0 && (
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
            users={props.reactionArray} // Currently only displays the id of the user, not the name
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
