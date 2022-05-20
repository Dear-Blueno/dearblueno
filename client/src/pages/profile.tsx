import IUser from "types/IUser";
import ProfilePage from "./profile/[id]";

type ProfilePageProps = {
  user?: IUser;
};

export default function MyProfilePage(props: ProfilePageProps) {
  return <ProfilePage user={props.user} />;
}
