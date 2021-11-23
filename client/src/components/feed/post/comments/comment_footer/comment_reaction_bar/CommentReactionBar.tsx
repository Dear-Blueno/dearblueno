import "./CommentReactionBar.css";
import CommentReactionButton from "./CommentReactionButton";
import AngryIcon from "../../../../../../images/angry.svg";
import AngryBWIcon from "../../../../../../images/angryBW.svg";
import CryIcon from "../../../../../../images/cry.svg";
import CryBWIcon from "../../../../../../images/cryBW.svg";
import HeartIcon from "../../../../../../images/heart.svg";
import HeartBWIcon from "../../../../../../images/heartBW.svg";
import LaughIcon from "../../../../../../images/laugh.svg";
import LaughBWIcon from "../../../../../../images/laughBW.svg";
import LikeIcon from "../../../../../../images/like.svg";
import LikeBWIcon from "../../../../../../images/likeBW.svg";
import SurpriseIcon from "../../../../../../images/surprise.svg";
import SurpriseBWIcon from "../../../../../../images/surpriseBW.svg";
import { useState } from "react";

type CommentReactionBarProps = {
  reactions: string[][];
};

function CommentReactionBar(props: CommentReactionBarProps) {
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
  const [showIcons, setShowIcons] = useState(false);
  const [nonZeroOrder, setNonZeroOrder] = useState([NaN]); // NaN is a placeholder for the first reaction
  const [zeroOrder, setZeroOrder] = useState([0, 1, 2, 3, 4, 5]); // These arrays are the real-time order and state of the reactions

  const [nonZeroOrderDisplay, setNonZeroOrderDisplay] = useState([NaN]); // NaN is a placeholder for the first reaction
  const [zeroOrderDisplay, setZeroOrderDisplay] = useState([0, 1, 2, 3, 4, 5]); // these arrays are the display order and state of the reactions, that is updated on leave
  const [showReactText, setShowReactText] = useState<boolean>(
    likeCount +
      heartCount +
      laughCount +
      cryCount +
      angryCount +
      surpriseCount ===
      0
  );

  const buttons = [];

  const showAll = () => {
    setShowIcons(true);
  };

  const hideAll = () => {
    setShowIcons(false);
    setNonZeroOrderDisplay(nonZeroOrder);
    setZeroOrderDisplay(zeroOrder);
  };

  if (likeCount > 0 && !nonZeroOrder.includes(0)) {
    setNonZeroOrder([...nonZeroOrder, 0]);
    setZeroOrder(zeroOrder.filter((x) => x !== 0));
  }
  if (heartCount > 0 && !nonZeroOrder.includes(1)) {
    setNonZeroOrder([...nonZeroOrder, 1]);
    setZeroOrder(zeroOrder.filter((x) => x !== 1));
  }
  if (laughCount > 0 && !nonZeroOrder.includes(2)) {
    setNonZeroOrder([...nonZeroOrder, 2]);
    setZeroOrder(zeroOrder.filter((x) => x !== 2));
  }
  if (cryCount > 0 && !nonZeroOrder.includes(3)) {
    setNonZeroOrder([...nonZeroOrder, 3]);
    setZeroOrder(zeroOrder.filter((x) => x !== 3));
  }
  if (angryCount > 0 && !nonZeroOrder.includes(4)) {
    setNonZeroOrder([...nonZeroOrder, 4]);
    setZeroOrder(zeroOrder.filter((x) => x !== 4));
  }
  if (surpriseCount > 0 && !nonZeroOrder.includes(5)) {
    setNonZeroOrder([...nonZeroOrder, 5]);
    setZeroOrder(zeroOrder.filter((x) => x !== 5));
  }

  nonZeroOrder.sort((a, b) => a - b); // Sorts the non-display nonZeroOrder so that when the reactions are updated, the order is like this: [0, 1, 2, 3, 4, 5]

  for (let i = 0; i < nonZeroOrderDisplay.length; i++) {
    if (nonZeroOrderDisplay[i] === 0) {
      buttons.push(
        <CommentReactionButton
          key={i}
          image={!likeCount ? LikeBWIcon : LikeIcon}
          count={likeCount}
          showIcons={true}
          countSetter={setLikeCount}
        ></CommentReactionButton>
      );
    } else if (nonZeroOrderDisplay[i] === 1) {
      buttons.push(
        <CommentReactionButton
          key={i}
          image={!heartCount ? HeartBWIcon : HeartIcon}
          count={heartCount}
          showIcons={showIcons}
          countSetter={setHeartCount}
        ></CommentReactionButton>
      );
    } else if (nonZeroOrderDisplay[i] === 2) {
      buttons.push(
        <CommentReactionButton
          key={i}
          image={!laughCount ? LaughBWIcon : LaughIcon}
          count={laughCount}
          showIcons={showIcons}
          countSetter={setLaughCount}
        ></CommentReactionButton>
      );
    } else if (nonZeroOrderDisplay[i] === 3) {
      buttons.push(
        <CommentReactionButton
          key={i}
          image={!cryCount ? CryBWIcon : CryIcon}
          count={cryCount}
          showIcons={showIcons}
          countSetter={setCryCount}
        ></CommentReactionButton>
      );
    } else if (nonZeroOrderDisplay[i] === 4) {
      buttons.push(
        <CommentReactionButton
          key={i}
          image={!angryCount ? AngryBWIcon : AngryIcon}
          count={angryCount}
          showIcons={showIcons}
          countSetter={setAngryCount}
        ></CommentReactionButton>
      );
    } else if (nonZeroOrderDisplay[i] === 5) {
      buttons.push(
        <CommentReactionButton
          key={i}
          image={!surpriseCount ? SurpriseBWIcon : SurpriseIcon}
          count={surpriseCount}
          showIcons={showIcons}
          countSetter={setSurpriseCount}
        ></CommentReactionButton>
      );
    }
  }

  for (let i = 0; i < zeroOrderDisplay.length; i++) {
    if (zeroOrderDisplay[i] === 0) {
      buttons.push(
        <CommentReactionButton
          key={i + 6}
          image={!likeCount ? LikeBWIcon : LikeIcon}
          count={likeCount}
          showIcons={showIcons}
          countSetter={setLikeCount}
        ></CommentReactionButton>
      );
    } else if (zeroOrderDisplay[i] === 1) {
      buttons.push(
        <CommentReactionButton
          key={i + 6}
          image={!heartCount ? HeartBWIcon : HeartIcon}
          count={heartCount}
          showIcons={showIcons}
          countSetter={setHeartCount}
        ></CommentReactionButton>
      );
    } else if (zeroOrderDisplay[i] === 2) {
      buttons.push(
        <CommentReactionButton
          key={i + 6}
          image={!laughCount ? LaughBWIcon : LaughIcon}
          count={laughCount}
          showIcons={showIcons}
          countSetter={setLaughCount}
        ></CommentReactionButton>
      );
    } else if (zeroOrderDisplay[i] === 3) {
      buttons.push(
        <CommentReactionButton
          key={i + 6}
          image={!cryCount ? CryBWIcon : CryIcon}
          count={cryCount}
          showIcons={showIcons}
          countSetter={setCryCount}
        ></CommentReactionButton>
      );
    } else if (zeroOrderDisplay[i] === 4) {
      buttons.push(
        <CommentReactionButton
          key={i + 6}
          image={!angryCount ? AngryBWIcon : AngryIcon}
          count={angryCount}
          showIcons={showIcons}
          countSetter={setAngryCount}
        ></CommentReactionButton>
      );
    } else if (zeroOrderDisplay[i] === 5) {
      buttons.push(
        <CommentReactionButton
          key={i + 6}
          image={!surpriseCount ? SurpriseBWIcon : SurpriseIcon}
          count={surpriseCount}
          showIcons={showIcons}
          countSetter={setSurpriseCount}
        ></CommentReactionButton>
      );
    }
  }

  return (
    <div
      className="CommentReactionBar"
      onMouseOver={() => {
        console.log(showReactText);
        if (!showReactText) {
          showAll();
        }
      }}
      onMouseLeave={() => {
        if (
          likeCount +
            heartCount +
            laughCount +
            cryCount +
            angryCount +
            surpriseCount ===
          0
        ) {
          setShowReactText(true);
        }
        hideAll();
      }}
    >
      {showReactText && (
        <p
          className="LikeText"
          onClick={() => {
            setShowReactText(false);
            showAll();
          }}
        >
          react
        </p>
      )}
      {buttons}
    </div>
  );
}

export default CommentReactionBar;
