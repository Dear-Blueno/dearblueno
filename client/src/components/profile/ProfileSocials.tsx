import "./ProfileSocials.css";
import SocialButton from "./SocialButton";
import {
  RiFacebookCircleLine,
  RiTwitterLine,
  RiInstagramLine,
  RiLinkedinBoxLine,
} from "react-icons/ri";

interface ProfileSocialsProps {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
}

function ProfileSocials(props: ProfileSocialsProps) {
  const links = [
    props.instagram,
    props.twitter,
    props.facebook,
    props.linkedin,
  ];
  const icons = [
    RiInstagramLine,
    RiTwitterLine,
    RiFacebookCircleLine,
    RiLinkedinBoxLine,
  ];

  return (
    <div className="ProfileSocials">
      {links.map((link, index) => {
        return link ? (
          <SocialButton key={index} link={link} icon={icons[index]} />
        ) : null;
      })}
    </div>
  );
}

export default ProfileSocials;
