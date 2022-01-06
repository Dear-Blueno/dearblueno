import "./ProfilePersonalInfo.css";
import { MdOutlineSchool, MdOutlineLocationOn } from "react-icons/md";
import { IoMdBook } from "react-icons/io";
import ProfilePersonalInfoEntry from "./ProfilePersonalInfoEntry";

interface ProfilePersonalInfoProps {
  year?: string;
  hometown?: string;
  concentration?: string;
  editing: boolean;
}

function ProfilePersonalInfo(props: ProfilePersonalInfoProps) {
  const contents = [props.hometown, props.year, props.concentration];
  const icons = [MdOutlineLocationOn, MdOutlineSchool, IoMdBook];
  const placeholders = ["Hometown", "Graduation Year", "Concentration"];
  return (
    <div>
      {props.editing ? (
        <div className="ProfilePersonalInfoEditing">
          <div className="ProfilePersonalInfoEditingHeader">
            Personal Information
          </div>
          {contents.map((content, index) => {
            return (
              <div className="ProfilePersonalInfoEditingEntry">
                {icons[index]({
                  className: "PersonalInfoIcon",
                  size: "1.2em",
                })}
                <input
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
          {contents.map((content, index) => {
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
