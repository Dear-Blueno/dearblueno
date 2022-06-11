import styles from "styles/ProfilePage.module.scss";
import IUser, { IBasicUser } from "../../types/IUser";
import ProfileBox from "../../components/profile/ProfileBox";
import { getUser } from "../../gateways/UserGateway";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loadAuth } from "gateways/AuthGateway";
import { useQuery } from "react-query";
import MainLayout from "components/layout/MainLayout";
import Head from "next/head";
import NotFoundPage from "pages/404";
import { NextPage } from "next";

const ProfilePage: NextPage = () => {
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: user,
  } = useQuery("user", () =>
    loadAuth().then((response) => {
      if (response.success && response.payload) {
        return response.payload;
      }
    })
  );

  const router = useRouter();
  const [profileUserID, setProfileUserID] = useState<string>("");

  useEffect(() => {
    if (!router.query.id && user) {
      setProfileUserID(user._id);
    } else {
      setProfileUserID(router.query.id as string);
    }
    // setLoadingID(false);
  }, [router.query.id, user]);

  const {
    isLoading: isLoadingProfileUser,
    error: errorProfileUser,
    data: profileUser,
    refetch: refetchProfileUser,
  } = useQuery("profileUser_" + profileUserID, () =>
    profileUserID
      ? getUser(profileUserID).then((response) => {
          if (response.success && response.payload) {
            return response.payload;
          }
        })
      : undefined
  );

  if (isLoadingUser || isLoadingProfileUser) {
    return <MainLayout page={<div>Loading...</div>} />;
  }

  if (!profileUser) {
    return <NotFoundPage />;
  }

  const title =
    user?._id === profileUser._id
      ? "My Profile"
      : profileUser?.name + "'s Profile";

  return (
    <>
      <Head>
        <title>{profileUser?.name ?? "User Not Found"}</title>
      </Head>
      <MainLayout
        title={title}
        page={
          <ProfilePageMain
            user={user}
            profileUser={profileUser}
            refetchProfileUser={refetchProfileUser}
          />
        }
      />
    </>
  );
};

type ProfilePageMainProps = {
  user?: IUser;
  profileUser: IBasicUser;
  refetchProfileUser: () => void;
};

function ProfilePageMain(props: ProfilePageMainProps) {
  return (
    <div className={styles.ProfilePage}>
      <ProfileBox
        user={props.user}
        profileUser={props.profileUser}
        refetchProfileUser={props.refetchProfileUser}
      />
    </div>
  );
}

export default ProfilePage;
