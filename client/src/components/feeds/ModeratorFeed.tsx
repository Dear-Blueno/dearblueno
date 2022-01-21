import { useState } from "react";
import { getModFeedPosts } from "../../gateways/PostGateway";
import IPost from "../../types/IPost";
import IUser from "../../types/IUser";
import Feed from "./Feed";
import ModeratorSelection from "./post/moderator/ModeratorSelection";
import Post from "./post/Post";

type ModeratorFeedProps = {
  user?: IUser;
};

function ModeratorFeed(props: ModeratorFeedProps) {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [showModeratorPosts, setShowModeratorPosts] = useState(true);

  const getMore = async (nextPageNumber: number): Promise<boolean> => {
    const response = await getModFeedPosts(nextPageNumber);
    if (response.success && response.payload) {
      if (response.payload.length > 0) {
        setPosts([...posts, ...response.payload]);
        return true;
      }
    } else {
      console.log(response.message);
    }
    return false;
  };

  return (
    <Feed user={props.user} getMore={getMore}>
      <ModeratorSelection
        selection={showModeratorPosts}
        toggle={() => setShowModeratorPosts((selection) => !selection)}
      />
      {posts.map((post, index) => (
        <Post
          key={index}
          post={post}
          user={props.user}
          delay={index * 80 + "ms"}
        />
      ))}
    </Feed>
  );
}

export default ModeratorFeed;
