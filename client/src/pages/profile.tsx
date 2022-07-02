import useUser from "hooks/useUser";
import { NextPage } from "next";
import ProfilePage from "./profile/[id]";

const MyProfilePage: NextPage = () => {
  const { user } = useUser();
  return <ProfilePage user={user} />;
};

export default MyProfilePage;
