import MainLayout from "components/layout/MainLayout";
import { loadAuth, loginBrown } from "gateways/AuthGateway";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

const ProfilePage: NextPage = () => {
  const { isLoading: isLoadingUser, data: user } = useQuery("user", () =>
    loadAuth().then((response) => {
      if (response.success && response.payload) {
        return response.payload;
      }
    })
  );

  const router = useRouter();

  if (isLoadingUser) {
    return <MainLayout page={<div>Loading...</div>} />;
  }

  if (!user) {
    loginBrown();
    return <MainLayout page={<div>You must login...</div>} />;
  }

  router.push(`/profile/${user._id}`);
  return <MainLayout page={<div>Redirecting...</div>} />;
};

export default ProfilePage;
