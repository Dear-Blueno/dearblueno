import IComment from "types/IComment";
import IUser from "types/IUser";
import { IThread } from "./CommentSection";
import "./ContextThread.css";
import Thread from "./Thread";
import ApproveOrDeny from "../moderator/ApproveOrDeny";
import { approveComment } from "gateways/PostGateway";
import { Link } from "react-router-dom";
import CommentContext from "./CommentContext";

export type ContextThreadProps = {
  user?: IUser;
  thread: IComment;
  delay?: string;
  moderatorView?: boolean;
  setFeed?: React.Dispatch<React.SetStateAction<IComment[]>>;
};

function ContextThread(props: ContextThreadProps) {
  return (
    <Link
      className="ContextThreadLink"
      to={props.moderatorView ? "" : "/post/" + props.thread.postNumber}
    >
      <div
        className="ContextThread"
        style={{ animationDelay: props.delay ?? "0" }}
      >
        <CommentContext thread={props.thread} showProfilePicture />
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
