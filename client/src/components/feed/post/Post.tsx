import "./Post.css";
import PostBody from "./PostBody";
import PostDate from "./PostDate";
import PostNumber from "./PostNumber";
import ReactionBar from "./reactions/ReactionBar";
import DividerDot from "./DividerDot";
import CommentButton from "./CommentButton";
import CommentSection, { IThread } from "./comments/CommentSection";

type PostProps = {
  postNumber: number;
  postBody: string;
  postDate: string;
  comments: IThread[];
  reactions: string[][];
};

function Post(props: PostProps) {
  return (
    <div className="Post">
      <PostNumber value={props.postNumber}></PostNumber>
      <PostDate value={props.postDate}></PostDate>
      <PostBody body={props.postBody}></PostBody>
      <div className="PostFooter">
        <ReactionBar type={"post"} reactions={props.reactions}></ReactionBar>
        <DividerDot />
        <CommentButton type="comment" click={() => {}} />
      </div>
      <CommentSection comments={props.comments} postNumber={props.postNumber} />
    </div>
  );
}

export default Post;
