import "./Post.css";
import PostBody from "./PostBody";
import PostNumber from "./PostNumber";

interface PostProps {
  postNumber: number;
  postBody: string;
}

function Post(props : PostProps) {
    return (
      <div className="Post">
          <PostNumber value={props.postNumber}></PostNumber>
          <PostBody body={props.postBody}></PostBody>
      </div>
    );
  }
  
  export default Post;