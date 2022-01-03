import "./ProfileSocials.css";
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
}

function ProfileSocials(props: ProfileSocialsProps) {
  return (
    <div className="ProfileSocials">
      <RiInstagramLine className="SocialButton" size="2em" />
      <RiTwitterLine className="SocialButton" size="2em" />
      <RiFacebookCircleLine className="SocialButton" size="2em" />
      <RiLinkedinBoxLine className="SocialButton" size="2em" />
    </div>
  );
}

export default ProfileSocials;
