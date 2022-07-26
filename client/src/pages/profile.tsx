import useUser from "hooks/useUser";
import { NextPage } from "next";
import ProfilePage from "./profile/[id]";

const MyProfilePage: NextPage = () => {
  const { user, isLoadingUser: isLoading } = useUser();
  if (isLoading) {
    return null;
  }
  return <ProfilePage user={user} />;
};

export default MyProfilePage;
