import styles from "./ProfileBox.module.scss";
import { IBasicUser } from "../../types/IUser";
import ProfilePicture from "./left_column/ProfilePicture";
import ProfileName from "./left_column/ProfileName";
import ProfileBio from "./left_column/ProfileBio";
import { getUserComments, updateUserProfile } from "../../gateways/UserGateway";
import ProfileSocials from "./left_column/ProfileSocials";
import ProfilePersonalInfo from "./left_column/ProfilePersonalInfo";
import { useState, useRef, useEffect } from "react";
import IComment from "types/IComment";
import ContextThread from "components/post/comments/ContextThread";
import { logout } from "gateways/AuthGateway";
import { MdBlock, MdLogout } from "react-icons/md";
import GenericProfileButton from "components/profile/buttons/GenericProfileButton";
import toast from "react-hot-toast";
import useUser from "hooks/useUser";

interface ProfileBoxProps {
  profileUser?: IBasicUser;
}

function ProfileBox(props: ProfileBoxProps) {
  const { user, refetchUser } = useUser();
  const ownProfile = user && user._id === props.profileUser?._id;
  const [editing, setEditing] = useState(false);
  const instagramInput = useRef<HTMLInputElement>(null);
  const twitterInput = useRef<HTMLInputElement>(null);
  const facebookInput = useRef<HTMLInputElement>(null);
  const linkedinInput = useRef<HTMLInputElement>(null);
  const bioTextArea = useRef<HTMLTextAreaElement>(null);
  const displayNameInput = useRef<HTMLInputElement>(null);
  const pronounsInput = useRef<HTMLInputElement>(null);
  const hometownInput = useRef<HTMLInputElement>(null);
  const yearInput = useRef<HTMLInputElement>(null);
  const concentrationInput = useRef<HTMLInputElement>(null);
  const [comments, setComments] = useState<IComment[] | undefined>(undefined);
  const profileUserIsBlocked =
    props.profileUser && user?.blockedUsers.includes(props.profileUser._id);

  useEffect(() => {
    if (props.profileUser) {
      getUserComments(props.profileUser._id)
        .then((response) => {
          if (response.success) {
            setComments(response.payload.reverse());
          } else {
            console.log(response.message);
          }
        })
        .catch((error) => {
          console.error(error);
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

  const handleProfileEdit = () => {
    updateUserProfile(
      bioTextArea.current?.value ?? undefined,
      hometownInput.current?.value ?? undefined,
      handleInstagram(instagramInput.current?.value),
      handleTwitter(twitterInput.current?.value),
      handleFacebook(facebookInput.current?.value),
      handleLinkedIn(linkedinInput.current?.value),
      concentrationInput.current?.value ?? undefined,
      yearInput.current?.value ?? undefined,
      displayNameInput.current?.value ?? undefined,
      pronounsInput.current?.value ?? undefined
    )
      .then((response) => {
        if (response.success) {
          toast.success("Profile updated successfully!");
          refetchUser()
            .then(() => {
              setEditing(false);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          toast.error(
            (response.message as unknown as { message: string }).message
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logoutButton = (mobile: boolean) =>
    ownProfile && (
      <div
        className={styles.Logout + " " + (mobile ? styles.LogoutMobile : "")}
      >
        <MdLogout color="red"></MdLogout>
        <button className={styles.LogoutButton} onClick={logout}>
          Log out
        </button>
      </div>
    );

  return (
    <div className={styles.ProfileBox}>
      <div className={styles.LeftColumn}>
        <ProfilePicture
          hidden={editing}
          link={props.profileUser ? props.profileUser.profilePicture : ""}
        ></ProfilePicture>
        {profileUserIsBlocked && (
          <div className={styles.Blocked}>
            <MdBlock color="red"></MdBlock>
            <p>You have blocked this user</p>
          </div>
        )}
        {!editing && (
          <ProfileName
            name={
              props.profileUser
                ? props.profileUser.displayName ?? props.profileUser.name
                : ""
            }
            pronouns={props.profileUser ? props.profileUser.pronouns : ""}
          />
        )}
        {ownProfile && !editing && (
          <GenericProfileButton click={() => setEditing(true)} text={"Edit"} />
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
            props.profileUser?.displayName,
            props.profileUser?.pronouns,
            props.profileUser?.hometown,
            props.profileUser?.classYear,
            props.profileUser?.concentration,
          ]}
          refs={[
            displayNameInput,
            pronounsInput,
            hometownInput,
            yearInput,
            concentrationInput,
          ]}
          editing={editing}
        />

        {editing && (
          <div className={styles.SaveAndCancelButtons}>
            <div className={styles.ContainerOne}>
              <GenericProfileButton click={handleProfileEdit} text={"Save"} />
            </div>
            <div className={styles.ContainerOne}>
              <GenericProfileButton
                click={() => setEditing(false)}
                text={"Cancel"}
              />
            </div>
          </div>
        )}
        {logoutButton(false)}
      </div>
      <div className={styles.RightColumn}>
        <div className={styles.CommentsContainer}>
          <h2 className={styles.CommentsHeader}>Comments</h2>
          <div className={styles.ProfileCommentsList}>
            {comments === undefined ? (
              <div>Loading...</div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <ContextThread key={comment._id} thread={comment} />
              ))
            ) : (
              <p className={styles.ProfileCommentsEmpty}>No comments yet!</p>
            )}
          </div>
        </div>
        {logoutButton(true)}
      </div>
    </div>
  );
}

export default ProfileBox;
