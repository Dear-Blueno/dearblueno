import styles from "./MainSidebar.module.scss";
import LogoIcon from "images/logo512.png";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";
import MainSidebarProfile from "./MainSidebarProfile";
import useUser from "hooks/useUser";
import { IconType } from "react-icons";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import {
  RiSearch2Line,
  RiCalendarEventLine,
  RiCalendarEventFill,
} from "react-icons/ri";
import {
  MdNotificationsNone,
  MdNotifications,
  MdBookmark,
  MdBookmarkBorder,
  MdPostAdd,
} from "react-icons/md";
import {
  IoPersonOutline,
  IoPerson,
  IoInformationCircleOutline,
  IoInformationCircle,
} from "react-icons/io5";

type MainSidebarItem = {
  path: string;
  label: string;
  requiresUser: boolean;
  outlineIcon: IconType;
  filledIcon: IconType;
  outlineClassName?: string;
  filledClassName?: string;
};

export default function MainSidebar() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const sidebarItems: MainSidebarItem[] = useMemo(
    () => [
      {
        path: "/",
        label: "Home",
        requiresUser: false,
        outlineIcon: AiOutlineHome,
        filledIcon: AiFillHome,
      },
      {
        path: "/notifications",
        label: "Notifications",
        requiresUser: true,
        outlineIcon: MdNotificationsNone,
        filledIcon: MdNotifications,
      },
      {
        path: "/events",
        label: "Events",
        requiresUser: false,
        outlineIcon: RiCalendarEventLine,
        filledIcon: RiCalendarEventFill,
      },
      {
        path: "/bookmarks",
        label: "Bookmarks",
        requiresUser: true,
        outlineIcon: MdBookmarkBorder,
        filledIcon: MdBookmark,
      },
      {
        path: "/search",
        label: "Search",
        requiresUser: false,
        outlineIcon: RiSearch2Line,
        filledIcon: RiSearch2Line,
        filledClassName: "SearchIconFilled",
      },
      {
        path: "/profile",
        label: "Profile",
        requiresUser: true,
        outlineIcon: IoPersonOutline,
        filledIcon: IoPerson,
        outlineClassName: "ProfileIconOutline",
      },
      {
        path: "/about",
        label: "About",
        requiresUser: false,
        outlineIcon: IoInformationCircleOutline,
        filledIcon: IoInformationCircle,
        outlineClassName: "AboutIconOutline",
      },
    ],
    []
  );

  return (
    <nav className={styles.Sidebar}>
      <div className={styles.SidebarTop}>
        <Link href="/">
          <a className={styles.SidebarLogo}>
            <Image src={LogoIcon} alt="Blueno" priority />
          </a>
        </Link>
        {!isLoading && (
          <>
            <ul className={styles.SidebarList}>
              {sidebarItems.map(
                (item) =>
                  (user || !item.requiresUser) && (
                    <li
                      key={item.path}
                      className={
                        router.pathname === item.path
                          ? styles.SidebarListItem +
                            " " +
                            styles.SidebarListItemActive
                          : styles.SidebarListItem
                      }
                    >
                      <Link href={item.path} scroll={false}>
                        <a className={styles.SidebarListItemLink}>
                          {router.pathname === item.path ? (
                            <item.filledIcon
                              className={
                                item.filledClassName &&
                                styles[item.filledClassName]
                              }
                              title={item.label}
                            />
                          ) : (
                            <item.outlineIcon
                              className={
                                item.outlineClassName &&
                                styles[item.outlineClassName]
                              }
                              title={item.label}
                            />
                          )}
                          <span className={styles.SidebarListItemLabel}>
                            {item.label}
                          </span>
                        </a>
                      </Link>
                    </li>
                  )
              )}
            </ul>
            <Link href="/submit">
              <a className={styles.NewPostButtonLink}>
                <button className={styles.NewPostButton}>
                  <MdPostAdd
                    className={styles.NewPostButtonIcon}
                    color="black"
                    size="2em"
                  />
                  <span>New Post</span>
                </button>
              </a>
            </Link>
          </>
        )}
      </div>
      <MainSidebarProfile />
    </nav>
  );
}
