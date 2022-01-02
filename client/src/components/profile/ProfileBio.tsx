import "./ProfileBio.css";

interface ProfileBioProps {
  bio: string;
}

function ProfileBio(props: ProfileBioProps) {
  return (
    <div className="ProfileBio">
      <p>{props.bio}</p>
    </div>
  );
}

export default ProfileBio;
