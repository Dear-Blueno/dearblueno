import useUser from "hooks/useUser";
import { NextPage } from "next";
import ProfilePage from "./profile/[id]";

const MyProfilePage: NextPage = () => {
  const { user, isLoadingUser } = useUser();
  if (isLoadingUser) {
    return null;
  }
  return <ProfilePage profileUser={user} />;
};

export default MyProfilePage;
