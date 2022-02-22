import { useState } from "react";
import { Link } from "react-router-dom";
import Linkify from "linkify-react";
import "linkify-plugin-ticket";

import "./UserContent.css";

interface UserContentProps {
  children: React.ReactNode;
  showContent: boolean;
}

function UserContent(props: UserContentProps) {
  const [showContent, setShowContent] = useState(props.showContent);

  return (
    <Linkify
      options={{
        attributes: (_href: string, type: string) => ({ type }),
        tagName: () => ContentLink,
      }}
    >
      <p
        className={"UserContent " + (!showContent ? "UserContentHidden" : "")}
        onClick={() => setShowContent(true)}
        title={showContent ? "" : "Click to reveal"}
      >
        {props.children}
      </p>
    </Linkify>
  );
}

export default UserContent;

interface ContentLinkProps {
  href: string;
  type: "ticket" | "email" | "url";
  children: string;
}

function ContentLink(props: ContentLinkProps) {
  switch (props.type) {
    case "email":
    case "url":
      return <a href={props.href}>{props.children}</a>;
    case "ticket":
      return (
        <Link to={`/post/${props.href.slice(1)}`} className="PostRef">
          {props.children}
        </Link>
      );
  }
}
