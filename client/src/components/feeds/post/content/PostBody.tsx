import "./PostBody.css";
import Linkify from "linkify-react";

interface PostBodyProps {
  body: string;
}

function PostBody(props: PostBodyProps) {
  return (
    <div className="PostBody">
      <Linkify tagName="p">{props.body}</Linkify>
    </div>
  );
}

export default PostBody;
