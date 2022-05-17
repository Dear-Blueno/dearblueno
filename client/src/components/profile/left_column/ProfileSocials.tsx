import "./ProfileSocials.css";
import SocialButton from "./SocialButton";
import {
  RiFacebookCircleLine,
  RiTwitterLine,
  RiInstagramLine,
  RiLinkedinBoxLine,
} from "react-icons/ri";
import { IconType } from "react-icons/lib";

interface ProfileSocialsProps {
  links: (string | undefined)[];
  refs: React.RefObject<HTMLInputElement>[];
  editing: boolean;
}

function ProfileSocials(props: ProfileSocialsProps) {
  const icons: IconType[] = [
    RiInstagramLine,
    RiTwitterLine,
    RiFacebookCircleLine,
    RiLinkedinBoxLine,
  ];
  const iconNames = ["Instagram", "Twitter", "Facebook", "LinkedIn"];

  if (!props.editing && props.links.every((link) => !link)) {
    return null;
  }

  return (
    <div className="ProfileSocialsContainer">
      {props.editing ? (
        <div className="ProfileSocialsEditing">
          <div className="ProfileSocialsEditingHeader">Socials</div>
          {props.links.map((link, index) => {
            return (
              <div className="ProfileSocialsEditingEntry" key={index}>
                {icons[index]({
                  className: "ProfileSocialsIcon",
                  size: "1.2em",
                })}
                <input
                  type={"text"}
                  ref={props.refs[index]}
                  className="SocialInput"
                  defaultValue={link}
                  placeholder={iconNames[index]}
                ></input>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="ProfileSocials">
          {props.links.map((link, index) => {
            return link ? (
              <SocialButton key={index} link={link} icon={icons[index]} />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

export default ProfileSocials;
