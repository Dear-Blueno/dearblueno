import Header from "../../components/header/Header";
import IUser from "../../types/IUser";
import { Outlet } from "react-router-dom";
import Feed from "../../components/feed/Feed";

interface FeedProps {
  user?: IUser;
  moderatorView: boolean;
}

function FeedPage(props: FeedProps) {
  const { user } = props;

  return (
    <div className="FeedPage">
      <Header user={user} moderatorView={props.moderatorView} />
      <Feed user={user} moderatorView={props.moderatorView} />
    </div>
  );
}

export default FeedPage;
