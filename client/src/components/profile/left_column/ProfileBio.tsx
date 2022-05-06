import "./ProfileBio.css";
import UserContent from "../../feeds/UserContent";

interface ProfileBioProps {
  bio: string;
  bioRef: React.RefObject<HTMLTextAreaElement>;
  editing: boolean;
}

function ProfileBio(props: ProfileBioProps) {
  if (!props.editing && !props.bio) {
    return null;
  }

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
        <UserContent showContent={true}>{props.bio}</UserContent>
      )}
    </div>
  );
}

export default ProfileBio;
