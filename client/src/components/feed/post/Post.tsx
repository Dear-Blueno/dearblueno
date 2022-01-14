import "./Post.css";
import PostBody from "./content/PostBody";
import PostDate from "./content/PostDate";
import PostNumber from "./content/PostNumber";
import ReactionBar from "./reactions/ReactionBar";
import DividerDot from "./content/DividerDot";
import CommentButton from "./CommentButton";
import CommentSection, { IThread } from "./comments/CommentSection";
import { useState } from "react";
import IUser from "../../../types/IUser";
import IComment from "../../../types/IComment";

type PostProps = {
  user: IUser | undefined;
  _id?: string;
  postNumber?: number;
  postBody: string;
  postDate: Date;
  comments: IComment[];
  reactions: string[][];
  needsReview: boolean;
};

const convertToThread = (comment: IComment) => {
  const thread = comment as IThread;
  thread.children = [];
  return thread;
};

function Post(props: PostProps) {
  const [showCommentBox, setShowCommentBox] = useState(false);

  return (
    <div className="Post">
      <PostNumber
        number={props.postNumber}
        _id={props.needsReview ? props._id : undefined}
      />
      <PostDate value={props.postDate} />
      <PostBody body={props.postBody} />
      {props.needsReview ? null : (
        <div className="PostFooter">
          <ReactionBar
            postNumber={props.postNumber ?? 0}
            commentNumber={undefined}
            user={props.user}
            type={"post"}
            reactions={props.reactions}
          />
          <DividerDot />
          <CommentButton type="comment" click={() => setShowCommentBox(true)} />
          <DividerDot />
          <p className="ShareButton">share</p>
        </div>
      )}
      {!props.needsReview && (
        <CommentSection
          user={props.user}
          comments={props.comments.map(convertToThread)}
          postNumber={props.postNumber ?? 0}
          showCommentBox={showCommentBox}
          setShowCommentBox={setShowCommentBox}
        />
      )}
    </div>
  );
}

export default Post;
