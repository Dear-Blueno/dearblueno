import IComment from "types/IComment";
import IUser from "types/IUser";
import { IThread } from "./CommentSection";
import "./ContextThread.css";
import Thread from "./Thread";
import CommentProfilePicture from "../../../user/CommentProfilePicture";
import ApproveOrDeny from "../moderator/ApproveOrDeny";
import { approveComment } from "gateways/PostGateway";
import Linkify from "linkify-react";

export type ContextThreadProps = {
  user?: IUser;
  thread: IComment;
  delay?: string;
  moderatorView?: boolean;
  setFeed?: React.Dispatch<React.SetStateAction<IComment[]>>;
};

function ContextThread(props: ContextThreadProps) {
  const isReply = props.thread.parentComment !== undefined;

  return (
    <div
      className="ContextThread"
      style={{ animationDelay: props.delay ?? "0" }}
    >
      <div className="ContextThreadHeader">
        <div className="ContextThreadHorizontalLine"></div>
        <div className="ContextThreadVerticalLine"></div>
        {isReply && (
          <>
            <div className="ContextThreadParentPicture">
              <CommentProfilePicture
                link={props.thread.author?.profilePicture}
              />
            </div>
            <div className="ContextThreadReplyAuthor">
              {props.thread.parentComment.author.name ?? "Anonymous"}
            </div>
            <div className="ContextThreadReplyText">
              <Linkify>{props.thread.parentComment.content}</Linkify>
            </div>
          </>
        )}
        {!isReply && (
          <>
            <div className="ContextThreadPostNumber">
              #{props.thread.postNumber}
            </div>
            <div className="ContextThreadPostContent">
              {props.thread.post.content}
            </div>
          </>
        )}
      </div>
      <Thread
        user={props.user}
        collapsed={false}
        comment={props.thread as IThread}
        depth={0}
        inContext={true}
      ></Thread>
      {props.moderatorView && (
        <div className="ApproveOrDenyContainer">
          <ApproveOrDeny
            approve={async () => {
              const response = await approveComment(
                props.thread.postNumber,
                props.thread.commentNumber,
                true
              );
              if (response.success && props.setFeed) {
                props.setFeed((comments) =>
                  comments.filter((c) => c._id !== props.thread._id)
                );
              }
            }}
            deny={async () => {
              const response = await approveComment(
                props.thread.postNumber,
                props.thread.commentNumber,
                false
              );
              if (response.success && props.setFeed) {
                props.setFeed((comments) =>
                  comments.filter((c) => c._id !== props.thread._id)
                );
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ContextThread;
