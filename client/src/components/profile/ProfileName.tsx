import "./ProfileName.css";

interface ProfileNameProps {
  name: string;
}

function ProfileName(props: ProfileNameProps) {
  return (
    <div className="ProfileName">
      <h1>{props.name}</h1>
    </div>
  );
}

export default ProfileName;
