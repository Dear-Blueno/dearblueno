import styles from "./MainSidebar.module.scss";
import LogoIcon from "images/logo512.png";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";
import MainSidebarProfile from "./MainSidebarProfile";
import useUser from "hooks/useUser";

type MainSidebarItem = {
  path: string;
  label: string;
  requiresUser: boolean;
};

export default function MainSidebar() {
  const { user } = useUser();
  const router = useRouter();
  const sidebarItems: MainSidebarItem[] = useMemo(
    () => [
      {
        path: "/",
        label: "Home",
        requiresUser: false,
      },
      {
        path: "/notifications",
        label: "Notifications",
        requiresUser: true,
      },
      {
        path: "/bookmarks",
        label: "Bookmarks",
        requiresUser: true,
      },
      {
        path: "/search",
        label: "Search",
        requiresUser: false,
      },
      {
        path: "/profile",
        label: "Profile",
        requiresUser: true,
      },
      {
        path: "/about",
        label: "About",
        requiresUser: false,
      },
    ],
    []
  );

  return (
    <nav className={styles.Sidebar}>
      <div className={styles.SidebarTop}>
        <Link href="/">
          <a className={styles.SidebarLogo}>
            <Image src={LogoIcon} alt="Blueno" width={80} height={80} />
          </a>
        </Link>
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
                    <a className={styles.SidebarListItemLink}>{item.label}</a>
                  </Link>
                </li>
              )
          )}
        </ul>
        <Link href="/submit">
          <a className={styles.NewPostButtonLink}>
            <button className={styles.NewPostButton}>New Post</button>
          </a>
        </Link>
      </div>
      <MainSidebarProfile />
    </nav>
  );
}
