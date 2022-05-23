import styles from "styles/ProfilePage.module.scss";
import IUser, { IBasicUser } from "../../types/IUser";
import ProfileBox from "../../components/profile/ProfileBox";
import { getUser } from "../../gateways/UserGateway";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { loadAuth } from "gateways/AuthGateway";
import { useQuery } from "react-query";
import MainLayout from "components/layout/MainLayout";

type ProfilePageProps = {
  user?: IUser;
};

export default function ProfilePage(props: ProfilePageProps) {
  return <MainLayout title="Profile" page={<ProfilePageMain {...props} />} />;
}

function ProfilePageMain(props: ProfilePageProps) {
  const {
    isLoading,
    error,
    data: user,
  } = useQuery("user", () =>
    loadAuth().then((response) => {
      if (response.success && response.payload) {
        return response.payload;
      }
    })
  );

  const router = useRouter();
  const profileUserID = router.query.id as string;
  const [profileUser, setProfileUser] = useState<IBasicUser>();
  const [profileUserStatus, setProfileUserStatus] =
    useState<string>("loading...");

  useEffect(() => {
    console.log("profileUserID", profileUserID);
    if (profileUserID) {
      console.log("profileUserID", profileUserID);
      getUser(profileUserID).then((response) => {
        console.log(response);
        if (response.success && response.payload) {
          setProfileUser(response.payload);
          setProfileUserStatus("");
        } else {
          console.log(response.message);
          setProfileUserStatus(response.message.toString() + " :(");
        }
      });
    } else {
      setProfileUser(user);
      setProfileUserStatus("");
    }
  }, [profileUserID, user]);

  return (
    <div className={styles.ProfilePage}>
      {profileUser ? (
        <ProfileBox
          user={user}
          profileUser={profileUser}
          setProfileUser={setProfileUser}
        />
      ) : (
        <p className={styles.ProfilePageStatus}>{profileUserStatus}</p>
      )}
    </div>
  );
}
