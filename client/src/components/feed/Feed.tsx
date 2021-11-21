import Post from "./post/Post";
import "./Feed.css";
import IComment from "../../types/IComment";
import { IThread } from "./post/comments/CommentSection";
import IPost from "../../types/IPost";
import { useState, useEffect } from "react";
import { getPosts } from "../../gateways/PostGateway";

function Feed() {
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

  const comments: IComment[] = [];
  const comment1: IComment = {
    post: 1,
    postNumber: 1,
    approved: true,
    commentNumber: 1,
    parentCommentNumber: -1,
    author: "Dylan Hu",
    content: "This is a comment",
    commentTime: new Date("2020-01-01"),
    reactions: [[], [], [], [], [], []],
  };
  comments.push(comment1);
  console.log(comments);

  return (
    <div className="Feed">
      {/* {posts.map((post) => {
        return (
          <Post
            key={post.postNumber}
            postNumber={post.postNumber}
            postBody={post.content}
            postDate={new Date(post.postTime).toLocaleDateString()}
            comments={convertCommentsToThreads(post.comments)}
            reactions={post.reactions}
          />
        );
      })} */}
      <Post
        postNumber={1}
        postBody="This is a post"
        postDate={new Date().toLocaleDateString()}
        comments={convertCommentsToThreads(comments)}
        reactions={[]}
      />
    </div>
  );
}

export default Feed;
