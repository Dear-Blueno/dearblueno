import "./Post.css";
import PostBody from "./content/PostBody";
import PostDate from "./content/PostDate";
import PostNumber from "./content/PostNumber";
import ReactionBar from "./reactions/ReactionBar";
import DividerDot from "./content/DividerDot";
import CommentButton from "./comments/CommentButton";
import CommentSection, { IThread } from "./comments/CommentSection";
import { useState } from "react";
import IUser from "../../../types/IUser";
import IComment from "../../../types/IComment";
import ApproveOrDeny from "./moderator/ApproveOrDeny";
import { approvePost } from "../../../gateways/PostGateway";
import ShareButton from "./ShareButton";
import IPost from "../../../types/IPost";

export type PostProps = {
  user?: IUser;
  post: IPost;
  delay?: string;
  setFeed?: React.Dispatch<React.SetStateAction<IPost[]>>;
};

const convertToThread = (comment: IComment) => {
  const thread = comment as IThread;
  thread.children = [];
  return thread;
};

function Post(props: PostProps) {
  const [showCommentBox, setShowCommentBox] = useState(false);

  const approveOrDeny = async (bool: boolean) => {
    const response = await approvePost(props.post._id, bool);
    if (response.success && props.setFeed) {
      props.setFeed((posts) => posts.filter((p) => p._id !== props.post._id));
    }
  };

  return (
    <div className="Post" style={{ animationDelay: props.delay ?? "0" }}>
      <PostNumber
        number={props.post.postNumber}
        _id={props.post.needsReview ? props.post._id : undefined}
      />
      <PostDate
        value={
          new Date(
            props.post.needsReview
              ? props.post.postTime
              : props.post.approvedTime
          )
        }
      />
      <PostBody body={props.post.content} />
      {props.post.needsReview ? (
        <ApproveOrDeny
          approve={() => approveOrDeny(true)}
          deny={() => {
            approveOrDeny(false);
          }}
        />
      ) : (
        <div className="PostFooter">
          <ReactionBar
            postNumber={props.post.postNumber ?? 0}
            commentNumber={undefined}
            user={props.user}
            type={"post"}
            reactions={props.post.reactions}
          />
          <DividerDot />
          <CommentButton type="comment" click={() => setShowCommentBox(true)} />
          <DividerDot />
          <ShareButton postNumber={props.post.postNumber} />
        </div>
      )}
      {!props.post.needsReview && (
        <CommentSection
          user={props.user}
          comments={props.post.comments.map(convertToThread)}
          postNumber={props.post.postNumber ?? 0}
          showCommentBox={showCommentBox}
        />
      )}
    </div>
  );
}

export default Post;
