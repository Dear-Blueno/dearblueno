import styles from "./MainSidebar.module.scss";
import LogoIcon from "images/logo512.png";
import { useRouter } from "next/router";
import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";

type MainSidebarItem = {
  path: string;
  label: string;
};

export default function MainSidebar() {
  const router = useRouter();
  const sidebarItems: MainSidebarItem[] = useMemo(
    () => [
      {
        path: "/",
        label: "Home",
      },
      {
        path: "/notifications",
        label: "Notifications",
      },
      {
        path: "/bookmarks",
        label: "Bookmarks",
      },
      {
        path: "/search",
        label: "Search",
      },
      {
        path: "/profile",
        label: "Profile",
      },
      {
        path: "/about",
        label: "About",
      },
    ],
    []
  );

  return (
    <nav className={styles.Sidebar}>
      <Link href="/">
        <a className={styles.SidebarLogo}>
          <Image src={LogoIcon} alt="Blueno" />
        </a>
      </Link>
      <ul className={styles.SidebarList}>
        {sidebarItems.map((item) => (
          <li
            key={item.path}
            className={
              router.pathname === item.path
                ? styles.SidebarListItem + " " + styles.SidebarListItemActive
                : styles.SidebarListItem
            }
          >
            <Link href={item.path} scroll={false}>
              <a className={styles.SidebarListItemLink}>{item.label}</a>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/submit">
        <a className={styles.NewPostButtonLink}>
          <button className={styles.NewPostButton}>New Post</button>
        </a>
      </Link>
    </nav>
  );
}
