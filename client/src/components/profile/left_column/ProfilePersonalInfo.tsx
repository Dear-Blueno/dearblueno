import styles from "./ProfilePersonalInfo.module.scss";
import {
  MdOutlineSchool,
  MdOutlineLocationOn,
  MdTransgender,
} from "react-icons/md";
import { IoMdBook } from "react-icons/io";
import { BiFace } from "react-icons/bi";
import ProfilePersonalInfoEntry from "./ProfilePersonalInfoEntry";
import { DialogContent, DialogOverlay } from "@reach/dialog";
import { useState } from "react";

interface ProfilePersonalInfoProps {
  contents: (string | undefined)[];
  refs: React.RefObject<HTMLInputElement>[];
  editing: boolean;
}

function ProfilePersonalInfo(props: ProfilePersonalInfoProps) {
  const icons = [
    BiFace,
    MdTransgender,
    MdOutlineLocationOn,
    MdOutlineSchool,
    IoMdBook,
  ];
  const placeholders = [
    "Preferred Name",
    "Pronouns",
    "Hometown",
    "Graduation Year",
    "Concentration",
  ];

  const [isOpen, setIsOpen] = useState(false);

  if (!props.editing && props.contents.every((content) => !content)) {
    return null;
  }

  return (
    <div>
      <DialogOverlay
        style={{ background: "hsla(0, 0%, 0%, 0.2)" }}
        isOpen={isOpen}
        onDismiss={close}
      >
        <DialogContent
          aria-label="Preferred Name Popup"
          className={styles.Popup}
        >
          <div className={styles.PopupContent}>
            <strong>{"You just changed your preferred name."}</strong>
            <br />
            <p>
              Dear Blueno does not support anonymous profiles, impersonating
              others, or otherwise obstructing your identity. Your preferred
              name should be the name you most often go by in real life, ideally
              also including your family/last name (if you have one).
              <br />
              <br />
              Any comments you do not want associated with your profile should
              be posted with the anonymous comment feature. Changing your
              preferred name is not a substitute for anonymous commenting.
              <br />
              <br />
              Inaccurate preferred names will be removed.
            </p>
            <br />
            <div className={styles.PopupButtons}>
              <button
                className={styles.PopupAction}
                onClick={() => {
                  setIsOpen(false);
                  if (props.refs[0].current) {
                    props.refs[0].current.value = "";
                  }
                }}
                tabIndex={-1}
              >
                Cancel
              </button>
              <button
                className={styles.PopupAction}
                onClick={() => {
                  setIsOpen(false);
                }}
                tabIndex={-1}
              >
                Ok
              </button>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
      {props.editing ? (
        <div className={styles.ProfilePersonalInfoEditing}>
          <div className={styles.ProfilePersonalInfoEditingHeader}>
            Personal Information
          </div>
          {props.contents.map((content, index) => {
            return (
              <div
                className={styles.ProfilePersonalInfoEditingEntry}
                key={index}
              >
                {icons[index]({
                  className: "PersonalInfoIcon",
                  size: "1.2em",
                  title: placeholders[index],
                })}
                <input
                  type={"text"}
                  ref={props.refs[index]}
                  className={styles.PersonalInfoInput}
                  defaultValue={content}
                  placeholder={placeholders[index]}
                  onBlur={() => {
                    const bool = props.refs[index].current
                      ? props.refs[index].current?.value
                      : "";
                    if (placeholders[index] === "Preferred Name" && bool) {
                      setIsOpen(true);
                    }
                  }}
                ></input>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.ProfilePersonalInfo}>
          {props.contents.map((content, index) => {
            return content ? (
              index <= 1 ? null : (
                <ProfilePersonalInfoEntry
                  key={index}
                  content={content}
                  icon={icons[index]}
                />
              )
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

export default ProfilePersonalInfo;
