import styles from "./ProfileBox.module.scss";
import IUser, { IBasicUser } from "../../types/IUser";
import ProfilePicture from "./left_column/ProfilePicture";
import ProfileName from "./left_column/ProfileName";
import ProfileBio from "./left_column/ProfileBio";
import { getUserComments, updateUserProfile } from "../../gateways/UserGateway";
import ProfileSocials from "./left_column/ProfileSocials";
import ProfilePersonalInfo from "./left_column/ProfilePersonalInfo";
import ProfileEditButton from "./buttons/ProfileEditButton";
import ProfileSaveButton from "./buttons/ProfileSaveButton";
import ProfileCancelButton from "./buttons/ProfileCancelButton";
import { useState, useRef, useEffect } from "react";
import IComment from "types/IComment";
import ContextThread from "components/post/comments/ContextThread";

type ProfileBoxProps = {
  user?: IUser;
  profileUser?: IBasicUser;
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

  const [comments, setComments] = useState<IComment[]>([]);

  useEffect(() => {
    if (props.profileUser) {
      getUserComments(props.profileUser._id).then((response) => {
        if (response.success && response.payload) {
          setComments(response.payload.reverse());
        } else {
          console.log(response.message);
        }
      });
    }
  }, [props.profileUser]);

  const handleInstagram = (link: string | undefined) => {
    if (!link) {
      return undefined;
    } else if (link.startsWith("https://www.instagram.com/")) {
      return link;
    } else if (link.startsWith("https://instagram.com/")) {
      return link;
    } else if (link.startsWith("http://www.instagram.com/")) {
      return link.replace("http://", "https://");
    } else if (link.startsWith("www.instagram.com/")) {
      return "https://" + link;
    } else if (link.startsWith("instagram.com/")) {
      return "https://" + link;
    } else if (link.startsWith("@")) {
      return link.replace("@", "https://www.instagram.com/");
    }
    return "https://www.instagram.com/" + link;
  };

  const handleTwitter = (link: string | undefined) => {
    if (!link) {
      return undefined;
    } else if (link.startsWith("https://www.twitter.com/")) {
      return link;
    } else if (link.startsWith("https://twitter.com/")) {
      return link;
    } else if (link.startsWith("http://www.twitter.com/")) {
      return link.replace("http://", "https://");
    } else if (link.startsWith("www.twitter.com/")) {
      return "https://" + link;
    } else if (link.startsWith("twitter.com/")) {
      return "https://" + link;
    } else if (link.startsWith("@")) {
      return link.replace("@", "https://www.twitter.com/");
    }
    return "https://www.twitter.com/" + link;
  };

  const handleLinkedIn = (link: string | undefined) => {
    if (!link) {
      return undefined;
    } else if (link.startsWith("https://www.linkedin.com/in/")) {
      return link;
    } else if (link.startsWith("https://linkedin.com/in/")) {
      return link;
    } else if (link.startsWith("http://www.linkedin.com/in/")) {
      return link.replace("http://", "https://");
    } else if (link.startsWith("https://www.linkedin.com/")) {
      return link.replace(
        "https://www.linkedin.com/",
        "http://www.linkedin.com/in/"
      );
    } else if (link.startsWith("www.linkedin.com/in/")) {
      return "https://" + link;
    } else if (link.startsWith("linkedin.com/in/")) {
      return "https://" + link;
    } else if (link.startsWith("@")) {
      return link.replace("@", "https://www.linkedin.com/in/");
    } else if (link.startsWith("in/")) {
      return "https://www.linkedin.com/" + link;
    } else if (link.startsWith("/in/")) {
      return "https://www.linkedin.com" + link;
    }
    return "https://www.linkedin.com/in/" + link;
  };

  const handleFacebook = (link: string | undefined) => {
    if (!link) {
      return undefined;
    } else if (link.startsWith("https://www.facebook.com/")) {
      return link;
    } else if (link.startsWith("https://facebook.com/")) {
      return link;
    } else if (link.startsWith("http://www.facebook.com/")) {
      return link.replace("http://", "https://");
    } else if (link.startsWith("www.facebook.com/")) {
      return "https://" + link;
    } else if (link.startsWith("facebook.com/")) {
      return "https://" + link;
    }
    return "https://www.facebook.com/" + link;
  };

  const handleProfileEdit = async () => {
    const response = await updateUserProfile(
      bioTextArea.current?.value || undefined,
      hometownInput.current?.value || undefined,
      handleInstagram(instagramInput.current?.value),
      handleTwitter(twitterInput.current?.value),
      handleFacebook(facebookInput.current?.value),
      handleLinkedIn(linkedinInput.current?.value),
      concentrationInput.current?.value || undefined,
      yearInput.current?.value || undefined
    );
    if (response.success && response.payload) {
      // TODO props.refetchProfileUser();
    }
    setEditing(false);
  };

  return (
    <>
      <div className={styles.ProfileBox}>
        <div className={styles.LeftColumn}>
          <ProfilePicture
            link={props.profileUser ? props.profileUser.profilePicture : ""}
          ></ProfilePicture>
          <ProfileName name={props.profileUser ? props.profileUser.name : ""} />
          {ownProfile && !editing && (
            <ProfileEditButton click={() => setEditing(true)} />
          )}
          <ProfileSocials
            links={[
              props.profileUser?.instagram,
              props.profileUser?.twitter,
              props.profileUser?.facebook,
              props.profileUser?.linkedin,
            ]}
            refs={[instagramInput, twitterInput, facebookInput, linkedinInput]}
            editing={editing}
          />
          <ProfileBio
            bio={props.profileUser?.bio ? props.profileUser.bio : ""}
            editing={editing}
            bioRef={bioTextArea}
          />
          <ProfilePersonalInfo
            contents={[
              props.profileUser?.hometown,
              props.profileUser?.classYear,
              props.profileUser?.concentration,
            ]}
            refs={[hometownInput, yearInput, concentrationInput]}
            editing={editing}
          />
          {editing && (
            <div className={styles.SaveAndCancelButtons}>
              <ProfileSaveButton click={handleProfileEdit} />
              <ProfileCancelButton click={() => setEditing(false)} />
            </div>
          )}
        </div>
        <div className={styles.RightColumn}>
          <div className={styles.ProfileComments}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <ContextThread
                  user={props.user}
                  key={comment._id}
                  thread={comment}
                  delay={index * 80 + "ms"}
                />
              ))
            ) : (
              <p className="ProfileCommentsEmpty">No comments yet!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileBox;
