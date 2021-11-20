import "./LikeCommentBar.css";
import CommentReactionButton from "./CommentReactionButton";
import AngryIcon from "../../../../images/angry.svg";
import AngryBWIcon from "../../../../images/angryBW.svg";
import CryIcon from "../../../../images/cry.svg";
import CryBWIcon from "../../../../images/cryBW.svg";
import HeartIcon from "../../../../images/heart.svg";
import HeartBWIcon from "../../../../images/heartBW.svg";
import LaughIcon from "../../../../images/laugh.svg";
import LaughBWIcon from "../../../../images/laughBW.svg";
import LikeIcon from "../../../../images/like.svg";
import LikeBWIcon from "../../../../images/likeBW.svg";
import SurpriseIcon from "../../../../images/surprise.svg";
import SurpriseBWIcon from "../../../../images/surpriseBW.svg";
import { useState } from "react";

type LikeCommentBarProps = {};

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
        className="LikeImage"
        src={LikeBWIcon}
        alt="reaction"
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
      <img
        className="LikeImage"
        src={HeartBWIcon}
        alt="reaction"
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
      <img
        className="LikeImage"
        src={LaughBWIcon}
        alt="reaction"
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
      <img
        className="LikeImage"
        src={CryBWIcon}
        alt="reaction"
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
      <img
        className="LikeImage"
        src={AngryBWIcon}
        alt="reaction"
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
      <img
        className="LikeImage"
        src={SurpriseBWIcon}
        alt="reaction"
        style={showIcons ? { display: "block" } : { display: "none" }}
      ></img>
    </div>
  );
}

export default LikeCommentBar;
