import "./Post.css";
import PostBody from "./PostBody";
import PostDate from "./PostDate";
import PostNumber from "./PostNumber";
import CommentSection from "./comments/CommentSection";

interface PostProps {
  postNumber: number;
  postBody: string;
  postDate: string;
}

function Post(props: PostProps) {
  return (
    <div className="Post">
      <PostNumber value={props.postNumber}></PostNumber>
      <PostDate value={props.postDate}></PostDate>
      <PostBody body={props.postBody}></PostBody>
      <CommentSection postId={1}></CommentSection>
    </div>
  );
}

export default Post;
