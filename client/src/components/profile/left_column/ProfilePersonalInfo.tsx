import styles from "./ProfilePersonalInfo.module.scss";
import {
  MdOutlineSchool,
  MdOutlineLocationOn,
  MdTransgender,
} from "react-icons/md";
import { IoMdBook } from "react-icons/io";
import { BiFace } from "react-icons/bi";
import ProfilePersonalInfoEntry from "./ProfilePersonalInfoEntry";

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
    "Display Name",
    "Pronouns",
    "Hometown",
    "Graduation Year",
    "Concentration",
  ];

  if (!props.editing && props.contents.every((content) => !content)) {
    return null;
  }

  return (
    <div>
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
