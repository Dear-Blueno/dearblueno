import "./ProfileBox.css";
import IUser from "../../types/IUser";
import ProfilePicture from "./left_column/ProfilePicture";
import ProfileName from "./left_column/ProfileName";
import ProfileBio from "./left_column/ProfileBio";
import { updateUserProfile } from "../../gateways/UserGateway";
import ProfileSocials from "./left_column/ProfileSocials";
import ProfilePersonalInfo from "./left_column/ProfilePersonalInfo";
import ProfileEditButton from "./buttons/ProfileEditButton";
import ProfileSaveButton from "./buttons/ProfileSaveButton";
import ProfileCancelButton from "./buttons/ProfileCancelButton";
import { useState, useRef } from "react";

type ProfileBoxProps = {
  user: IUser | undefined;
  profileUser: IUser | undefined;
};

function ProfileBox(props: ProfileBoxProps) {
  const ownProfile = props.user && props.user._id === props.profileUser?._id;
  const [editing, setEditing] = useState(false);
  const instagramInput = useRef<HTMLInputElement>(null);
  const twitterInput = useRef<HTMLInputElement>(null);
  const facebookInput = useRef<HTMLInputElement>(null);
  const linkedinInput = useRef<HTMLInputElement>(null);
  const bioTextArea = useRef<HTMLTextAreaElement>(null);
  const hometownInput = useRef<HTMLInputElement>(null);
  const yearInput = useRef<HTMLInputElement>(null);
  const concentrationInput = useRef<HTMLInputElement>(null);

  const handleProfileEdit = () => {
    updateUserProfile(
      bioTextArea.current?.value,
      instagramInput.current?.value,
      twitterInput.current?.value,
      facebookInput.current?.value,
      concentrationInput.current?.value,
      yearInput.current?.value
    );
    setEditing(false);
  };

  return (
    <div className="ProfileBox">
      <div className="LeftColumn">
        <ProfilePicture
          link={props.user ? props.user.profilePicture : ""}
        ></ProfilePicture>
        <ProfileName name={props.user ? props.user.name : ""} />
        {ownProfile && !editing && (
          <ProfileEditButton click={() => setEditing(true)} />
        )}
        <ProfileSocials
          links={[
            props.profileUser?.instagram,
            props.profileUser?.twitter,
            props.profileUser?.facebook,
            undefined,
          ]}
          refs={[instagramInput, twitterInput, facebookInput, linkedinInput]}
          editing={editing}
        />
        <ProfileBio
          bio={props.user?.bio ? props.user.bio : ""}
          editing={editing}
          bioRef={bioTextArea}
        />
        <ProfilePersonalInfo
          contents={[
            "Westborough, MA",
            props.user?.classYear,
            props.user?.concentration,
          ]}
          refs={[hometownInput, yearInput, concentrationInput]}
          editing={editing}
        />
        {editing && (
          <div className="SaveAndCancelButtons">
            <ProfileSaveButton click={handleProfileEdit} />
            <ProfileCancelButton click={() => setEditing(false)} />
          </div>
        )}
      </div>
      <div className="RightColumn"></div>
    </div>
  );
}

export default ProfileBox;
