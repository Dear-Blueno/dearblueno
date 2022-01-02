import "./ProfilePicture.css";

interface ProfilePictureProps {
  link: string;
}

function ProfilePicture(props: ProfilePictureProps) {
  return (
    <div className="ProfilePicture">
      <img className="ProfilePictureImage" src={props.link} alt="" />
    </div>
  );
}

export default ProfilePicture;
