import "./CommentHeader.css";
import CommentMenuButton from "./CommentMenuButton";
import { IThread } from "../CommentSection";
import { formatDistanceToNowStrict } from "date-fns";
import IUser from "../../../../../types/IUser";
import IBasicUser from "../../../../../types/IUser";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { usePopper } from "react-popper";
import { getUser } from "../../../../../gateways/UserGateway";
import ProfileHoverCard from "./ProfileHoverCard";

type CommentHeaderProps = {
  user?: IUser;
  comment: IThread;
  collapsed: boolean;
  expand: () => void;
  postNumber?: number;
  inContext: boolean;
};

function CommentHeader(props: CommentHeaderProps) {
  const formatDuration = (duration: string) => {
    if (duration.includes(" seconds")) {
      return duration.replace(" seconds", "s");
    } else if (duration.includes(" second")) {
      return duration.replace(" second", "s");
    } else if (duration.includes(" minutes")) {
      return duration.replace(" minutes", "m");
    } else if (duration.includes(" minute")) {
      return duration.replace(" minute", "m");
    } else if (duration.includes(" hours")) {
      return duration.replace(" hours", "h");
    } else if (duration.includes(" hour")) {
      return duration.replace(" hour", "h");
    } else if (duration.includes(" days")) {
      return duration.replace(" days", "d");
    } else if (duration.includes(" day")) {
      return duration.replace(" day", "d");
    } else if (duration.includes(" months")) {
      return duration.replace(" months", "mo");
    } else if (duration.includes(" month")) {
      return duration.replace(" month", "mo");
    } else if (duration.includes(" years")) {
      return duration.replace(" years", "y");
    } else if (duration.includes(" year")) {
      return duration.replace(" year", "y");
    } else {
      return duration;
    }
  };

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
        setHoverUser(response.payload as IBasicUser);
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
            {props.comment.author?.name ?? "Anonymous"}
          </p>
        </Link>
      ) : (
        <p className="CommentAuthor">Anonymous</p>
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

      <p className="CommentDate">
        {formatDuration(
          formatDistanceToNowStrict(new Date(props.comment.commentTime))
        )}
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
        />
      )}
    </div>
  );
}

export default CommentHeader;
