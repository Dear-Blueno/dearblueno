import Feed from "../components/feed/Feed";
import Header from "../components/header/Header";
import IUser from "../types/IUser";

type FeedPageProps = {
  user: IUser | undefined;
};

function FeedPage(props: FeedPageProps) {
  return (
    <div className="FeedPage">
      {/* <Header /> */}
      <Feed user={props.user} />
    </div>
  );
}

export default FeedPage;
