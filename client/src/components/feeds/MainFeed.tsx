import { getPosts } from "gateways/PostGateway";
import Feed from "components/feeds/ReactQueryFeed";
import Post from "components/post/Post";
import { useInfiniteQuery } from "react-query";

function MainFeed() {
  const fetchPosts = ({ pageParam = 1 }) => getPosts(pageParam);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("posts", fetchPosts, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.payload?.length === 0) {
        return undefined;
      }
      return pages.length + 1;
    },
  });

  const posts = data?.pages.map((page) => page.payload).flat();

  return (
    <Feed
      getMore={fetchNextPage}
      status={status}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      animated
    >
      {posts?.map((post) => post && <Post key={post?._id} post={post} />)}
    </Feed>
  );
}

export default MainFeed;
