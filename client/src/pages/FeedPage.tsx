import Feed from "../components/feed/Feed";
import Header from "../components/header/Header";
import IUser from "../types/IUser";

interface FeedProps {
  user: IUser | undefined;
  loading: boolean;
}

function FeedPage(props: FeedProps) {
  const { user, loading } = props;

  return (
    <div className="FeedPage">
      <Header user={user} loading={loading} />
      <Feed />
    </div>
  );
}

export default FeedPage;
