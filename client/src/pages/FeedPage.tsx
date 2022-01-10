import Feed from "../components/feed/Feed";
import Header from "../components/header/Header";
import IUser from "../types/IUser";
import { useState } from "react";
interface FeedProps {
  user: IUser | undefined;
}

function FeedPage(props: FeedProps) {
  const { user } = props;
  const [loading, setLoading] = useState(true);

  return (
    <div className="FeedPage">
      <Header user={user} setLoading={setLoading} />
      <Feed user={user} loading={loading} />
    </div>
  );
}

export default FeedPage;
