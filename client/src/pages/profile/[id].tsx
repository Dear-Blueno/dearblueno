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
  profileUser?: IUser;
}

const ProfilePage: NextPage<ProfilePageProps> = (props) => {
  const { user, isLoadingUser } = useUser();

  if (!props.profileUser) {
    return <NotFoundPage />;
  }

  if (isLoadingUser) {
    return <MainLayout />;
  }

  const title =
    user?._id === props.profileUser._id
      ? "My Profile"
      : (props.profileUser.displayName ?? props.profileUser.name) +
        "'s Profile";

  return (
    <>
      <Head>
        <title>
          {(props.profileUser.displayName ?? props.profileUser.name) +
            " - Dear Blueno"}
        </title>
      </Head>
      <MainLayout
        title={title}
        page={<ProfilePageMain user={user} profileUser={props.profileUser} />}
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
  const profileUser = await getUser(userID);
  if (profileUser.success) {
    return {
      props: {
        profileUser: profileUser.payload,
      },
      revalidate: 30,
    };
  }
  return {
    props: {
      profileUser: null,
    },
    revalidate: 30,
  };
};

export const getStaticPaths = () => {
  // Server-render and cache pages on the fly.
  return { fallback: "blocking", paths: [] };
};

export default ProfilePage;
