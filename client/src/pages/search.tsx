import styles from "styles/SearchPage.module.scss";
import { useState, useEffect } from "react";
import { searchPosts, getPost } from "gateways/PostGateway";
import IPost from "types/IPost";
import SearchFeed from "components/feeds/SearchFeed";
import IUser from "types/IUser";
import MainLayout from "components/layout/MainLayout";
import SearchPageHeader from "components/header/SearchPageHeader";

type SearchPageProps = {
  user?: IUser;
  searchQuery: string;
};

export default function SearchPage(props: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <MainLayout
      title="Search:"
      header={<SearchPageHeader setSearchQuery={setSearchQuery} />}
      page={<SearchPageMain user={props.user} searchQuery={searchQuery} />}
    />
  );
}

function SearchPageMain(props: SearchPageProps) {
  const [results, setResults] = useState<IPost[]>([]);
  const [possiblePost, setPossiblePost] = useState<IPost>();
  const [hasQuery, setHasQuery] = useState(false);

  useEffect(() => {
    if (props.searchQuery.length === 0) {
      setResults([]);
      setHasQuery(false);
      return;
    }
    if (props.searchQuery.length > 0) {
      searchPosts(props.searchQuery).then((response) => {
        setHasQuery(true);
        if (response.success && response.payload) {
          console.log(props.searchQuery, response.payload);
          setResults(response.payload as IPost[]);
        } else {
          console.log(response.message);
          setResults([]);
        }
      });
    }
  }, [props.searchQuery]);

  useEffect(() => {
    if (props.searchQuery.length === 0) {
      setPossiblePost(undefined);
      setHasQuery(false);
      return;
    }
    const possibleNumber = props.searchQuery.startsWith("#")
      ? props.searchQuery.substring(1)
      : props.searchQuery;
    if (Number.isInteger(Number(possibleNumber))) {
      // get that post
      getPost(Number(possibleNumber)).then((response) => {
        setHasQuery(true);
        if (response.success && response.payload) {
          setPossiblePost(response.payload);
        } else {
          console.log(response.message);
        }
      });
    }
  }, [props.searchQuery]);

  return (
    <div className={styles.SearchPage}>
      <SearchFeed
        results={possiblePost ? [possiblePost, ...results] : results}
        hasQuery={hasQuery}
        user={props.user}
      />
    </div>
  );
}
