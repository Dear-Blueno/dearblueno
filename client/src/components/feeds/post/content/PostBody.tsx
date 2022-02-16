import "./PostBody.css";
import Linkify from "linkify-react";
import "linkify-plugin-ticket";
import { useState } from "react";
import { Link } from "react-router-dom";

interface PostBodyProps {
  body: string;
  showContent: boolean;
}

function PostBody(props: PostBodyProps) {
  const [showContent, setShowContent] = useState(props.showContent);

  return (
    <div className="PostBody">
      <Linkify
        options={{
          attributes: (href: string, type: string) => ({ type }),
          tagName: () => PostLink,
        }}
      >
        <p
          className={
            "PostBodyText " + (!showContent ? "PostBodyTextHidden" : "")
          }
          onClick={() => setShowContent(true)}
          title={showContent ? "" : "Click to reveal"}
        >
          {props.body}
        </p>
      </Linkify>
    </div>
  );
}

interface PostLinkProps {
  href: string;
  type: "ticket" | "email" | "url";
  children: string;
}

function PostLink(props: PostLinkProps) {
  switch (props.type) {
    case "email":
    case "url":
      return <a href={props.href}>{props.children}</a>;
    case "ticket":
      return (
        <Link to={`/post/${props.href.slice(1)}`} className="PostBodyText-ref">
          {props.children}
        </Link>
      );
  }
}

export default PostBody;
