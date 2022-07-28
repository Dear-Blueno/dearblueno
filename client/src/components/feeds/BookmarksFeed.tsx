import Feed from "components/feeds/ReactQueryFeed";
import Post from "components/post/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getBookmarks } from "gateways/UserGateway";

export default function BookmarksFeed() {
  const fetchBookmarks = ({ pageParam = 1 }) =>
    getBookmarks(pageParam).then((res) => res.payload ?? []);
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery(["bookmarks"], fetchBookmarks, {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return pages.length + 1;
      },
    });

  const bookmarkedPosts = data?.pages.flat().reverse() ?? [];

  return (
    <Feed
      getMore={fetchNextPage}
      status={status}
      isFetchingNextPage={isFetching}
      hasNextPage={hasNextPage}
      animated
    >
      {bookmarkedPosts.map((post) => (
        <Post key={post._id} post={post} bookmarked />
      ))}
    </Feed>
  );
}
