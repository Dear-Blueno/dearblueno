import styles from "./CommentHeader.module.scss";
import CommentMenuButton from "./CommentMenuButton";
import { IThread } from "../CommentSection";
import { BsCode } from "react-icons/bs";
import { RiVipDiamondFill } from "react-icons/ri";
import { IBasicUser } from "types/IUser";
import { useState, useRef } from "react";
import { usePopper } from "react-popper";
import { getUser } from "gateways/UserGateway";
import ProfileHoverCard from "./ProfileHoverCard";
import RelativeDate from "../../RelativeDate";

interface CommentHeaderProps {
  comment: IThread;
  collapsed: boolean;
  expand: () => void;
  postNumber?: number;
  inContext: boolean;
  setComments?: React.Dispatch<React.SetStateAction<IThread[]>>;
}

function CommentHeader(props: CommentHeaderProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLParagraphElement | null>();
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>();
  const { styles: popperStyles, attributes } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "top",
      modifiers: [
        {
          name: "offset",
          options: { offset: [2, 8] },
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
      if (response.success) {
        setHoverUser(response.payload);
      }
    }
  };

  return (
    <div className={styles.CommentHeader}>
      {props.comment.author ? (
        <a
          href={`/profile/${props.comment.author._id}`}
          className={styles.ProfileLink}
        >
          <p
            className={styles.CommentAuthor}
            ref={setReferenceElement}
            onMouseEnter={() => {
              isHovering.current = true;
              getHoverUser()
                .then(() => {
                  setTimeout(() => {
                    if (isHovering.current) {
                      setShowCard(true);
                    }
                  }, 400);
                })
                .catch((error) => {
                  console.error(error);
                });
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

      {props.comment.author?._id === "61f343cfa90eee523f25f222" && (
        <BsCode className={styles.DevBadge} title="Verified Developer" />
      )}

      {/* if comments author badges array contains "Top Fan", verified developer */}
      {props.comment.author?.badges.includes("Top Fan") && (
        <RiVipDiamondFill className={styles.TopFanBadge} title="Top Fan" />
      )}

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
