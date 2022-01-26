import "./FeedPage.css";
import Header from "../../components/header/Header";
import IUser from "../../types/IUser";
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

  return (
    <div className="FeedPage">
      <Header
        user={user}
        moderatorView={props.moderatorView}
      />

      {props.moderatorView && <ModeratorFeed user={user} />}
      {!props.moderatorView && <MainFeed user={user} />}
    </div>
  );
}

export default FeedPage;
