import "./ProfilePersonalInfo.css";
import { MdOutlineSchool, MdOutlineLocationOn } from "react-icons/md";
import { IoMdBook } from "react-icons/io";
import ProfilePersonalInfoEntry from "./ProfilePersonalInfoEntry";

interface ProfilePersonalInfoProps {
  year?: string;
  hometown?: string;
  concentration?: string;
}

function ProfilePersonalInfo(props: ProfilePersonalInfoProps) {
  const contents = [props.hometown, props.year, props.concentration];
  const icons = [MdOutlineLocationOn, MdOutlineSchool, IoMdBook];
  return (
    <div className="ProfilePersonalInfo">
      {contents.map((content, index) => {
        return content ? (
          <ProfilePersonalInfoEntry content={content} icon={icons[index]} />
        ) : null;
      })}
    </div>
  );
}

export default ProfilePersonalInfo;
