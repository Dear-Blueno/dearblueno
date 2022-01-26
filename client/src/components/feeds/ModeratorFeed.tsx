import { useCallback, useEffect, useState } from "react";
import {
  getModFeedComments,
  getModFeedPosts,
} from "../../gateways/PostGateway";
import IComment from "../../types/IComment";
import IPost from "../../types/IPost";
import IUser from "../../types/IUser";
import Feed from "./Feed";
import ContextThread from "./post/comments/ContextThread";
import ModeratorSelection from "./post/moderator/ModeratorSelection";
import Post from "./post/Post";

type ModeratorFeedProps = {
  user?: IUser;
};

function ModeratorFeed(props: ModeratorFeedProps) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [showModeratorPosts, setShowModeratorPosts] = useState(true);

  const getMorePosts = useCallback(
    async (nextPageNumber: number): Promise<boolean> => {
      const response = await getModFeedPosts(nextPageNumber);
      if (response.success && response.payload) {
        if (response.payload.length > 0) {
          setPosts((p) => [...p, ...(response.payload as IPost[])]);
          return true;
        }
      } else {
        console.log(response.message);
      }
      return false;
    },
    []
  );

  const getMoreComments = useCallback(
    async (nextPageNumber: number): Promise<boolean> => {
      const response = await getModFeedComments(nextPageNumber);
      if (response.success && response.payload) {
        if (response.payload.length > 0) {
          setComments((c) => [...c, ...(response.payload as IComment[])]);
          return true;
        }
      } else {
        console.log(response.message);
      }
      return false;
    },
    []
  );

  useEffect(() => {
    showModeratorPosts ? setComments([]) : setPosts([]);
  }, [showModeratorPosts]);

  return (
    <>
      <Feed
        user={props.user}
        getMore={showModeratorPosts ? getMorePosts : getMoreComments}
      >
        <ModeratorSelection
          selection={showModeratorPosts}
          toggle={() => setShowModeratorPosts((selection) => !selection)}
        />
        {showModeratorPosts
          ? posts.map((post, index) => (
              <Post
                key={post._id}
                post={post}
                user={props.user}
                delay={index * 80 + "ms"}
                setFeed={setPosts}
              />
            ))
          : comments.map((comment, index) => (
              <ContextThread
                key={index}
                thread={comment}
                user={props.user}
                delay={index * 80 + "ms"}
              />
            ))}
      </Feed>
    </>
  );
}

export default ModeratorFeed;
