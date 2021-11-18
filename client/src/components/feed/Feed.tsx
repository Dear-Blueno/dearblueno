import Post from "./post/Post";
import "./Feed.css";
import { useState } from "react";

function Feed() {
  const [posts, setPosts] = useState([]);

  let data; // result of fetch call to query db for posts

  // assemble comments from post data with empty children array

  // map over posts and return a Post component for each post

  return <div className="Feed">{posts}</div>;
}

export default Feed;
