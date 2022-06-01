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
import { useEffect, useState, useMemo } from "react";
import { reactToComment, reactToPost } from "gateways/PostGateway";
import LoginPopup from "../LoginPopup";
import useUser from "hooks/useUser";

type ReactionBarProps = {
  type: "comment" | "post";
  reactions: string[][];
  postNumber: number;
  commentNumber?: number;
};

function ReactionBar(props: ReactionBarProps) {
  const { user } = useUser();
  const [likeCount, setLikeCount] = useState(
    props.reactions[0] ? props.reactions[0].length : 0
  );
  const [heartCount, setHeartCount] = useState(
    props.reactions[1] ? props.reactions[1].length : 0
  );
  const [laughCount, setLaughCount] = useState(
    props.reactions[2] ? props.reactions[2].length : 0
  );
  const [cryCount, setCryCount] = useState(
    props.reactions[3] ? props.reactions[3].length : 0
  );
  const [angryCount, setAngryCount] = useState(
    props.reactions[4] ? props.reactions[4].length : 0
  );
  const [surpriseCount, setSurpriseCount] = useState(
    props.reactions[5] ? props.reactions[5].length : 0
  );
  const reactionCounts = useMemo(
    () => [
      likeCount,
      heartCount,
      laughCount,
      cryCount,
      angryCount,
      surpriseCount,
    ],
    [likeCount, heartCount, laughCount, cryCount, angryCount, surpriseCount]
  );
  const countUpdaters = useMemo(
    () => [
      setLikeCount,
      setHeartCount,
      setLaughCount,
      setCryCount,
      setAngryCount,
      setSurpriseCount,
    ],
    [
      setLikeCount,
      setHeartCount,
      setLaughCount,
      setCryCount,
      setAngryCount,
      setSurpriseCount,
    ]
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

  const [showZeroIcons, setShowZeroIcons] = useState(false);

  // These arrays are the real-time order and state of the reactions
  const [nonZeroOrder, setNonZeroOrder] = useState<number[]>([]);
  const [zeroOrder, setZeroOrder] = useState<number[]>([]);
  // these arrays are the display order and state of the reactions, that is updated on leave
  const [nonZeroOrderDisplay, setNonZeroOrderDisplay] = useState<number[]>([]);
  const [zeroOrderDisplay, setZeroOrderDisplay] = useState<number[]>([]);

  const [showReactText, setShowReactText] = useState<boolean>(
    reactionCounts.every((count) => count === 0)
  );

  const [hideButtonsTimeout, setHideButtonsTimeout] =
    useState<NodeJS.Timeout>();

  const [users, setUsers] = useState<{ _id: string; name: string }[][]>([
    [],
    [],
    [],
    [],
    [],
    [],
  ]);

  const updateOrderArrays = () => {
    const zero = [];
    const nonZero = [];
    for (let i = 0; i < reactionCounts.length; i++) {
      if (reactionCounts[i] === 0) {
        zero.push(i);
      } else {
        nonZero.push(i);
      }
    }
    return [zero, nonZero];
  };

  const [showPopup, setshowPopup] = useState(false);
  const openPopup = () => {
    setshowPopup(true);
  };

  const closePopup = () => setshowPopup(false);

  // initialize order arrays once
  useEffect(() => {
    const [zero, nonZero] = updateOrderArrays();
    setZeroOrder(zero);
    setNonZeroOrder(nonZero);
    setZeroOrderDisplay(zero);
    setNonZeroOrderDisplay(nonZero);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAll = () => {
    setShowZeroIcons(true);
  };

  // when a user hovers off the reaction bar, the display order is updated and zero-count icons are hidden
  const hideAll = () => {
    setShowZeroIcons(false);
    setNonZeroOrderDisplay(nonZeroOrder);
    setZeroOrderDisplay(zeroOrder);
    setShowReactText(reactionCounts.every((count) => count === 0));
  };

  // update non-display orders when the user clicks on a reaction button
  useEffect(() => {
    const [zero, nonZero] = updateOrderArrays();
    setZeroOrder(zero);
    setNonZeroOrder(nonZero);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reactionCounts]);

  const buttonClick = (reaction: number) => {
    return async () => {
      if (user) {
        const includesUser: boolean = props.reactions[reaction]?.includes(
          user._id
        );
        if (includesUser) {
          props.reactions[reaction] = props.reactions[reaction].filter(
            (id) => id !== user?._id
          );
          const newUsers = [...users];
          newUsers[reaction] = newUsers[reaction].filter(
            (user) => user._id !== user?._id
          );
          setUsers(newUsers);
        } else {
          if (props.reactions[reaction]) {
            props.reactions[reaction] = [
              ...props.reactions[reaction],
              user._id,
            ];
          } else {
            props.reactions[reaction] = [user._id];
          }
          const newUsers = [...users];
          newUsers[reaction] = newUsers[reaction]
            ? [...newUsers[reaction], user]
            : [user];
          setUsers(newUsers);
        }
        countUpdaters[reaction](props.reactions[reaction].length);
        if (props.type === "post") {
          await reactToPost(props.postNumber, reaction + 1, !includesUser);
        } else {
          if (props.commentNumber) {
            await reactToComment(
              props.postNumber,
              props.commentNumber,
              reaction + 1,
              !includesUser
            );
          }
        }
      }
    };
  };

  return (
    <div
      className={styles.ReactionBar}
      onMouseOver={() => {
        if (!showReactText) {
          showAll();
        }
        if (hideButtonsTimeout) clearTimeout(hideButtonsTimeout);
      }}
      onMouseLeave={() => {
        setHideButtonsTimeout(
          setTimeout(() => {
            if (reactionCounts.every((count) => count === 0)) {
              setShowReactText(true);
            }
            hideAll();
          }, 250)
        );
      }}
    >
      <LoginPopup showPopup={showPopup} closePopup={closePopup} />
      {showReactText && (
        <p
          className={styles.ReactText}
          onClick={
            user
              ? () => {
                  setShowReactText(false);
                  showAll();
                }
              : openPopup
          }
        >
          react
        </p>
      )}
      {nonZeroOrderDisplay.map((reaction) => {
        return (
          <ReactionButton
            type={props.type}
            key={reaction}
            images={icons[reaction]}
            count={reactionCounts[reaction]}
            reactionArray={props.reactions[reaction]}
            handleClick={user ? buttonClick(reaction) : openPopup}
          ></ReactionButton>
        );
      })}
      {showZeroIcons &&
        zeroOrderDisplay.map((reaction) => {
          return (
            <ReactionButton
              type={props.type}
              key={reaction + 6}
              images={icons[reaction]}
              count={reactionCounts[reaction]}
              reactionArray={props.reactions[reaction]}
              handleClick={buttonClick(reaction)}
            ></ReactionButton>
          );
        })}
    </div>
  );
}

export default ReactionBar;
