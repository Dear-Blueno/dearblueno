import { useState, useCallback } from "react";
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
  const [pageNumber, setPageNumber] = useState(1);

  const getMore = useCallback(
    async (nextPageNumber: number): Promise<boolean> => {
      setPageNumber(nextPageNumber);
      const response = await getPosts(nextPageNumber);
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

  return (
    <>
      <Feed user={props.user} getMore={getMore} animated={true}>
        {posts.map((post, index) => (
          <Post
            key={post._id}
            post={post}
            user={props.user}
            delay={(index - 10 * (pageNumber - 1)) * 80 + "ms"}
          />
        ))}
      </Feed>
    </>
  );
}

export default MainFeed;
