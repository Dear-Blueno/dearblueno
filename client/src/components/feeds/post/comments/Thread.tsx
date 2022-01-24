import "./Thread.css";
import ReactionBar from "../reactions/ReactionBar";
import ThreadCollapser from "./ThreadCollapser";
import { IThread } from "./CommentSection";
import { useState } from "react";
import NewCommentBox from "./new_comment/NewCommentBox";
import CommentButton from "./CommentButton";
import DividerDot from "../content/DividerDot";
import CommentProfilePicture from "../../../user/CommentProfilePicture";
import CommentHeader from "./comment_header/CommentHeader";
import IUser from "../../../../types/IUser";

type ThreadProps = {
  user?: IUser;
  collapsed: boolean;
  comment: IThread;
  depth: number;
  postNumber?: number;
  // displayedChildren: number;
};

const colors = ["#99b2c2", "#b5cbde", "#bed3e6", "#c7dbee", "#d9eafd"];

function Thread(props: ThreadProps) {
  const [show, setShow] = useState(true);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  const nestedComments = (props.comment.children || []).map((comment) => {
    return (
      <Thread
        user={props.user}
        key={comment.commentNumber}
        collapsed={false}
        comment={comment}
        depth={props.depth + 1}
        postNumber={props.postNumber}
      />
    );
  });

  return (
    <div className="Thread" key={props.comment.commentNumber}>
      <div className="ThreadGrid">
        <CommentProfilePicture
          link={props.comment.author?.profilePicture ?? ""}
        />
        {show && (
          <ThreadCollapser
            collapse={toggleShow}
            color={colors[props.depth <= 4 ? props.depth : 4]}
          />
        )}
        <CommentHeader
          user={props.user}
          comment={props.comment}
          collapsed={!show}
          expand={() => setShow(true)}
          postNumber={props.postNumber}
        />
        {show && (
          <div className="ThreadBody">
            <div className="CommentBody">
              <div className="CommentBodyTextAndFooter">
                <p className="CommentBodyText">{props.comment.content}</p>
                <div className="CommentFooter">
                  <ReactionBar
                    postNumber={props.comment.postNumber}
                    commentNumber={props.comment.commentNumber}
                    user={props.user}
                    type="comment"
                    reactions={props.comment.reactions}
                  />
                  <DividerDot />
                  <CommentButton
                    type="reply"
                    click={() => setShowReplyBox(true)}
                  />
                </div>
              </div>
              {showReplyBox && (
                <NewCommentBox
                  user={props.user}
                  firstComment={false}
                  postNumber={props.comment.postNumber}
                  parentCommentNumber={props.comment.commentNumber}
                  setShow={setShowReplyBox}
                />
              )}
            </div>
            {nestedComments}
          </div>
        )}
      </div>
    </div>
  );
}

export default Thread;
