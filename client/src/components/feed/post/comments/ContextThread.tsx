import IComment from "../../../../types/IComment";
import IPost from "../../../../types/IPost";
import IUser from "../../../../types/IUser";
import { IThread } from "./CommentSection";
import "./ContextThread.css";
import Thread from "./Thread";
import { getPost } from "../../../../gateways/PostGateway";
import CommentProfilePicture from "../../../user/CommentProfilePicture";

type ContextThreadProps = {
  user?: IUser;
  thread: IThread;
};

function ContextThread(props: ContextThreadProps) {
  const parentPost = getPost(props.thread.postNumber);
  const replyingToPost = props.thread.parentCommentNumber === -1;

  <div className="ContextThread">
    <div className="ContextThreadHeader">{/* <CommentProfilePicture  */}</div>
    <Thread
      user={props.user}
      collapsed={false}
      comment={props.thread}
      depth={0}
    ></Thread>
  </div>;
}

export default ContextThread;
