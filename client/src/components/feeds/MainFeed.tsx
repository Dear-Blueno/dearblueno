import { getPosts } from "gateways/PostGateway";
import Feed from "components/feeds/ReactQueryFeed";
import Post from "components/post/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import IPost from "types/IPost";
import { parseSortQueryParams } from "components/header/mainfeed/MainFeedHeader";
import { useRouter } from "next/router";
interface MainFeedProps {
  initialPosts: IPost[];
}

function MainFeed(props: MainFeedProps) {
  const router = useRouter();
  const sort = parseSortQueryParams(router.query.sort, router.query.of);
  const fetchPosts = ({ pageParam = 1 }) =>
    getPosts(pageParam, sort).then((res) => res.payload ?? []);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(["posts" + sort], fetchPosts, {
      initialData:
        sort === "hot"
          ? { pages: [props.initialPosts], pageParams: [1] }
          : undefined,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return pages.length + 1;
      },
    });

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
