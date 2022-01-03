import "./ProfilePersonalInfo.css";
import { MdOutlineSchool, MdOutlineLocationOn } from "react-icons/md";
import { IoMdBook } from "react-icons/io";

interface ProfilePersonalInfoProps {
  year?: string;
  hometown?: string;
  concentration?: string;
}

function ProfilePersonalInfo(props: ProfilePersonalInfoProps) {
  return (
    <div className="ProfilePersonalInfo">
      <MdOutlineLocationOn className="SocialButton" size="1.5em" />
      <MdOutlineSchool className="SocialButton" size="1.5em" />
      <IoMdBook className="SocialButton" size="1.5em" />
    </div>
  );
}

export default ProfilePersonalInfo;
