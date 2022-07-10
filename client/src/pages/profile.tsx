import { useLoginPopup } from "hooks/login-popup";
import useUser from "hooks/useUser";
import { NextPage } from "next";
import ProfilePage from "./profile/[id]";

const MyProfilePage: NextPage = () => {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return null;
  }
  return <ProfilePage user={user} />;
};

export default MyProfilePage;
