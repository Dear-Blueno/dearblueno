import "./ProfileBio.css";

interface ProfileBioProps {
  bio: string;
  bioRef: React.RefObject<HTMLTextAreaElement>;
  editing: boolean;
}

function ProfileBio(props: ProfileBioProps) {
  return (
    <div className="ProfileBio">
      {props.editing ? (
        <div className="ProfileBioEditing">
          <div className="ProfileBioEditingHeader">Bio</div>
          <textarea
            ref={props.bioRef}
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
