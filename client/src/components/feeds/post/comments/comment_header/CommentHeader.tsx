import "./CommentHeader.css";
import CommentMenuButton from "./CommentMenuButton";
import { IThread } from "../CommentSection";
import { BsCode } from "react-icons/bs";
import IUser, { IBasicUser } from "../../../../../types/IUser";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import { getUser } from "../../../../../gateways/UserGateway";
import ProfileHoverCard from "./ProfileHoverCard";
import RelativeDate from "../../RelativeDate";

type CommentHeaderProps = {
  user?: IUser;
  comment: IThread;
  collapsed: boolean;
  expand: () => void;
  postNumber?: number;
  inContext: boolean;
  setComments?: React.Dispatch<React.SetStateAction<IThread[]>>;
};

function CommentHeader(props: CommentHeaderProps) {
  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);
  const [arrowElement, setArrowElement] = useState<any>(null);
  const { styles, attributes } = usePopper<any>(
    referenceElement,
    popperElement,
    {
      placement: "top",
      modifiers: [
        {
          name: "arrow",
          options: { element: arrowElement },
        },
        {
          name: "offset",
          options: { offset: [8, 20] },
        },
        {
          name: "flip",
          options: {
            allowedAutoPlacements: ["top", "bottom"], // by default, all the placements are allowed
            flipVariations: true,
          },
        },
      ],
    }
  );
  const [showCard, setShowCard] = useState(false);
  const [hoverUser, setHoverUser] = useState<IBasicUser>();
  const isHovering = useRef(false);
  const inDropdown = useRef(false);
  const isCancelled = useRef(false);

  // cleanup
  useEffect(() => {
    return () => {
      isCancelled.current = true;
    };
  }, []);

  const getHoverUser = async () => {
    if (!hoverUser && props.comment.author) {
      const response = await getUser(props.comment.author._id);
      if (response.success && response.payload) {
        setHoverUser(response.payload);
      }
    }
  };

  return (
    <div className="CommentHeader">
      {props.comment.author ? (
        <Link
          to={`/profile/${props.comment.author?._id}`}
          className="ProfileLink"
        >
          <p
            className="CommentAuthor"
            ref={setReferenceElement}
            onMouseEnter={() => {
              isHovering.current = true;
              getHoverUser();
              setTimeout(() => {
                if (isHovering.current) {
                  setShowCard(true);
                }
              }, 400);
            }}
            onMouseLeave={() => {
              isHovering.current = false;
              setTimeout(() => {
                if (!isCancelled.current && !inDropdown.current) {
                  setShowCard(false);
                }
              }, 200);
            }}
          >
            {props.comment.author.name}
          </p>
        </Link>
      ) : (
        <p className="CommentAuthor">
          {props.comment.content === "[deleted]" ? "[deleted]" : "Anonymous"}
        </p>
      )}
      {hoverUser && showCard && (
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
          <ProfileHoverCard
            hoverUser={hoverUser}
            leaveAction={() => {
              inDropdown.current = false;
              setShowCard(false);
            }}
            enterAction={() => {
              inDropdown.current = true;
            }}
          />
        </div>
      )}

      {props.comment.author?._id === "61f343cfa90eee523f25f222" ? (
        <BsCode className="DevBadge" title="Verified Developer" />
      ) : null}

      <p className="CommentDate">
        <RelativeDate date={props.comment.commentTime} />
      </p>

      {props.collapsed && (
        <p className="ExpandThreadButton" onClick={props.expand}>
          expand
        </p>
      )}
      {!props.inContext && (
        <CommentMenuButton
          user={props.user}
          commentUser={props.comment.author}
          reported={props.comment.needsReview}
          commentNumber={props.comment.commentNumber}
          postNumber={props.postNumber ?? 0}
          setComments={props.setComments}
        />
      )}
    </div>
  );
}

export default CommentHeader;
