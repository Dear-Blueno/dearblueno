import "./Thread.css";
import ReactionBar from "components/feeds/post/reactions/ReactionBar";
import ThreadCollapser from "./ThreadCollapser";
import { IThread } from "./CommentSection";
import { useState } from "react";
import NewCommentBox from "components/feeds/post/comments/new_comment/NewCommentBox";
import CommentButton from "./CommentButton";
import DividerDot from "components/feeds/post/content/DividerDot";
import CommentProfilePicture from "components/user/CommentProfilePicture";
import CommentHeader from "components/feeds/post/comments/comment_header/CommentHeader";
import IUser from "types/IUser";
import Linkify from "linkify-react";

type ThreadProps = {
  user?: IUser;
  collapsed: boolean;
  comment: IThread;
  depth: number;
  postNumber?: number;
  setComments?: React.Dispatch<React.SetStateAction<IThread[]>>;
  inContext: boolean;
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
        setComments={props.setComments}
        inContext={props.inContext}
      />
    );
  });

  return (
    <div className="Thread" key={props.comment.commentNumber}>
      <div className="ThreadGrid">
        <CommentProfilePicture
          link={props.comment.author?.profilePicture ?? ""}
        />
        {show && !props.inContext && (
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
          inContext={props.inContext}
        />
        {show && (
          <div className="ThreadBody">
            <div className="CommentBody">
              <div className="CommentBodyTextAndFooter">
                <Linkify>
                  <p className="CommentBodyText">{props.comment.content}</p>
                </Linkify>
                {!props.inContext && (
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
                )}
              </div>
              {showReplyBox && !props.inContext && (
                <NewCommentBox
                  user={props.user}
                  firstComment={false}
                  postNumber={props.comment.postNumber}
                  parentCommentNumber={props.comment.commentNumber}
                  setShow={setShowReplyBox}
                  setComments={props.setComments ?? (() => {})}
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
