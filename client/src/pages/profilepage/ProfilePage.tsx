import "./ProfilePage.css";
import LogoIcon from "../../images/logo128.png";
import { Link } from "react-router-dom";
import IUser from "../../types/IUser";
import ProfileBox from "../../components/profile/ProfileBox";

type ProfilePageProps = {
  user: IUser | undefined;
  profileUser: IUser | undefined;
};

function ProfilePage(props: ProfilePageProps) {
  return (
    <div className="ProfilePage">
      {window.innerWidth >= 768 && (
        <Link to="/">
          <img
            className="BluenoHomeButton"
            src={LogoIcon}
            alt="Blueno Home Button"
          />
        </Link>
      )}
      <ProfileBox
        user={props.user}
        profileUser={props.profileUser}
      ></ProfileBox>
    </div>
  );
}

export default ProfilePage;
