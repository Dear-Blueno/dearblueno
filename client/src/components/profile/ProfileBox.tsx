import "./ProfileBox.css";
import IUser from "../../types/IUser";
import ProfilePicture from "../../components/profile/ProfilePicture";
import ProfileName from "./ProfileName";
import ProfileBio from "./ProfileBio";
import { updateUserProfile } from "../../gateways/UserGateway";
import ProfileSocials from "./ProfileSocials";
import ProfilePersonalInfo from "./ProfilePersonalInfo";

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
        <ProfilePersonalInfo />
      </div>
      <div className="RightColumn">
        <ProfileName name={props.user ? props.user.name : ""} />
        <ProfileSocials />
        <ProfileBio bio={props.user?.bio ? props.user.bio : ""} />
        {/* <button
          onClick={() =>
            updateUserProfile(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            )
          }
        ></button> */}
      </div>
    </div>
  );
}

export default ProfileBox;
