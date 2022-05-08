import { useState } from "react";
import { Link } from "react-router-dom";
import Linkify from "linkify-react";
import "linkify-plugin-ticket";

import "./UserContent.css";
import makeEmojiRegex from "emoji-regex";
const emojiRegex = makeEmojiRegex();

interface UserContentProps {
  children: string;
  showContent: boolean;
}

function replaceEmoji(text: string): React.ReactChild[] {
  const matches = text.matchAll(emojiRegex);

  const children: React.ReactChild[] = [];
  let lastIndex = 0;
  for (const match of matches) {
    const emoji = match[0];
    const index = match.index!;
    if (index > lastIndex) {
      children.push(text.slice(lastIndex, index));
    }
    children.push(
      <span className="UserContentEmoji" key={index}>
        {emoji}
      </span>
    );
    lastIndex = index + emoji.length;
  }
  if (lastIndex < text.length) {
    children.push(text.slice(lastIndex));
  }
  return children;
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
        {replaceEmoji(props.children)}
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
