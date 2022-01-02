import "./ProfileBox.css";
import IUser from "../../types/IUser";
import ProfilePicture from "../../components/profile/ProfilePicture";
import ProfileName from "./ProfileName";
import ProfileBio from "./ProfileBio";

type ProfileBoxProps = {
  user: IUser | undefined;
  profileUser: IUser | undefined;
};

function ProfileBox(props: ProfileBoxProps) {
  return (
    <div className="ProfileBox">
      <div className="LeftColumn">
        <ProfilePicture
          link={props.user ? props.user.profilePicture : ""}
        ></ProfilePicture>
      </div>
      <div className="RightColumn">
        <ProfileName name={props.user ? props.user.name : ""} />
        <ProfileBio bio={props.user?.bio ? props.user.bio : ""} />
      </div>
    </div>
  );
}

export default ProfileBox;
