import { getPosts } from "gateways/PostGateway";
import Feed from "components/feeds/ReactQueryFeed";
import Post from "components/post/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import IPost from "types/IPost";

interface MainFeedProps {
  initialPosts: IPost[];
}

function MainFeed(props: MainFeedProps) {
  // const [posts, setPosts] = useState<IPost[]>(props.initialPosts);
  const fetchPosts = ({ pageParam = 1 }) =>
    getPosts(pageParam).then((res) => res.payload ?? []);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery(["posts"], fetchPosts, {
      initialData: { pages: [props.initialPosts], pageParams: [1] },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return pages.length + 1;
      },
    });

  // useEffect(() => {
  //   setPosts((prev) =>
  //     prev.concat(data?.pages[data.pages.length - 1].payload ?? [])
  //   );
  // }, [data?.pages]);

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
