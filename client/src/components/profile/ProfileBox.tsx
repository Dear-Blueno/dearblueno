import "./ProfileBox.css";
import IUser from "../../types/IUser";
import ProfilePicture from "../../components/profile/ProfilePicture";
import ProfileName from "./ProfileName";
import ProfileBio from "./ProfileBio";
import { updateUserProfile } from "../../gateways/UserGateway";
import ProfileSocials from "./ProfileSocials";
import ProfilePersonalInfo from "./ProfilePersonalInfo";
import EditProfileButton from "./EditProfileButton";

type ProfileBoxProps = {
  user: IUser | undefined;
  profileUser: IUser | undefined;
};

function ProfileBox(props: ProfileBoxProps) {
  const ownProfile = props.user && props.user._id === props.profileUser?._id;
  return (
    <div className="ProfileBox">
      <div className="LeftColumn">
        <ProfilePicture
          link={props.user ? props.user.profilePicture : ""}
        ></ProfilePicture>
        <ProfileName name={props.user ? props.user.name : ""} />
        {ownProfile && <EditProfileButton click={() => {}} />}
        <ProfileSocials
          instagram={props.profileUser?.instagram}
          twitter={props.profileUser?.twitter}
          facebook={props.profileUser?.facebook}
        />
        <ProfileBio bio={props.user?.bio ? props.user.bio : ""} />
        <ProfilePersonalInfo
          year={props.profileUser?.classYear}
          hometown="Westborough, MA"
          concentration={props.profileUser?.concentration}
        />
      </div>
      <div className="RightColumn">
        {/* <button
          onClick={() =>
            updateUserProfile(
              "Computer Science student with interests in math, physics, and computer graphics.",
              "https://instagram.com/dylannhu",
              "https://twitter.com/dylanhu",
              "https://facebook.com/dylannhu",
              "Computer Science",
              "2024"
            )
          }
        ></button> */}
      </div>
    </div>
  );
}

export default ProfileBox;
