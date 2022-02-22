import IComment from "types/IComment";
import IUser from "types/IUser";
import { IThread } from "./CommentSection";
import "./ContextThread.css";
import Thread from "./Thread";
import CommentProfilePicture from "../../../user/CommentProfilePicture";
import ApproveOrDeny from "../moderator/ApproveOrDeny";
import { approveComment } from "gateways/PostGateway";
import { Link } from "react-router-dom";
import UserContent from "../../UserContent";

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
    <Link
      className="ContextThreadLink"
      to={props.moderatorView ? "" : "/post/" + props.thread.postNumber}
    >
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
                  link={
                    props.thread.parentComment.author
                      ? props.thread.parentComment.author.profilePicture
                      : undefined
                  }
                />
              </div>
              <div className="ContextThreadReplyAuthor">
                {props.thread.parentComment.author
                  ? props.thread.parentComment.author.name
                  : "Anonymous"}
              </div>
              <div className="ContextThreadReplyText">
                <UserContent showContent={true}>
                  {props.thread.parentComment.content.substring(0, 10)}
                  {props.thread.parentComment.content.length > 10 ? "…" : ""}
                </UserContent>
              </div>
            </>
          )}
          {!isReply && (
            <>
              <div className="ContextThreadPostNumber">
                #{props.thread.postNumber}
              </div>
              <div className="ContextThreadPostContent">
                {(props.thread.post.content as string).substring(0, 70)}
                {(props.thread.post.content as string).length > 70 ? "…" : ""}
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
          contentWarning={props.thread.post.contentWarning}
        ></Thread>
        {props.moderatorView && (
          <div className="ContextThreadModeratorLinkContainer">
            <Link
              className="ContextThreadModeratorLink"
              to={"/post/" + props.thread.postNumber}
            >
              Show full context
            </Link>
          </div>
        )}
        {props.moderatorView && (
          <div className="ApproveOrDenyContainer">
            <ApproveOrDeny
              type="comment"
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
    </Link>
  );
}

export default ContextThread;
