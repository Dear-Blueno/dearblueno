import Link from "next/link";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FiSettings } from "react-icons/fi";
import { MdBookmarkBorder, MdBlock } from "react-icons/md";
import { RiShieldCheckLine } from "react-icons/ri";
import useUser from "../../../hooks/useUser";
import { blockUser } from "../../../gateways/UserGateway";
import styles from "./ProfilePageHeader.module.scss";
import { IBasicUser } from "../../../types/IUser";

interface ProfilePageHeaderProps {
  self: boolean;
  targetUser: IBasicUser;
}

export default function ProfilePageHeader(props: ProfilePageHeaderProps) {
  const { user } = useUser();

  return (
    <div className={styles.FeedHeader}>
      {props.self ? (
        <>
          {user?.moderator ? (
            <Link href="/moderator">
              <RiShieldCheckLine className={styles.ModIcon} />
            </Link>
          ) : null}
          <Link href="/about">
            <AiOutlineInfoCircle className={styles.InfoIcon} />
          </Link>
          <Link href="/bookmarks">
            <MdBookmarkBorder className={styles.BookmarkIcon} />
          </Link>
          <Link href="/settings">
            <FiSettings className={styles.SettingsIcon} />
          </Link>
        </>
      ) : (
        <MdBlock
          className={styles.BlockIcon}
          title="Block User"
          onClick={() => void blockUser(props.targetUser._id)}
        />
      )}
    </div>
  );
}
