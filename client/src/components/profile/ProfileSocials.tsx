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
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  editing: boolean;
}

function ProfileSocials(props: ProfileSocialsProps) {
  const links = [
    props.instagram,
    props.twitter,
    props.facebook,
    props.linkedin,
  ];
  const icons: IconType[] = [
    RiInstagramLine,
    RiTwitterLine,
    RiFacebookCircleLine,
    RiLinkedinBoxLine,
  ];
  const iconNames = ["Instagram", "Twitter", "Facebook", "LinkedIn"];

  return (
    <div className="ProfileSocialsContainer">
      {props.editing ? (
        <div className="ProfileSocialsEditing">
          <div className="ProfileSocialsEditingHeader">Socials</div>
          {links.map((link, index) => {
            return (
              <div className="ProfileSocialsEditingEntry">
                {icons[index]({
                  className: "ProfileSocialsIcon",
                  size: "1.2em",
                })}
                <input
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
          {links.map((link, index) => {
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
