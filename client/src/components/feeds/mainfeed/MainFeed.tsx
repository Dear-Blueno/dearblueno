import { getPosts } from "gateways/PostGateway";
import IUser from "types/IUser";
import Feed from "components/feeds/ReactQueryFeed";
import Post from "components/feeds/post/Post";
import { useInfiniteQuery } from "react-query";

type MainFeedProps = {
  user?: IUser;
};

function MainFeed(props: MainFeedProps) {
  const fetchPosts = ({ pageParam = 1 }) => getPosts(pageParam);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("projects", fetchPosts, {
    getNextPageParam: (lastPage, pages) => pages.length + 1,
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error: could not fetch posts </div>;
  }

  const posts = data?.pages.map((page) => page.payload).flat();

  return (
    <Feed user={props.user} getMore={fetchNextPage} animated>
      {posts?.map(
        (post) => post && <Post key={post?._id} post={post} user={props.user} />
      )}
    </Feed>
  );
}

export default MainFeed;
