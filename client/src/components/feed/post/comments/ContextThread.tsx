import IComment from "../../../../types/IComment";
import IUser from "../../../../types/IUser";
import { IThread } from "./CommentSection";
import "./ContextThread.css";
import Thread from "./Thread";
import CommentProfilePicture from "../../../user/CommentProfilePicture";

type ContextThreadProps = {
  user?: IUser;
  thread: IComment;
};

function ContextThread(props: ContextThreadProps) {
  return (
    <div className="ContextThread">
      <div className="ContextThreadHeader">
        <CommentProfilePicture link={props.thread.author?.profilePicture} />
      </div>
      <Thread
        user={props.user}
        collapsed={false}
        comment={props.thread as IThread}
        depth={0}
      ></Thread>
    </div>
  );
}

export default ContextThread;
