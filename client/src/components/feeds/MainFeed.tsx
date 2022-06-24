import { getPosts } from "gateways/PostGateway";
import Feed from "components/feeds/ReactQueryFeed";
import Post from "components/post/Post";
import { useInfiniteQuery } from "react-query";
import IPost from "types/IPost";
import { useEffect, useState } from "react";

type MainFeedProps = {
  initialPosts: IPost[];
};

function MainFeed(props: MainFeedProps) {
  const [pageNumber, setPageNumber] = useState(2);
  const [posts, setPosts] = useState<IPost[]>(props.initialPosts);
  const fetchPosts = ({ pageParam = 2 }) => getPosts(pageParam);
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
      return pages.length + 2;
    },
  });

  useEffect(() => {
    setPosts((prev) =>
      prev.concat(
        data?.pages[data.pages.length - 1].payload?.filter(
          (post) => post !== null
        ) ?? []
      )
    );
  }, [data?.pages]);

  return (
    <Feed
      getMore={fetchNextPage}
      status={status}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      animated
    >
      {posts.map((post) => post && <Post key={post._id} post={post} />)}
    </Feed>
  );
}

export default MainFeed;
