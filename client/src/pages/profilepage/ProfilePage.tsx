import "./ProfilePage.css";
import { useParams } from "react-router-dom";
import IUser, { IBasicUser } from "../../types/IUser";
import ProfileBox from "../../components/profile/ProfileBox";
import { getUser } from "../../gateways/UserGateway";
import { useEffect, useState } from "react";

type ProfilePageProps = {
  user?: IUser;
  profileUser?: IUser;
};

function ProfilePage(props: ProfilePageProps) {
  const { profileUserID } = useParams();
  const [profileUser, setProfileUser] = useState<IBasicUser>();
  const [profileUserStatus, setProfileUserStatus] =
    useState<string>("loading...");

  useEffect(() => {
    console.log("profileUserID", profileUserID);
    if (profileUserID) {
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
    }
  }, [profileUserID]);

  return (
    <div className="ProfilePage">
      {profileUser ? (
        <ProfileBox
          user={props.user}
          profileUser={profileUser}
          setProfileUser={setProfileUser}
        />
      ) : (
        <p className="ProfilePageStatus">{profileUserStatus}</p>
      )}
    </div>
  );
}

export default ProfilePage;
