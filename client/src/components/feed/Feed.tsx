import Post from "./post/Post";
import "./Feed.css";
import IComment from "../../types/IComment";
import { IThread } from "./post/comments/CommentSection";
import IPost from "../../types/IPost";
import { useState, useEffect } from "react";
import { getPosts } from "../../gateways/PostGateway";
import IUser from "../../types/IUser";

type FeedProps = {
  user: IUser | undefined;
};

function Feed(props: FeedProps) {
  const [pageNumber] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    getPosts(pageNumber).then((response) => {
      if (response.success && response.payload) {
        setPosts((p) => (response.payload ? [...p, ...response.payload] : p));
      } else {
        console.log("error getting posts", response.message);
      }
    });
  }, [pageNumber]);

  const convertToThread = (comment: IComment) => {
    const thread = comment as IThread;
    thread.children = [];
    return thread;
  };

  const convertCommentsToThreads = (comments: IComment[]) => {
    return comments.map(convertToThread);
  };

  return (
    <div className="Feed">
      {posts.map((post) => {
        return (
          <Post
            user={props.user}
            key={post.postNumber}
            postNumber={post.postNumber}
            postBody={post.content}
            postDate={new Date(post.postTime).toLocaleDateString()}
            comments={convertCommentsToThreads(post.comments)}
            reactions={post.reactions}
          />
        );
      })}
    </div>
  );
}

export default Feed;
