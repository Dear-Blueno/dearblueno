import styles from "./ReactionBar.module.scss";
import ReactionButton from "./ReactionButton";
import AngryIcon from "images/angry.svg";
import AngryBWIcon from "images/angryBW.svg";
import CryIcon from "images/cry.svg";
import CryBWIcon from "images/cryBW.svg";
import HeartIcon from "images/heart.svg";
import HeartBWIcon from "images/heartBW.svg";
import LaughIcon from "images/laugh.svg";
import LaughBWIcon from "images/laughBW.svg";
import LikeIcon from "images/like.svg";
import LikeBWIcon from "images/likeBW.svg";
import SurpriseIcon from "images/surprise.svg";
import SurpriseBWIcon from "images/surpriseBW.svg";
import { useState, useMemo, useCallback } from "react";
import { reactToComment, reactToPost } from "gateways/PostGateway";
import useUser from "hooks/useUser";
import { useLoginPopup } from "hooks/login-popup";
import { MdOutlineAddReaction } from "react-icons/md";

interface ReactionBarProps {
  type: "comment" | "post";
  reactions: string[][];
  postNumber: number;
  commentNumber?: number;
}

enum ReactionType {
  LIKE,
  HEART,
  LAUGH,
  CRY,
  ANGRY,
  SURPRISE,
}

interface Reaction {
  type: ReactionType;
  reactors: string[];
}

const reactionCompare = (a: Reaction, b: Reaction) => {
  if (a.reactors.length === 0 || b.reactors.length === 0) {
    return b.reactors.length - a.reactors.length || a.type - b.type;
  }
  return a.type - b.type;
};

function ReactionBar(props: ReactionBarProps) {
  const { user } = useUser();
  const { openLoginPopup } = useLoginPopup();

  const [reactions, setReactions] = useState<Reaction[]>(
    props.reactions
      .map((list, index) => ({
        type: index,
        reactors: list,
      }))
      .sort(reactionCompare)
  );

  const icons = useMemo(
    () => [
      [LikeIcon, LikeBWIcon],
      [HeartIcon, HeartBWIcon],
      [LaughIcon, LaughBWIcon],
      [CryIcon, CryBWIcon],
      [AngryIcon, AngryBWIcon],
      [SurpriseIcon, SurpriseBWIcon],
    ],
    []
  );

  const [showReactText, setShowReactText] = useState(
    reactions.every((reaction) => reaction.reactors.length === 0)
  );
  const [showZeroIcons, setShowZeroIcons] = useState(false);
  const [hideButtonsTimeout, setHideButtonsTimeout] =
    useState<NodeJS.Timeout>();

  const buttonClick = useCallback(
    (type: ReactionType) => {
      return async () => {
        if (user) {
          const index = reactions.findIndex(
            (reaction) => reaction.type === type
          );
          const includesUser = reactions[index].reactors.includes(user._id);
          if (includesUser) {
            setReactions((prev) =>
              prev.map((reaction) =>
                reaction.type === type
                  ? {
                      ...reaction,
                      reactors: reaction.reactors.filter(
                        (id) => id !== user._id
                      ),
                    }
                  : reaction
              )
            );
          } else {
            setReactions((prev) =>
              prev.map((reaction) =>
                reaction.type === type
                  ? {
                      ...reaction,
                      reactors: [...reaction.reactors, user._id],
                    }
                  : reaction
              )
            );
          }
          if (props.type === "post") {
            await reactToPost(props.postNumber, type + 1, !includesUser);
          } else {
            if (props.commentNumber) {
              await reactToComment(
                props.postNumber,
                props.commentNumber,
                type + 1,
                !includesUser
              );
            }
          }
        }
      };
    },
    [reactions, user, props.postNumber, props.commentNumber, props.type]
  );

  const className =
    props.type === "comment" ? "CommentReactionBar" : "PostReactionBar";

  return (
    <div
      className={styles.ReactionBar + " " + styles[className]}
      onMouseEnter={() => {
        if (!showReactText) {
          setShowZeroIcons(true);
        }
        if (hideButtonsTimeout) clearTimeout(hideButtonsTimeout);
      }}
      onMouseLeave={() => {
        setHideButtonsTimeout(
          setTimeout(() => {
            setShowZeroIcons(false);
            setReactions((prev) => prev.sort(reactionCompare));
            if (reactions.every((reaction) => reaction.reactors.length === 0)) {
              setShowReactText(true);
            }
          }, 250)
        );
      }}
    >
      {showReactText && (
        <MdOutlineAddReaction
          size={props.type === "post" ? "1.15em" : "1em"}
          color="#789"
          style={{ transform: "translateY(0.05em)" }}
          className={styles.IconButton}
          title="Add a reaction"
          onClick={
            user
              ? () => {
                  setShowReactText(false);
                  setShowZeroIcons(true);
                }
              : openLoginPopup
          }
        />
      )}
      {!showReactText &&
        reactions.map(
          (reaction) =>
            (showZeroIcons || reaction.reactors.length > 0) && (
              <ReactionButton
                type={props.type}
                key={reaction.type}
                image={
                  icons[reaction.type][reaction.reactors.length > 0 ? 0 : 1]
                }
                count={reaction.reactors.length}
                handleClick={user ? buttonClick(reaction.type) : openLoginPopup}
                reacted={
                  (user && reaction.reactors.includes(user._id)) ?? false
                }
              ></ReactionButton>
            )
        )}
    </div>
  );
}

export default ReactionBar;
