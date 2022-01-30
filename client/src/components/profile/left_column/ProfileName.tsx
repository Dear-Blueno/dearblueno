import "./ProfileName.css";

interface ProfileNameProps {
  name: string;
}

function ProfileName(props: ProfileNameProps) {
  return <div className="ProfileName">{props.name}</div>;
}

export default ProfileName;
