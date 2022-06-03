import styles from "./Thread.module.scss";
import ReactionBar from "components/post/reactions/ReactionBar";
import ThreadCollapser from "./ThreadCollapser";
import { IThread } from "./CommentSection";
import { useState } from "react";
import NewCommentBox from "components/post/comments/new_comment/NewCommentBox";
import CommentButton from "./CommentButton";
import DividerDot from "components/post/content/DividerDot";
import CommentProfilePicture from "components/user/CommentProfilePicture";
import CommentHeader from "components/post/comments/comment_header/CommentHeader";
import LoginPopup from "../LoginPopup";
import UserContent from "components/post/content/UserContent";
import CommentContext from "./CommentContext";
import { useIsMobile } from "hooks/is-mobile";
import useUser from "hooks/useUser";

type ThreadProps = {
  collapsed: boolean;
  comment: IThread;
  depth: number;
  postNumber?: number;
  setComments?: React.Dispatch<React.SetStateAction<IThread[]>>;
  inContext: boolean;
  blurred: boolean;
  setBlurred: React.Dispatch<React.SetStateAction<boolean>>;
  // displayedChildren: number;
};

const colors = ["#99b2c2", "#b5cbde", "#bed3e6", "#c7dbee", "#d9eafd"];

function Thread(props: ThreadProps) {
  const { user } = useUser();
  const [show, setShow] = useState(true);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  const nestedComments = (props.comment.children || []).map((comment) => {
    return (
      <Thread
        key={comment.commentNumber}
        collapsed={false}
        comment={comment}
        depth={props.depth + 1}
        postNumber={props.postNumber}
        setComments={props.setComments}
        inContext={props.inContext}
        blurred={props.blurred}
        setBlurred={props.setBlurred}
      />
    );
  });

  const [showPopup, setshowPopup] = useState(false);
  const openPopup = () => {
    setshowPopup(true);
  };

  const closePopup = () => setshowPopup(false);

  const isMobile = useIsMobile();

  return (
    <div className="Thread" key={props.comment.commentNumber}>
      {isMobile && props.depth > 4 && props.comment.parentComment.content && (
        <div className={styles.ThreadCommentContext}>
          <CommentContext thread={props.comment} />
        </div>
      )}
      <div className={styles.ThreadGrid}>
        <CommentProfilePicture
          link={props.comment.author?.profilePicture ?? ""}
        />
        <LoginPopup showPopup={showPopup} closePopup={closePopup} />
        {show && !props.inContext && (
          <ThreadCollapser
            collapse={toggleShow}
            color={colors[props.depth <= 4 ? props.depth : 4]}
          />
        )}
        <CommentHeader
          comment={props.comment}
          collapsed={!show}
          expand={() => setShow(true)}
          postNumber={props.postNumber}
          inContext={props.inContext}
          setComments={props.setComments}
        />
        {show && (
          <div className={styles.ThreadBody}>
            <div className={styles.CommentBody}>
              <div className="CommentBodyTextAndFooter">
                <UserContent
                  blurred={props.blurred}
                  setBlurred={props.setBlurred}
                >
                  {props.comment.content}
                </UserContent>
                {!props.inContext && (
                  <div className={styles.CommentFooter}>
                    <ReactionBar
                      postNumber={props.comment.postNumber}
                      commentNumber={props.comment.commentNumber}
                      type="comment"
                      reactions={props.comment.reactions}
                    />
                    <DividerDot />
                    <CommentButton
                      type="reply"
                      click={user ? () => setShowReplyBox(true) : openPopup}
                    />
                  </div>
                )}
              </div>
              {showReplyBox && !props.inContext && (
                <NewCommentBox
                  firstComment={false}
                  postNumber={props.comment.postNumber}
                  parentCommentNumber={props.comment.commentNumber}
                  setShow={setShowReplyBox}
                  setComments={props.setComments ?? (() => {})}
                />
              )}
            </div>
            {(!isMobile || props.depth < 4) && nestedComments}
          </div>
        )}
      </div>
      {isMobile && props.depth >= 4 && nestedComments}
    </div>
  );
}

export default Thread;
