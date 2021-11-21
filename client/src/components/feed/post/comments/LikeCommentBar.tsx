import "./LikeCommentBar.css";
import AngryBWIcon from "../../../../images/angryBW.svg";
import CryBWIcon from "../../../../images/cryBW.svg";
import HeartBWIcon from "../../../../images/heartBW.svg";
import LaughBWIcon from "../../../../images/laughBW.svg";
import LikeBWIcon from "../../../../images/likeBW.svg";
import SurpriseBWIcon from "../../../../images/surpriseBW.svg";
import { useState } from "react";

type LikeCommentBarProps = {
  updateReactions: (index: number) => void;
};

function LikeCommentBar(props: LikeCommentBarProps) {
  const [showIcons, setShowIcons] = useState(false);

  const showAll = () => {
    setShowIcons(true);
  };

  const hideAll = () => {
    setShowIcons(false);
  };

  return (
    <div
      className="LikeCommentBar"
      onMouseOver={showAll}
      onMouseLeave={hideAll}
    >
      <p className="LikeText">like</p>
      <img
        className="LikeCommentImage"
        src={LikeBWIcon}
        alt="reaction"
        onClick={() => props.updateReactions(0)}
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
      <img
        className="LikeCommentImage"
        src={HeartBWIcon}
        alt="reaction"
        onClick={() => props.updateReactions(1)}
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
      <img
        className="LikeCommentImage"
        src={LaughBWIcon}
        alt="reaction"
        onClick={() => props.updateReactions(2)}
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
      <img
        className="LikeCommentImage"
        src={CryBWIcon}
        alt="reaction"
        onClick={() => props.updateReactions(3)}
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
      <img
        className="LikeCommentImage"
        src={AngryBWIcon}
        alt="reaction"
        onClick={() => props.updateReactions(4)}
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
      <img
        className="LikeCommentImage"
        src={SurpriseBWIcon}
        alt="reaction"
        onClick={() => props.updateReactions(5)}
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
    </div>
  );
}

export default LikeCommentBar;
