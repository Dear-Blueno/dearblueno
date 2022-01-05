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
  console.log(props.user?.twitter);
  return (
    <div className="ProfileBox">
      <div className="LeftColumn">
        <ProfilePicture
          link={props.user ? props.user.profilePicture : ""}
        ></ProfilePicture>
        <ProfilePersonalInfo
          // year={props.user?.classYear}
          // hometown={props.user.hometown}
          // concentration={props.user?.concentration}
          year="2024"
          hometown="Westborough, MA"
          concentration="Computer Science"
        />
      </div>
      <div className="RightColumn">
        <ProfileName name={props.user ? props.user.name : ""} />
        <ProfileSocials
          // instagram={props.user?.instagram}
          // twitter={props.user?.twitter}
          // facebook={props.user?.facebook}
          instagram="https://www.instagram.com/dylannhu"
          twitter="https://twitter.com/dylanhu"
        />
        <ProfileBio bio={props.user?.bio ? props.user.bio : ""} />
        {/* <button
          onClick={() =>
            updateUserProfile(undefined, "https://www.instagram.com/dylannhu")
          }
        ></button> */}
      </div>
    </div>
  );
}

export default ProfileBox;
