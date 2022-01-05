import { IconType } from "react-icons/lib";
import "./ProfilePersonalInfoEntry.css";

interface ProfilePersonalInfoEntryProps {
  content: string;
  icon: IconType;
}

function ProfilePersonalInfoEntry(props: ProfilePersonalInfoEntryProps) {
  return (
    <div className="ProfilePersonalInfoEntry">
      {<props.icon className="ProfilePersonalInfoEntryIcon" size="1.5em" />}
      <p className="ProfilePersonalInfoEntryContent">{props.content}</p>
    </div>
  );
}

export default ProfilePersonalInfoEntry;
