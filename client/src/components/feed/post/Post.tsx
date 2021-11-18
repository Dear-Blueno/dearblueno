import "./Post.css";
import PostBody from "./PostBody";
import PostDate from "./PostDate";
import PostNumber from "./PostNumber";
<<<<<<< HEAD
import ReactionBar from "./reactions/ReactionBar";
import CommentSection, {
  CommentData,
  CommentSectionProps,
} from "./comments/CommentSection";
=======
import CommentSection, { CommentData } from "./comments/CommentSection";
>>>>>>> 1e11cef039030d116b0c5bfa15ec8992724237d5

const data1: CommentData = {
  author: "Nicholas Vadasz",
  body: "Aenean vestibulum euismod dui a fringilla. Nam eget lorem et augue volutpat viverra a non libero. Present malesuada, tellus vestibulum faucibus fermentum, nisl metus tincidunt ipsum, in interdum diam massa vitae eros.",
  date: "date1",
  depth: 0,
};
const data: CommentData[] = [data1];

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
<<<<<<< HEAD
      <ReactionBar></ReactionBar>
=======
>>>>>>> 1e11cef039030d116b0c5bfa15ec8992724237d5
      <CommentSection data={data}></CommentSection>
    </div>
  );
}

export default Post;
