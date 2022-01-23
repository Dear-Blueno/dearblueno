import "./ProfilePage.css";
import LogoIcon from "../../images/logo128.png";
import { Link, useParams } from "react-router-dom";
import IUser from "../../types/IUser";
import { IBasicUser } from "../../types/IUser";
import ProfileBox from "../../components/profile/ProfileBox";
import { getUser } from "../../gateways/UserGateway";
import { useEffect, useState } from "react";

type ProfilePageProps = {
  user: IUser | undefined;
  profileUser?: IUser;
};

function ProfilePage(props: ProfilePageProps) {
  const { profileUserID } = useParams();
  const [profileUser, setProfileUser] = useState<IBasicUser>();

  useEffect(() => {
    console.log("profileUserID", profileUserID);
    if (profileUserID) {
      getUser(profileUserID).then((response) => {
        console.log(response);
        if (response.success && response.payload) {
          setProfileUser(response.payload);
        } else {
          console.log(response.message);
        }
      });
    }
  }, [profileUserID]);

  return (
    <div className="ProfilePage">
      {window.innerWidth >= 768 && (
        <Link to="/" draggable={false}>
          <img
            className="BluenoHomeButton"
            src={LogoIcon}
            alt="Blueno Home Button"
            draggable={false}
          />
        </Link>
      )}
      <ProfileBox
        user={props.user}
        profileUser={props.profileUser ? props.profileUser : profileUser}
      ></ProfileBox>
    </div>
  );
}

export default ProfilePage;
