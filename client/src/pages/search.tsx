import styles from "styles/SearchPage.module.scss";
import { useState, useEffect } from "react";
import { searchPosts, getPost } from "gateways/PostGateway";
import IPost from "types/IPost";
import SearchFeed from "components/feeds/SearchFeed";
import IUser from "types/IUser";
import MainLayout from "components/layout/MainLayout";
import SearchPageHeader from "components/header/search/SearchPageHeader";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

interface SearchPageProps {
  user?: IUser;
  searchQuery: ParsedUrlQuery;
}

const SearchPage: NextPage<SearchPageProps> = (props: SearchPageProps) => {
  const router = useRouter();
  const setSearchQuery = (query: string) => {
    void (query ? router.push(`/search?q=${query}`) : router.push("/search"));
  };

  return (
    <MainLayout
      title="Search:"
      forceTitle
      header={<SearchPageHeader setSearchQuery={setSearchQuery} />}
      page={<SearchPageMain user={props.user} searchQuery={router.query} />}
    />
  );
};

function SearchPageMain(props: SearchPageProps) {
  const [results, setResults] = useState<IPost[]>([]);
  const [possiblePost, setPossiblePost] = useState<IPost>();
  const [hasQuery, setHasQuery] = useState(false);

  const query = props.searchQuery.q as string | undefined;

  useEffect(() => {
    if (!query) {
      setResults([]);
      setHasQuery(false);
      return;
    }
    if (query.length > 0) {
      searchPosts(query)
        .then((response) => {
          setHasQuery(true);
          if (response.success) {
            console.log(query, response.payload);
            setResults(response.payload);
          } else {
            console.log(response.message);
            setResults([]);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [query]);

  useEffect(() => {
    if (!query) {
      setPossiblePost(undefined);
      setHasQuery(false);
      return;
    }
    const possibleNumber = query.startsWith("#") ? query.substring(1) : query;
    if (Number.isInteger(Number(possibleNumber))) {
      // get that post
      getPost(Number(possibleNumber))
        .then((response) => {
          setHasQuery(true);
          if (response.success) {
            setPossiblePost(response.payload);
          } else {
            console.log(response.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [query]);

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

export default SearchPage;
