import "./Thread.css";
import ReactionBar from "../reactions/ReactionBar";
import ThreadCollapser from "./ThreadCollapser";
import { IThread } from "./CommentSection";
import { useEffect, useState } from "react";
import NewCommentBox from "./NewCommentBox";
import CommentButton from "../CommentButton";
import DividerDot from "../DividerDot";
import ProfilePicture from "../../../user/ProfilePicture";
import CommentHeader from "./comment_header/CommentHeader";

type ThreadProps = {
  collapsed: boolean;
  comment: IThread;
};

function Thread(props: ThreadProps) {
  const [show, setShow] = useState(true);
  const [reactions] = useState<string[][]>(props.comment.reactions);
  const [commentAreaActive, setCommentAreaActive] = useState<boolean>(false);

  const toggleShow = () => {
    setShow(!show);
  };

  useEffect(() => {}, [reactions]);

  const nestedComments = (props.comment.children || []).map((comment) => {
    return (
      <Thread key={comment.commentNumber} collapsed={false} comment={comment} />
    );
  });

  const className =
    props.comment.parentCommentNumber < 0 ? "Thread TopLevelThread" : "Thread";

  return (
    <div className={className} key={props.comment.commentNumber}>
      <div className="ThreadGrid">
        <ProfilePicture link={props.comment.author.profilePicture} />
        {show && <ThreadCollapser collapse={toggleShow} />}
        <CommentHeader
          comment={props.comment}
          collapsed={!show}
          expand={() => setShow(true)}
        />
        {show && (
          <div className="Comment">
            <p className="CommentBody">{props.comment.content}</p>
            <div className="CommentFooter">
              {show && (
                <ReactionBar
                  type="comment"
                  reactions={props.comment.reactions}
                />
              )}
              <DividerDot />
              {show && <CommentButton type="reply" click={() => {}} />}
            </div>
            {nestedComments}
          </div>
        )}
      </div>
      <NewCommentBox
        parentCommentNumber={props.comment.commentNumber}
        active={commentAreaActive}
        setActive={setCommentAreaActive}
        show={false}
      />
    </div>
  );
}

export default Thread;
