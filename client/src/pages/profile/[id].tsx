import styles from "styles/ProfilePage.module.scss";
import IUser, { IBasicUser } from "../../types/IUser";
import ProfileBox from "../../components/profile/ProfileBox";
import { getUser } from "../../gateways/UserGateway";
import MainLayout from "components/layout/MainLayout";
import Head from "next/head";
import NotFoundPage from "pages/404";
import { GetStaticProps, NextPage } from "next";

import ProfileSidebar from "../../components/profile/ProfileSidebar";
import useUser from "hooks/useUser";

interface ProfilePageProps {
  user?: IUser;
}

const ProfilePage: NextPage<ProfilePageProps> = (props) => {
  const { user, isLoadingUser: isLoading } = useUser();

  const profileUser = props.user;

  if (!profileUser) {
    return <NotFoundPage />;
  }

  if (isLoading) {
    return <MainLayout page={<div>Loading...</div>} />;
  }

  const title =
    user?._id === profileUser._id
      ? "My Profile"
      : (profileUser.displayName ?? profileUser.name)  + "'s Profile";

  return (
    <>
      <Head>
        <title>{(profileUser.displayName ?? profileUser.name) + " - Dear Blueno"}</title>
      </Head>
      <MainLayout
        title={title}
        page={<ProfilePageMain user={user} profileUser={profileUser} />}
        sidebar={<ProfileSidebar />}
      />
    </>
  );
};

interface ProfilePageMainProps {
  user?: IUser;
  profileUser: IBasicUser;
}

function ProfilePageMain(props: ProfilePageMainProps) {
  return (
    <div className={styles.ProfilePage}>
      <ProfileBox user={props.user} profileUser={props.profileUser} />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const userID = context.params?.id as string;
  const user = await getUser(userID);
  if (user.success) {
    return {
      props: {
        user: user.payload,
      },
      revalidate: 30,
    };
  }
  return {
    props: {
      user: null,
    },
    revalidate: 30,
  };
};

export const getStaticPaths = () => {
  // Server-render and cache pages on the fly.
  return { fallback: "blocking", paths: [] };
};

export default ProfilePage;
