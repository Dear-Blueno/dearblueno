import "./Feed.css";
import React, { useState, useEffect, useCallback, createContext } from "react";
import IUser from "../../types/IUser";

type FeedProps = {
  user?: IUser;
  children: React.ReactNode[];
  getMore: (nextPageNumber: number) => Promise<boolean>;
};

type FeedContextType = {
  user?: IUser;
  refreshPosts: () => void;
  refreshPost: (postId: number) => void;
};
export const FeedContext = createContext<FeedContextType>({
  refreshPosts: () => {},
  refreshPost: () => {},
});

function Feed(props: FeedProps) {
  const [pageNumber, setPageNumber] = useState(1);

  // scroll action
  const onScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPageNumber((n) => n + 1);
      window.removeEventListener("scroll", onScroll);
    }
  }, []);

  useEffect(() => {
    console.log(pageNumber);
    const loadMore = async () => {
      const response = await props.getMore(pageNumber);
      if (response) {
        window.addEventListener("scroll", onScroll);
      }
    };
    loadMore();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, onScroll]);

  // const refreshPosts = useCallback(async () => {
  //   const gateway = props.moderatorView ? getModFeedPosts : getPosts;
  //   let newPosts: IPost[] = [];
  //   for (let i = 0; i < pageNumber; i++) {
  //     const response = await gateway(i + 1);
  //     if (response.success && response.payload) {
  //       const responsePosts = response.payload;
  //       newPosts = [...newPosts, ...responsePosts];
  //     } else {
  //       console.log("error getting posts", response.message);
  //     }
  //   }
  //   props.moderatorView ? setModeratorPosts(newPosts) : setPosts(newPosts);
  //   props.moderatorView
  //     ? setModeratorDisplayedPosts(newPosts)
  //     : setDisplayedPosts(newPosts);
  //   setDisplayedPostIndex(newPosts.length);
  // }, [props.moderatorView, pageNumber]);

  // const refreshPost = useCallback(
  //   async (postNumber: number) => {
  //     const response = await getPost(postNumber);
  //     if (response.success && response.payload) {
  //       const post = response.payload;
  //       const postArray = props.moderatorView ? moderatorPosts : posts;
  //       const index = postArray.findIndex((p) => p._id === post._id);
  //       if (index !== -1) {
  //         const postSetter = props.moderatorView ? setModeratorPosts : setPosts;
  //         postSetter((p) => {
  //           p[index] = post;
  //           return [...p];
  //         });
  //       }
  //       props.moderatorView
  //         ? setModeratorDisplayedPosts(moderatorPosts)
  //         : setDisplayedPosts(posts);
  //     } else {
  //       console.log("error getting posts", response.message);
  //     }
  //   },

  //   [props.moderatorView, posts, moderatorPosts]
  // );
  console.log(props);
  return <div className="Feed">{props.children}</div>;
}

export default Feed;
