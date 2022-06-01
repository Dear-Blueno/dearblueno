import Feed from "components/feeds/ReactQueryFeed";
import Post from "components/post/Post";
import { useInfiniteQuery } from "react-query";
import { getBookmarks } from "gateways/UserGateway";

function BookmarksFeed() {
  const fetchBookmarks = ({ pageParam = 1 }) => getBookmarks(pageParam);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery("bookmarks", fetchBookmarks, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.payload?.length === 0) {
        return undefined;
      }
      return pages.length + 1;
    },
  });

  const posts = data?.pages
    .map((page) => page.payload)
    .flat()
    .reverse();

  return (
    <Feed
      getMore={fetchNextPage}
      status={status}
      isFetchingNextPage={isFetching}
      hasNextPage={hasNextPage}
      animated
    >
      {posts?.map((post) => post && <Post key={post._id} post={post} />)}
    </Feed>
  );
}

export default BookmarksFeed;
