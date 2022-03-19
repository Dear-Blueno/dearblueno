import IUser from "types/IUser";
import "./MainFeedSidebar.css";

type MainFeedSidebarProps = {
  user?: IUser;
};

export default function MainFeedSidebar(props: MainFeedSidebarProps) {
  return <div className="MainFeedSidebar">test</div>;
}
