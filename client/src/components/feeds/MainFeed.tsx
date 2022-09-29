import { getPosts } from "gateways/PostGateway";
import Feed from "components/feeds/ReactQueryFeed";
import Post from "components/post/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { parseSortQueryParamsOnly } from "components/header/mainfeed/MainFeedHeader";
import { useRouter } from "next/router";
import useUser from "hooks/useUser";

function MainFeed() {
  const { user } = useUser();
  const router = useRouter();
  const sort = parseSortQueryParamsOnly(router.query.sort, router.query.of);
  const fetchPosts = ({ pageParam = 1 }) =>
    getPosts(pageParam, sort).then((res) => res.payload ?? []);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(
      [
        "posts",
        sort === (user?.settings.homeFeedSort ?? "hot") ? "default" : sort,
      ],
      fetchPosts,
      {
        getNextPageParam: (lastPage, pages) => {
          if (lastPage.length === 0) {
            return undefined;
          }
          return pages.length + 1;
        },
      }
    );

  return (
    <Feed
      getMore={fetchNextPage}
      status={status}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      animated
    >
      {data?.pages.map((page) =>
        page.map((post) => <Post key={post._id} post={post} />)
      )}
    </Feed>
  );
}

export default MainFeed;
