import "./ProfilePicture.css";

interface ProfilePictureProps {
  link: string;
}

function ProfilePicture(props: ProfilePictureProps) {
  return (
    <div className="ProfilePicture">
      <img src={props.link} alt="" />
    </div>
  );
}

export default ProfilePicture;
