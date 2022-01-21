import { useState } from "react";
import { getPosts } from "../../gateways/PostGateway";
import IPost from "../../types/IPost";
import IUser from "../../types/IUser";
import Feed from "./Feed";
import Post from "./post/Post";

type MainFeedProps = {
  user?: IUser;
};

function MainFeed(props: MainFeedProps) {
  const [posts, setPosts] = useState<IPost[]>([]);

  const getMore = async (nextPageNumber: number): Promise<boolean> => {
    const response = await getPosts(nextPageNumber);
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

export default MainFeed;
