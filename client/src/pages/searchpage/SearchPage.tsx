import "./SearchPage.css";
import SearchHeaderCover from "components/header/SearchHeaderCover";
import { useState, useEffect } from "react";
import { searchPosts } from "gateways/PostGateway";
import IPost from "types/IPost";
import SearchFeed from "components/feeds/SearchFeed";


type SearchPageProps = {
};

function SearchPage(props: SearchPageProps) {

    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<IPost[]>([]);

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

  return (
    <div className="SearchPage">
        <SearchHeaderCover setSearchQuery={setSearchQuery}/>
        <SearchFeed results={results}/>
    </div>
  );
}

export default SearchPage;
