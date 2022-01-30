import "./SearchPage.css";
import SearchHeaderCover from "components/header/SearchHeaderCover";
import { useState, useEffect } from "react";
import { searchPosts } from "gateways/PostGateway";
import IPost from "types/IPost";
import SearchFeed from "components/feeds/SearchFeed";
import { getPost } from "gateways/PostGateway";

type SearchPageProps = {};

function SearchPage(props: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<IPost[]>([]);
  const [possiblePost, setPossiblePost] = useState<IPost>();
  const [foundAPost, setFoundAPost] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 0) {
      searchPosts(searchQuery).then((response) => {
        if (response.success && response.payload) {
          console.log(searchQuery, response.payload);
          setResults(response.payload as IPost[]);
        } else {
          console.log(response.message);
        }
      });
    }
  }, [searchQuery]);

  useEffect(() => {
    // if searchQuery starts with #
    if (searchQuery.startsWith("#")) {
      const possibleNumber = searchQuery.substring(1);
      if (Number.isInteger(Number(possibleNumber))) {
        // get that post
        getPost(Number(possibleNumber)).then((response) => {
          if (response.success && response.payload) {
            setFoundAPost(true);
            setPossiblePost(response.payload);
          } else {
            console.log(response.message);
          }
        });
      }
    }
    else if (Number.isInteger(Number(searchQuery))) {
      // get that post
      getPost(Number(searchQuery)).then((response) => {
        if (response.success && response.payload) {
          setFoundAPost(true);
          setPossiblePost(response.payload);
        } else {
          console.log(response.message);
        }
      });
    }
    else {
      setFoundAPost(false);
    }
  }, [searchQuery]);

  return (
    <div className="SearchPage">
      <SearchHeaderCover setSearchQuery={setSearchQuery} />
      {possiblePost && foundAPost && <SearchFeed results={[possiblePost]} hasResults={possiblePost && foundAPost}/>}
      <SearchFeed results={results} hasResults={possiblePost && foundAPost}/>
    </div>
  );
}

export default SearchPage;
