import { useCallback, useEffect, useState } from "react";
import {
  getModFeedComments,
  getModFeedPosts,
} from "../../gateways/PostGateway";
import IComment from "../../types/IComment";
import IPost from "../../types/IPost";
import IUser from "../../types/IUser";
import Feed from "./Feed";
import ContextThread from "components/post/comments/ContextThread";
import ModeratorSelection from "components/post/moderator/ModeratorSelection";
import Post from "components/post/Post";

interface ModeratorFeedProps {
  user?: IUser;
}

function ModeratorFeed(props: ModeratorFeedProps) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [showModeratorPosts, setShowModeratorPosts] = useState(true);

  const getMorePosts = useCallback(
    async (nextPageNumber: number): Promise<boolean> => {
      const response = await getModFeedPosts(nextPageNumber);
      if (response.success) {
        if (response.payload.length > 0) {
          setPosts((p) => [...p, ...response.payload]);
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
      if (response.success) {
        if (response.payload.length > 0) {
          setComments((c) => [...c, ...response.payload]);
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
        animated={true}
      >
        <ModeratorSelection
          selection={showModeratorPosts}
          toggle={() => setShowModeratorPosts((selection) => !selection)}
        />
        {showModeratorPosts
          ? posts.map((post) => <Post key={post._id} post={post} />)
          : comments.map((comment, index) => (
              <ContextThread
                key={index}
                thread={comment}
                user={props.user}
                delay={`${index * 80}ms`}
                moderatorView={true}
                setFeed={setComments}
              />
            ))}
      </Feed>
    </>
  );
}

export default ModeratorFeed;
