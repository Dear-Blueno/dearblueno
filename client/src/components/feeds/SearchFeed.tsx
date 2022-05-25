import styles from "./SearchFeed.module.scss";
import { useState, useCallback, useEffect, useRef } from "react";
import IPost from "../../types/IPost";
import IUser from "../../types/IUser";
import Feed from "./Feed";
import Post from "./post/Post";

type SearchFeedProps = {
  user?: IUser;
  results: IPost[];
  hasQuery: boolean;
};

function SearchFeed(props: SearchFeedProps) {
  const [pageNumber, setPageNumber] = useState(1);

  const getMore = useCallback(
    async (nextPageNumber: number): Promise<boolean> => {
      setPageNumber(nextPageNumber);
      if (nextPageNumber * 10 >= props.results.length) {
        return false;
      }
      return true;
    },
    [props.results.length]
  );

  return (
    <>
      {props.results.length > 0 && (
        <Feed user={props.user} getMore={getMore} animated={false}>
          {props.results.slice(0, pageNumber * 10).map((post, index) => (
            <Post
              key={index}
              post={post}
              user={props.user}
              delay={index * 80 + "ms"}
            />
          ))}
        </Feed>
      )}
      {props.hasQuery && !props.results.length && (
        <div className={styles.NoResults}>
          <h1 className={styles.NoResultsText}>no results found</h1>
        </div>
      )}
    </>
  );
}

export default SearchFeed;
