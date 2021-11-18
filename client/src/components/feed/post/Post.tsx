import "./Post.css";
import PostBody from "./PostBody";
import PostDate from "./PostDate";
import PostNumber from "./PostNumber";
import ReactionBar from "./reactions/ReactionBar";
import CommentSection, { Comment } from "./comments/CommentSection";

type PostProps = {
  postNumber: number;
  postBody: string;
  postDate: string;
  comments: Comment[];
  reactions: string[][];
};

function Post(props: PostProps) {
  return (
    <div className="Post">
      <PostNumber value={props.postNumber}></PostNumber>
      <PostDate value={props.postDate}></PostDate>
      <PostBody body={props.postBody}></PostBody>
      <ReactionBar reactions={props.reactions}></ReactionBar>
      <CommentSection
        comments={props.comments}
        postId={props.postNumber}
      ></CommentSection>
    </div>
  );
}

export default Post;
