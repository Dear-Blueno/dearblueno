import styles from "./MainNavigation.module.scss";
import LogoIcon from "images/logo512.png";
import { NextRouter, useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import MainSidebarProfile from "./MainSidebarProfile";
import useUser from "hooks/useUser";
import { IconType } from "react-icons";
import {
  AiFillHome,
  AiFillInfoCircle,
  AiOutlineHome,
  AiOutlineInfoCircle,
} from "react-icons/ai";
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
} from "react-icons/md";
import {
  IoPersonOutline,
  IoPerson,
  IoInformationCircleOutline,
  IoInformationCircle,
  // IoAdd,
} from "react-icons/io5";
import IUser from "types/IUser";

interface MainSidebarItem {
  path: string;
  label: string;
  requiresUser: boolean;
  outlineIcon: IconType;
  filledIcon: IconType;
  outlineClassName?: string;
  filledClassName?: string;
}

export default function MainNavigation() {
  const { user, isLoadingUser: isLoading } = useUser();
  const router = useRouter();

  return (
    <>
      <MainSidebar user={user} isLoading={isLoading} router={router} />
      <MainFooter user={user} isLoading={isLoading} router={router} />
    </>
  );
}

const MainSidebar = (props: {
  user: IUser | undefined;
  isLoading: boolean;
  router: NextRouter;
}) => {
  const { user, isLoading, router } = props;
  const unreadNotificationCount = user?.notifications.filter(
    (notification) => !notification.read
  ).length;
  const NotifBool = unreadNotificationCount && unreadNotificationCount > 0;

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
                    <Link href={item.path} scroll={false} key={item.path}>
                      <a className={styles.SidebarListItemLink}>
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
                          {router.pathname === item.path ? (
                            <item.filledIcon
                              className={
                                item.filledClassName &&
                                styles[item.filledClassName]
                              }
                              title={item.label}
                            />
                          ) : (
                            <div className={styles.NotificationsIconContainer}>
                              <item.outlineIcon
                                className={
                                  item.outlineClassName &&
                                  styles[item.outlineClassName]
                                }
                                title={item.label}
                              />
                              {item.outlineIcon === MdNotificationsNone &&
                              NotifBool ? (
                                <div
                                  className={styles.UnreadNotif}
                                  // the count of unread notifs that is stored in the user object
                                >
                                  {unreadNotificationCount}
                                </div>
                              ) : null}
                            </div>
                          )}
                          <span className={styles.SidebarListItemLabel}>
                            {item.label}
                          </span>
                        </li>
                      </a>
                    </Link>
                  )
              )}
            </ul>
            {/* <Link href="/submit">
              <a className={styles.NewPostButtonLink}>
                <button className={styles.NewPostButton}>
                  <IoAdd className={styles.NewPostButtonIcon} size="3em" />
                  <span>Submit</span>
                </button>
              </a>
            </Link> */}
          </>
        )}
      </div>
      <MainSidebarProfile />
    </nav>
  );
};

const MainFooter = (props: {
  user: IUser | undefined;
  isLoading: boolean;
  router: NextRouter;
}) => {
  const { user, isLoading, router } = props;
  const unreadNotificationCount = user?.notifications.filter(
    (notification) => !notification.read
  ).length;
  const NotifBool = unreadNotificationCount && unreadNotificationCount > 0;

  return (
    <nav className={styles.Footer}>
      {!isLoading && (
        <ul className={styles.SidebarList}>
          {footerItems.map(
            (item) =>
              (user || !item.requiresUser) && (
                <Link href={item.path} scroll={false} key={item.path}>
                  <a className={styles.SidebarListItemLink}>
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
                      {router.pathname === item.path ? (
                        <item.filledIcon
                          className={
                            item.filledClassName && styles[item.filledClassName]
                          }
                          title={item.label}
                          size="0.8em"
                        />
                      ) : (
                        <div className={styles.NotificationsIconContainer}>
                          <item.outlineIcon
                            className={
                              item.outlineClassName &&
                              styles[item.outlineClassName]
                            }
                            title={item.label}
                            size="0.8em"
                          />
                          {item.outlineIcon === MdNotificationsNone &&
                          NotifBool ? (
                            <div
                              className={styles.UnreadNotif}
                              // the count of unread notifs that is stored in the user object
                            >
                              {unreadNotificationCount}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </li>
                  </a>
                </Link>
              )
          )}
          {!user && (
            <Link href="/about">
              <a className={styles.SidebarListItemLink}>
                <li
                  key="about"
                  className={
                    router.pathname === "/about"
                      ? styles.SidebarListItem +
                        " " +
                        styles.SidebarListItemActive
                      : styles.SidebarListItem
                  }
                >
                  {router.pathname === "/about" ? (
                    <AiFillInfoCircle
                      className={styles.SidebarListItemIcon}
                      title="Login"
                      size="0.8em"
                    />
                  ) : (
                    <AiOutlineInfoCircle
                      className={styles.SidebarListItemIcon}
                      title="Login"
                      size="0.8em"
                    />
                  )}
                </li>
              </a>
            </Link>
          )}
        </ul>
      )}
    </nav>
  );
};

const sidebarItems: MainSidebarItem[] = [
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
    requiresUser: true,
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
];

const footerItems: MainSidebarItem[] = [
  {
    path: "/",
    label: "Home",
    requiresUser: false,
    outlineIcon: AiOutlineHome,
    filledIcon: AiFillHome,
  },

  {
    path: "/events",
    label: "Events",
    requiresUser: true,
    outlineIcon: RiCalendarEventLine,
    filledIcon: RiCalendarEventFill,
  },
  // {
  //   path: "/submit",
  //   label: "Submit",
  //   requiresUser: false,
  //   outlineIcon: IoAdd,
  //   filledIcon: IoAdd,
  //   outlineClassName: "SubmitIconOutline",
  //   filledClassName: "SubmitIconFilled",
  // },
  {
    path: "/notifications",
    label: "Notifications",
    requiresUser: true,
    outlineIcon: MdNotificationsNone,
    filledIcon: MdNotifications,
  },
  {
    path: "/profile",
    label: "Profile",
    requiresUser: true,
    outlineIcon: IoPersonOutline,
    filledIcon: IoPerson,
    outlineClassName: "ProfileIconOutline",
  },
];
