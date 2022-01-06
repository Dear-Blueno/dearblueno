import "./ProfileBio.css";

interface ProfileBioProps {
  editing: boolean;
  bio: string;
}

function ProfileBio(props: ProfileBioProps) {
  return (
    <div className="ProfileBio">
      {props.editing ? (
        <div className="ProfileBioEditing">
          <div className="ProfileBioEditingHeader">Bio</div>
          <textarea
            className="ProfileBioTextArea"
            defaultValue={props.bio}
          ></textarea>
        </div>
      ) : (
        <p>{props.bio}</p>
      )}
    </div>
  );
}

export default ProfileBio;
