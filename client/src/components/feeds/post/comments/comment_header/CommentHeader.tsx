import styles from "./CommentHeader.module.scss";
import CommentMenuButton from "./CommentMenuButton";
import { IThread } from "../CommentSection";
import { BsCode } from "react-icons/bs";
import { IBasicUser } from "../../../../../types/IUser";
import { useState, useRef } from "react";
import { usePopper } from "react-popper";
import { getUser } from "../../../../../gateways/UserGateway";
import ProfileHoverCard from "./ProfileHoverCard";
import RelativeDate from "../../RelativeDate";

type CommentHeaderProps = {
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
  const { styles: popperStyles, attributes } = usePopper<any>(
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

  const getHoverUser = async () => {
    if (!hoverUser && props.comment.author) {
      const response = await getUser(props.comment.author._id);
      if (response.success && response.payload) {
        setHoverUser(response.payload);
      }
    }
  };

  return (
    <div className={styles.CommentHeader}>
      {props.comment.author ? (
        <a
          href={`/profile/${props.comment.author?._id}`}
          className={styles.ProfileLink}
        >
          <p
            className={styles.CommentAuthor}
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
        </a>
      ) : (
        <p className={styles.CommentAuthor}>
          {props.comment.content === "[deleted]" ? "[deleted]" : "Anonymous"}
        </p>
      )}
      {hoverUser && showCard && (
        <div
          className={styles.PopperContainer}
          ref={setPopperElement}
          style={popperStyles.popper}
          role="tooltip"
          {...attributes.popper}
        >
          <div
            className={styles.DropdownArrow}
            ref={setArrowElement}
            style={popperStyles.arrow}
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
        <BsCode className={styles.DevBadge} title="Verified Developer" />
      ) : null}

      <p className={styles.CommentDate}>
        <RelativeDate date={props.comment.commentTime} />
      </p>

      {props.collapsed && (
        <p className={styles.ExpandThreadButton} onClick={props.expand}>
          expand
        </p>
      )}
      {!props.inContext && (
        <CommentMenuButton
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
