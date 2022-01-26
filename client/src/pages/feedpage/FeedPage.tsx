import "./FeedPage.css";
import Header from "../../components/header/Header";
import IUser from "../../types/IUser";
import IPost from "../../types/IPost";
import MainFeed from "../../components/feeds/MainFeed";
import ModeratorFeed from "../../components/feeds/ModeratorFeed";
import SearchFeed from "../../components/feeds/SearchFeed";
import { searchPosts } from "../../gateways/PostGateway";
import { useState, useEffect } from "react";

interface FeedPageProps {
  user?: IUser;
  moderatorView: boolean;
}

function FeedPage(props: FeedPageProps) {
  const { user } = props;
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<IPost[]>([]);

  useEffect(() => {
    if (searching && searchQuery.length > 0) {
      searchPosts(searchQuery).then((response) => {
        if (response.success && response.payload) {
          console.log(searchQuery, response.payload);
          setResults(response.payload as IPost[]);
        } else {
          console.log(response.message);
        }
      });
    }
  }, [searching, searchQuery]);

  return (
    <div className="FeedPage">
      <Header
        user={user}
        moderatorView={props.moderatorView}
        searching={searching}
        setSearching={setSearching}
        setSearchQuery={setSearchQuery}
      />

      {searching && <SearchFeed user={user} results={results} />}
      {!searching && props.moderatorView && <ModeratorFeed user={user} />}
      {!searching && !props.moderatorView && <MainFeed user={user} />}
    </div>
  );
}

export default FeedPage;
