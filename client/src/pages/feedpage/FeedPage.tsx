import Header from "../../components/header/Header";
import IUser from "../../types/IUser";
import { Outlet } from "react-router-dom";
interface FeedProps {
  user?: IUser;
}

function FeedPage(props: FeedProps) {
  const { user } = props;

  return (
    <div className="FeedPage">
      <Header user={user} />
      <Outlet />
    </div>
  );
}

export default FeedPage;
