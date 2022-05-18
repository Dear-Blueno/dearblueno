import "./ProfilePersonalInfo.css";
import { MdOutlineSchool, MdOutlineLocationOn } from "react-icons/md";
import { IoMdBook } from "react-icons/io";
import ProfilePersonalInfoEntry from "./ProfilePersonalInfoEntry";

interface ProfilePersonalInfoProps {
  contents: (string | undefined)[];
  refs: React.RefObject<HTMLInputElement>[];
  editing: boolean;
}

function ProfilePersonalInfo(props: ProfilePersonalInfoProps) {
  const icons = [MdOutlineLocationOn, MdOutlineSchool, IoMdBook];
  const placeholders = ["Hometown", "Graduation Year", "Concentration"];

  if (!props.editing && props.contents.every((content) => !content)) {
    return null;
  }

  return (
    <div>
      {props.editing ? (
        <div className="ProfilePersonalInfoEditing">
          <div className="ProfilePersonalInfoEditingHeader">
            Personal Information
          </div>
          {props.contents.map((content, index) => {
            return (
              <div className="ProfilePersonalInfoEditingEntry" key={index}>
                {icons[index]({
                  className: "PersonalInfoIcon",
                  size: "1.2em",
                })}
                <input
                  type={"text"}
                  ref={props.refs[index]}
                  className="PersonalInfoInput"
                  defaultValue={content}
                  placeholder={placeholders[index]}
                ></input>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="ProfilePersonalInfo">
          {props.contents.map((content, index) => {
            return content ? (
              <ProfilePersonalInfoEntry
                key={index}
                content={content}
                icon={icons[index]}
              />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

export default ProfilePersonalInfo;
