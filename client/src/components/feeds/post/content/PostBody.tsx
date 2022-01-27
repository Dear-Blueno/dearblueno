import "./PostBody.css";
import Linkify from "linkify-react";
import { useState } from "react";

interface PostBodyProps {
  body: string;
  showContent: boolean;
}

function PostBody(props: PostBodyProps) {
  const [showContent, setShowContent] = useState(props.showContent);

  return (
    <div className="PostBody">
      <Linkify>
        <p
          className={"PostBodyText " + (!showContent ? "PostBodyTextHidden" : "")}
          onClick={() => setShowContent(true)}
          title={showContent ? "" : "Click to reveal"}
        >
          {props.body}
        </p>
      </Linkify>
    </div>
  );
}

export default PostBody;
