import Post from "./post/Post";
import "./Feed.css";
import IComment from "../../types/IComment";
import { IThread } from "./post/comments/CommentSection";
import IPost from "../../types/IPost";
import { useState, useEffect, createContext } from "react";
import { getPosts } from "../../gateways/PostGateway";
import IUser from "../../types/IUser";

type FeedProps = {
  user?: IUser;
  loading: boolean;
  moderatorView: boolean;
};

type FeedContextType = {
  user?: IUser;
  refreshPosts: () => void;
};
export const FeedContext = createContext<FeedContextType>({
  refreshPosts: () => {},
});

function Feed(props: FeedProps) {
  const [moderatorView, setModeratorView] = useState(props.moderatorView);
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

  const refreshPosts = async () => {
    console.log("refreshing posts");
    const response = await getPosts(pageNumber);
    if (response.success && response.payload) {
      setPosts(response.payload);
    } else {
      console.log(response.message);
    }
  };

  const initialContext: FeedContextType = {
    user: props.user,
    refreshPosts: refreshPosts,
  };

  return (
    <FeedContext.Provider value={initialContext}>
      <div className="Feed">
        {props.moderatorView
          ? null
          : posts.map((post) => {
              return (
                <Post
                  user={props.user}
                  key={post.postNumber}
                  postNumber={post.postNumber}
                  postBody={post.content}
                  postDate={new Date(post.postTime)}
                  comments={convertCommentsToThreads(post.comments)}
                  reactions={post.reactions}
                />
              );
            })}
      </div>
    </FeedContext.Provider>
  );
}

export default Feed;
