import styles from "./ProfileHoverCard.module.scss";
import { IBasicUser } from "types/IUser";
import {
  RiFacebookCircleLine,
  RiTwitterLine,
  RiInstagramLine,
  RiLinkedinBoxLine,
} from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";

type ProfileHoverCardProps = {
  hoverUser: IBasicUser;
  leaveAction: () => void;
  enterAction: () => void;
};

function ProfileHoverCard(props: ProfileHoverCardProps) {
  let attribute = "";

  props.hoverUser?.concentration && (attribute = props.hoverUser.concentration);
  props.hoverUser?.hometown && (attribute = props.hoverUser.hometown);
  props.hoverUser?.classYear &&
    (attribute = "Class of " + props.hoverUser.classYear);

  return (
    <div
      className={styles.ProfileHoverCard}
      onMouseEnter={props.enterAction}
      onMouseLeave={props.leaveAction}
    >
      <Link href={`/profile/${props.hoverUser._id}`}>
        <div className={styles.HoverCardImage}>
          <Image
            src={props.hoverUser?.profilePicture}
            alt={props.hoverUser?.name}
            width={70}
            height={70}
          />
        </div>
      </Link>
      <div className={styles.HoverCardSideCol}>
        <a
          href={`/profile/${props.hoverUser?._id}`}
          className={styles.HoverCardName}
        >
          <p>{props.hoverUser?.name}</p>
        </a>
        <div className={styles.SocialBar}>
          {props.hoverUser?.instagram && (
            <a
              href={props.hoverUser?.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="SocialLink"
            >
              <RiInstagramLine className={styles.SocialIcon} />
            </a>
          )}
          {props.hoverUser?.twitter && (
            <a
              href={props.hoverUser?.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="SocialLink"
            >
              <RiTwitterLine className={styles.SocialIcon} />
            </a>
          )}
          {props.hoverUser?.facebook && (
            <a
              href={props.hoverUser?.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="SocialLink"
            >
              <RiFacebookCircleLine className={styles.SocialIcon} />
            </a>
          )}
          {props.hoverUser?.linkedin && (
            <a
              href={props.hoverUser?.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="SocialLink"
            >
              <RiLinkedinBoxLine className={styles.SocialIcon} />
            </a>
          )}
        </div>
        <p>{attribute}</p>
      </div>
    </div>
  );
}

export default ProfileHoverCard;
