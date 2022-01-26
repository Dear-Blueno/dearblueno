import "./PostBody.css";
import Linkify from "linkify-react";
import { useState } from "react";

interface PostBodyProps {
  body: string;
  showContent: boolean;
}

function PostBody(props: PostBodyProps) {
  const [showContent, setShowContent] = useState(props.showContent);
  const className = showContent ? "PostBody" : "PostBodyHidden";

  return (
    <div className={className}>
      <div className="ContentContainer">
        {!showContent && (
          <div
            className="Foreground"
            title="Click to show"
            onClick={() => setShowContent(true)}
          />
        )}
        <Linkify>
          <p className={showContent ? "PostBodyText" : "PostBodyTextHidden"}>
            {props.body}
          </p>
        </Linkify>
      </div>
    </div>
  );
}

export default PostBody;
